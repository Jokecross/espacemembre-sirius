import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'
import { JOURS, SECOURS } from '../lib/kairo.js'

/**
 * Le back-office du workshop : le contenu des sept jours, et les deux
 * réglages qui décident du rythme.
 *
 * Le contenu vit ici et pas dans le code : changer une vidéo ou un prompt
 * ne demande ni déploiement ni développeur.
 */
export default function WorkshopAdmin() {
  const [jours, setJours] = useState(null)
  const [reglages, setReglages] = useState(null)
  const [ouvert, setOuvert] = useState(null)

  async function charger() {
    const [{ data: j }, { data: r }] = await Promise.all([
      supabase.from('workshop_jours').select('*').order('jour'),
      supabase.from('workshop_reglages').select('*').eq('id', 1).maybeSingle(),
    ])
    setJours(j || [])
    setReglages(r)
  }

  useEffect(() => {
    charger()
  }, [])

  if (!jours) return <p className="text-muted">Chargement…</p>

  return (
    <>
      {reglages && <Reglages reglages={reglages} onChange={charger} />}

      <h2 className="mt-8 text-lg">Les sept jours</h2>
      <p className="mt-1 text-sm">
        Pour chaque jour : le ou les prompts, et une vidéo si besoin. Un jour s'ouvre à minuit, à
        l'heure de l'élève, après le précédent. Les textes autour des prompts viennent du brief
        Kairo et se changent dans le code.
      </p>

      <div className="mt-4 space-y-3">
        {jours.map((j) => (
          <JourAdmin
            key={j.jour}
            jour={j}
            ouvert={ouvert === j.jour}
            onToggle={() => setOuvert(ouvert === j.jour ? null : j.jour)}
            onSave={charger}
          />
        ))}
      </div>
    </>
  )
}

function Reglages({ reglages, onChange }) {
  const [form, setForm] = useState(reglages)
  const [busy, setBusy] = useState(false)
  const [erreur, setErreur] = useState('')

  async function enregistrer(e) {
    e.preventDefault()
    setBusy(true)
    setErreur('')
    const { error } = await supabase
      .from('workshop_reglages')
      .update({
        modules_avant_j3: Number(form.modules_avant_j3),
        jour_deblocage: Number(form.jour_deblocage),
        bandeau_actif: form.bandeau_actif,
        bandeau_texte: form.bandeau_texte,
        bandeau_lien_texte: form.bandeau_lien_texte,
        prompt_j0: form.prompt_j0 || null,
        video_systeme_url: form.video_systeme_url?.trim() || null,
        prompts_sos: form.prompts_sos,
        updated_at: new Date().toISOString(),
      })
      .eq('id', 1)
    setBusy(false)
    if (error) return setErreur(`Enregistrement impossible : ${error.message}`)
    onChange()
  }

  return (
    <form onSubmit={enregistrer} className="card space-y-4 p-5">
      <h2 className="text-lg">Le rythme</h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="font-bold text-navy">Modules ouverts avant le déblocage</span>
          <span className="mt-0.5 block text-xs text-muted">
            Combien de modules du programme sont accessibles pendant les premiers jours.
          </span>
          <input
            type="number"
            min="0"
            className="field mt-2"
            value={form.modules_avant_j3}
            onChange={(e) => setForm({ ...form, modules_avant_j3: e.target.value })}
          />
        </label>

        <label className="block text-sm">
          <span className="font-bold text-navy">Jour qui débloque tout le reste</span>
          <span className="mt-0.5 block text-xs text-muted">
            À partir de ce jour du workshop, chacun retrouve tous les modules de sa formule.
          </span>
          <input
            type="number"
            min="1"
            max="7"
            className="field mt-2"
            value={form.jour_deblocage}
            onChange={(e) => setForm({ ...form, jour_deblocage: e.target.value })}
          />
        </label>
      </div>

      <div className="border-t border-line pt-4">
        <label className="block text-sm">
          <span className="font-bold text-navy">La vidéo obligatoire</span>
          <span className="mt-0.5 block text-xs text-muted">
            En haut du workshop, avant le jour 1 : « vidéo obligatoire à regarder pour comprendre
            le système ». Lien Loom, Vimeo, YouTube ou Google Drive. Vide, l'encadré n'apparaît pas.
          </span>
          <input
            className="field mt-2"
            value={form.video_systeme_url || ''}
            onChange={(e) => setForm({ ...form, video_systeme_url: e.target.value })}
            placeholder="https://vimeo.com/…"
          />
        </label>
      </div>

      <div className="border-t border-line pt-4">
        <label className="block text-sm">
          <span className="font-bold text-navy">Le prompt du jour 0</span>
          <span className="mt-0.5 block text-xs text-muted">
            Celui que le setter colle pendant l'appel. Il apparaît sous le formulaire
            d'invitation, avec un bouton pour le copier.
          </span>
          <textarea
            className="field mt-2 font-mono text-xs"
            rows={10}
            value={form.prompt_j0 || ''}
            onChange={(e) => setForm({ ...form, prompt_j0: e.target.value })}
            placeholder="Le prompt du jour 0, à coller dans Base44 pendant l'appel."
          />
        </label>
      </div>

      <div className="border-t border-line pt-4">
        <span className="block text-sm font-bold text-navy">Les prompts « Si ça ne marche pas »</span>
        <span className="mt-0.5 block text-xs text-muted">
          Ouverts à tous les élèves, quel que soit leur jour.
        </span>
        <div className="mt-2 space-y-2">
          {SECOURS.prompts.map((p) => (
            <details key={p.id} className="rounded-xl border border-line p-3">
              <summary className="cursor-pointer text-sm font-bold text-navy">{p.titre}</summary>
              <textarea
                className="field mt-3 font-mono text-xs"
                rows={8}
                value={form.prompts_sos?.[p.id] || ''}
                onChange={(e) =>
                  setForm({ ...form, prompts_sos: { ...form.prompts_sos, [p.id]: e.target.value } })
                }
              />
            </details>
          ))}
        </div>
      </div>

      <div className="border-t border-line pt-4">
        <label className="flex items-center gap-2.5 text-sm font-bold text-navy">
          <input
            type="checkbox"
            className="h-4 w-4 accent-accent"
            checked={form.bandeau_actif}
            onChange={(e) => setForm({ ...form, bandeau_actif: e.target.checked })}
          />
          Afficher le bandeau rouge aux anciens élèves
        </label>

        <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_200px]">
          <input
            className="field"
            value={form.bandeau_texte}
            onChange={(e) => setForm({ ...form, bandeau_texte: e.target.value })}
            placeholder="Texte du bandeau"
          />
          <input
            className="field"
            value={form.bandeau_lien_texte}
            onChange={(e) => setForm({ ...form, bandeau_lien_texte: e.target.value })}
            placeholder="Texte du bouton"
          />
        </div>
      </div>

      <button className="btn" disabled={busy}>
        {busy ? 'Enregistrement…' : 'Enregistrer'}
      </button>
      {erreur && <p className="text-sm font-semibold text-red-600">{erreur}</p>}
    </form>
  )
}

