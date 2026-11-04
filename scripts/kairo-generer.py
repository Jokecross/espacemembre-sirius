#!/usr/bin/env python3
"""
Le parcours Kairo, généré depuis le brief (~/Desktop/Kairo-brief-espace-membre.md).

Rien n'est recopié à la main : un prompt doit arriver caractère pour caractère
dans le presse-papier de l'élève. Le script sort deux fichiers :

  src/lib/kairo.js          les textes autour des prompts (versionné, aucun prompt)
  scripts/kairo-prompts.sql les 16 prompts, à passer dans Supabase (NON versionné :
                            les dépôts sont publics, les prompts ne doivent pas y être)

Il s'arrête sur toute ligne du brief qu'il ne sait pas ranger : mieux vaut une
erreur qu'un texte qui disparaît sans bruit. La section 12 (notes pour l'équipe)
n'est jamais lue.

    python3 scripts/kairo-generer.py [chemin-du-brief] [fichier-json-de-controle]
"""
import json, os, re, sys

BRIEF = sys.argv[1] if len(sys.argv) > 1 else os.path.expanduser('~/Desktop/Kairo-brief-espace-membre.md')
RACINE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
lignes = open(BRIEF, encoding='utf-8').read().split('\n')

TITRES_PROMPTS = {
    'PROMPT_J0': 'Le prompt du jour 0',
    'PROMPT_J1_AGENCE': 'Jour 1 · Mon agence',
    'PROMPT_J1_COACH': 'Jour 1 · Mon coach',
    'PROMPT_J2': 'Le prompt du jour 2',
    'PROMPT_J3': 'Le prompt du jour 3',
    'PROMPT_J4': 'Le prompt du jour 4',
    'PROMPT_J5': 'Le prompt du jour 5',
    'PROMPT_J6': 'Le prompt du jour 6',
    'PROMPT_J7_DEVIS': 'Jour 7 · Le devis',
    'PROMPT_J7_FACTURES': "Jour 7 · Les factures et l'argent",
}
SOS = ['SOS_BUG', 'SOS_DESIGN', 'SOS_MENU', 'SOS_ACCUEIL', 'SOS_COACH', 'SOS_EXPERT']

def sections():
    """Les sections « ## n. … », de la 2 à la 11."""
    debut, code = None, False
    for i, l in enumerate(lignes):
        if l.startswith('```'):
            code = not code
        if code:
            continue
        m = re.match(r'^## (\d+)\. (.*)$', l)
        if m or l.startswith('## '):
            if debut:
                yield debut[0], debut[1], debut[2], i
            debut = (int(m[1]), m[2], i + 1) if m else None

def bloc_code(i):
    """Le contenu exact d'un bloc ``` qui s'ouvre à la ligne i."""
    assert lignes[i] == '```text', (i, lignes[i])
    j = i + 1
    while lignes[j] != '```':
        j += 1
    return '\n'.join(lignes[i + 1:j]), j

guillemets = lambda s: re.fullmatch(r'« (.*) »', s, re.S)

def texte(s, i):
    m = guillemets(s)
    if not m:
        raise SystemExit(f'ligne {i + 1} : texte élève attendu entre « » : {s[:80]}')
    return m[1]

prompts, jours, secours, points, sos_intro = {}, [], [], None, None

for num, titre, a, b in sections():
    if num in (0, 1, 12):
        continue

    if num == 2:
        points = [texte(l[2:], i) for i, l in enumerate(lignes[a:b], a) if l.startswith('- ')]
        continue

    if num == 11:
        i = a
        while i < b:
            l = lignes[i]
            if not l or l == '---':
                i += 1
            elif l.startswith('**Intro :** '):
                sos_intro = texte(l[len('**Intro :** '):], i); i += 1
            elif (m := re.match(r'^### (.*) · `(SOS_\w+)`$', l)):
                secours.append({'id': m[2], 'titre': m[1], 'avant': None}); i += 1
            elif l.startswith('**Texte au-dessus :** '):
                secours[-1]['avant'] = texte(l[len('**Texte au-dessus :** '):], i); i += 1
            elif l == '```text':
                prompts[secours[-1]['id']], i = bloc_code(i); i += 1
            else:
                raise SystemExit(f'ligne {i + 1} non rangée : {l[:80]}')
        continue

    m = re.match(r'^Jour (\d) · (.*)$', titre)
    if not m:
        raise SystemExit(f'section {num} inattendue : {titre}')
    jour = {'jour': int(m[1]), 'titre': m[2], 'construit': None, 'blocs': []}
    liste = None  # le bloc de liste en cours de remplissage
    i = a
    while i < b:
        l = lignes[i]
        if not l or l == '---':
            i += 1; continue
        if (x := re.match(r"^\*\*Ce que tu construis aujourd'hui :\*\* (.*)$", l)):
            jour['construit'] = texte(x[1], i); liste = None
        elif l == '**Les étapes :**':
            liste = {'type': 'etapes', 'debut': None, 'items': []}; jour['blocs'].append(liste)
        elif l == '**Bon à savoir :**':
            liste = {'type': 'savoir', 'items': []}; jour['blocs'].append(liste)
        elif l in ('**Tu as réussi si…**', '### Tu as réussi si…'):
            liste = {'type': 'reussite', 'items': []}; jour['blocs'].append(liste)
        elif (x := re.match(r'^\*\*(Si .*) \(encadré\) :\*\*$', l)):
            liste = {'type': 'aide', 'titre': x[1], 'debut': None, 'items': []}; jour['blocs'].append(liste)
        elif (x := re.match(r'^### (Partie \d · .*)$', l)):
            jour['blocs'].append({'type': 'partie', 'titre': x[1]}); liste = None
        elif (x := re.match(r'^\*\*Le prompt · `(\w+)`\*\*$', l)):
            pid = x[1]
            i += 1
            while not lignes[i]:
                i += 1
            prompts[pid], i = bloc_code(i)
            jour['blocs'].append({'type': 'prompt', 'id': pid, 'titre': TITRES_PROMPTS[pid]}); liste = None
        elif (x := re.match(r'^\*\*Message de fin, sous le jour 7 :\*\* (.*)$', l)):
            jour['blocs'].append({'type': 'fin', 'texte': texte(x[1], i)}); liste = None
        elif (x := re.match(r'^(\d+)\. (.*)$', l)) and liste and 'debut' in liste:
            if liste['debut'] is None:
                liste['debut'] = int(x[1])
            liste['items'].append(texte(x[2], i))
        elif l.startswith('- ') and liste and 'debut' not in liste:
            liste['items'].append(texte(l[2:], i))
        else:
            raise SystemExit(f'ligne {i + 1} non rangée : {l[:80]}')
        i += 1
    jours.append(jour)

attendus = list(TITRES_PROMPTS) + SOS
assert sorted(prompts) == sorted(attendus), set(prompts) ^ set(attendus)
assert [j['jour'] for j in jours] == list(range(8))
assert len(points) == 8 and sos_intro and len(secours) == 6
for j in jours:
    assert j['construit'], j['jour']

# ---------- src/lib/kairo.js ----------
js = lambda v: json.dumps(v, ensure_ascii=False, indent=2)
chemin_js = os.path.join(RACINE, 'src/lib/kairo.js')
open(chemin_js, 'w', encoding='utf-8').write(f"""/* Généré par scripts/kairo-generer.py depuis le brief : ne pas modifier à la main.

   Les textes du parcours « Construis ton outil Kairo ». Les prompts n'y sont pas :
   ils vivent dans la base, pour qu'un jour à venir ne parte pas dans le navigateur
   et qu'on puisse les corriger depuis le back-office. Un bloc « prompt » ne porte
   que l'identifiant, relié à sa colonne par `lib/useWorkshop.js`. */

export const COMMENT_CA_MARCHE = {js(points)}

export const JOURS = {js(jours)}

export const SECOURS = {js({'intro': sos_intro, 'prompts': secours})}
""")

# ---------- scripts/kairo-prompts.sql ----------
for t in prompts.values():
    assert '$kairo$' not in t
q = lambda t: f'$kairo${t}$kairo$'
sql = ["""-- Les 16 prompts du parcours Kairo. Généré par scripts/kairo-generer.py.
-- À coller dans Supabase → SQL Editor → Run. Rejouable.
-- Ne touche qu'aux colonnes de prompts : ni aux vidéos, ni aux modules, ni aux accès.
-- Ce fichier reste hors du dépôt : le dépôt est public.

alter table public.workshop_reglages
  add column if not exists prompts_sos jsonb not null default '{}'::jsonb;

comment on column public.workshop_reglages.prompts_sos is
  'Les prompts de la page « Si ça ne marche pas », par identifiant (SOS_BUG…).';
"""]
sql.append(f"update public.workshop_reglages set\n  prompt_j0 = {q(prompts['PROMPT_J0'])},\n  prompts_sos = jsonb_build_object(\n"
           + ',\n'.join(f"    '{s}', {q(prompts[s])}" for s in SOS)
           + "\n  ),\n  updated_at = now()\nwhere id = 1;\n")
par_jour = {1: ('PROMPT_J1_AGENCE', 'PROMPT_J1_COACH'), 2: ('PROMPT_J2', None), 3: ('PROMPT_J3', None),
            4: ('PROMPT_J4', None), 5: ('PROMPT_J5', None), 6: ('PROMPT_J6', None),
            7: ('PROMPT_J7_DEVIS', 'PROMPT_J7_FACTURES')}
for n, (p1, p2) in par_jour.items():
    deux = q(prompts[p2]) if p2 else 'null'
    sql.append(f"update public.workshop_jours set\n  prompt = {q(prompts[p1])},\n  prompt_2 = {deux},\n  updated_at = now()\nwhere jour = {n};\n")
sql.append("""select (select count(*) from public.workshop_jours where prompt is not null) as jours_remplis,
       (select count(*) from public.workshop_jours where prompt_2 is not null) as seconds_prompts,
       (select length(prompt_j0) from public.workshop_reglages where id = 1) as caracteres_j0,
       (select count(*) from public.workshop_reglages, jsonb_object_keys(prompts_sos)) as prompts_sos;
""")
open(os.path.join(RACINE, 'scripts/kairo-prompts.sql'), 'w', encoding='utf-8').write('\n'.join(sql))

if len(sys.argv) > 2:
    json.dump({'prompts': prompts, 'par_jour': par_jour}, open(sys.argv[2], 'w', encoding='utf-8'), ensure_ascii=False)

print(f"{len(prompts)} prompts, {sum(len(t) for t in prompts.values()):,} caractères")
for j in jours:
    print(j['jour'], j['titre'], [b['type'] for b in j['blocs']])