function JourAdmin({ jour: j, ouvert, onToggle, onSave }) {
  const [form, setForm] = useState(j)
  const [busy, setBusy] = useState(false)
  const [erreur, setErreur] = useState('')

  const page = JOURS.find((x) => x.jour === j.jour)
  const prompts = page.blocs.filter((b) => b.type === 'prompt')

  useEffect(() => {
    setForm(j)
  }, [j])

  async function enregistrer() {
    setBusy(true)
    setErreur('')
    const { error } = await supabase
      .from('workshop_jours')
      .update({
        video_url: form.video_url || null,
        prompt: form.prompt || null,
        prompt_2: form.prompt_2 || null,
        consignes: form.consignes?.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq('jour', j.jour)
    setBusy(false)
    if (error) return setErreur(`Enregistrement impossible : ${error.message}`)
    onSave()
  }

  const caracteres = (j.prompt?.length || 0) + (j.prompt_2?.length || 0)

  return (
    <div className="card p-4">
      <div className="flex flex-wrap items-center gap-3">
        <span
          className={`grid h-8 w-8 flex-none place-items-center rounded-full text-sm font-bold ${
            j.prompt ? 'bg-success-bg text-success' : 'bg-canvas text-muted'
          }`}
        >
          {j.prompt ? '✓' : j.jour}
        </span>
        <div className="min-w-0 flex-1">
          <b className="block font-title text-navy">
            Jour {j.jour} · {page.titre}
          </b>
          <span className="text-xs text-muted">
            {j.prompt ? `${caracteres.toLocaleString('fr-FR')} caractères de prompt` : 'Pas de prompt'}
            {j.video_url ? ' · Vidéo' : ''}
          </span>
        </div>
        <button onClick={onToggle} className="text-sm font-bold text-accent-light hover:underline">
          {ouvert ? 'Fermer' : 'Modifier'}
        </button>
      </div>

      {ouvert && (
        <div className="mt-4 space-y-5">
          {prompts.map((p, i) => {
            const colonne = i === 0 ? 'prompt' : 'prompt_2'
            return (
              <label key={p.id} className="block text-sm">
                <span className="font-bold text-navy">{p.titre}</span>
                <textarea
                  className="field mt-2 font-mono text-xs"
                  rows={10}
                  value={form[colonne] || ''}
                  onChange={(e) => setForm({ ...form, [colonne]: e.target.value })}
                  placeholder="Le prompt à coller dans Base44"
                />
              </label>
            )
          })}

          <label className="block text-sm">
            <span className="font-bold text-navy">Avant demain</span>
            <span className="mt-0.5 block text-xs text-muted">
              Facultatif. Affiché en bas de la page du jour.
            </span>
            <textarea
              className="field mt-2"
              rows={2}
              value={form.consignes || ''}
              onChange={(e) => setForm({ ...form, consignes: e.target.value })}
            />
          </label>

          <details className="rounded-xl border border-line p-3">
            <summary className="cursor-pointer text-sm font-bold text-navy">
              Facultatif : une vidéo pour ce jour
            </summary>
            <input
              className="field mt-3"
              value={form.video_url || ''}
              onChange={(e) => setForm({ ...form, video_url: e.target.value })}
              placeholder="Lien Loom, Vimeo, YouTube ou Google Drive, affiché au-dessus des étapes"
            />
          </details>

          <button onClick={enregistrer} disabled={busy} className="btn">
            {busy ? 'Enregistrement…' : 'Enregistrer ce jour'}
          </button>
          {erreur && <p className="text-sm font-semibold text-red-600">{erreur}</p>}
        </div>
      )}
    </div>
  )
}
