/* Généré par scripts/kairo-generer.py depuis le brief : ne pas modifier à la main.

   Les textes du parcours « Construis ton outil Kairo ». Les prompts n'y sont pas :
   ils vivent dans la base, pour qu'un jour à venir ne parte pas dans le navigateur
   et qu'on puisse les corriger depuis le back-office. Un bloc « prompt » ne porte
   que l'identifiant, relié à sa colonne par `lib/useWorkshop.js`. */

export const COMMENT_CA_MARCHE = [
  "Un prompt par jour, dans l'ordre, sans en sauter.",
  "Le jour 0 crée ton app Kairo. Tous les prompts suivants se collent dans le chat de CETTE app, jamais dans une nouvelle. Seule exception : au jour 3, la démo du site d'un commerce se crée dans une nouvelle app. On te l'explique ce jour-là.",
  "Attends que Base44 ait fini avant d'envoyer autre chose.",
  "Après chaque prompt, sers-toi tout de suite de ta nouvelle page avec un vrai commerce de ta ville : c'est ce qui valide ta mission du jour.",
  "Partout dans ton outil, les boutons « Analyser » te donnent l'avis d'un expert IA sur ce que tu viens de faire. Sers-t'en.",
  "Une seule correction par message.",
  "Ça coince ? Va dans « Si ça ne marche pas », ou demande à ton coach.",
  "Plan Builder : choisis le modèle Opus 5. Plan Starter : laisse le mode automatique."
]

export const JOURS = [
  {
    "jour": 0,
    "titre": "La base de ton app",
    "construit": "L'interface de ton outil Kairo : le menu, l'accueil et les pages, encore vides. Si tu l'as déjà fait en appel avec ton conseiller, passe directement au jour 1.",
    "blocs": [
      {
        "type": "etapes",
        "debut": 1,
        "items": [
          "Ouvre Base44 et connecte-toi à ton compte.",
          "Choisis ton modèle d'IA. Plan Builder : sélectionne Opus 5. Plan Starter : laisse le mode automatique.",
          "Clique sur le gros bouton ci-dessous pour copier le prompt du jour 0.",
          "Dans Base44, colle-le dans l'encadré « Décrivez l'application que vous souhaitez créer », puis envoie.",
          "Attends que Base44 ait fini : ça prend quelques minutes.",
          "Si Base44 te dit qu'il n'a pas pu régler l'accès lui-même : ouvre les paramètres de ton app, puis App Visibility, et choisis « Espace de travail »."
        ]
      },
      {
        "type": "savoir",
        "items": [
          "Ton app s'appelle Kairo. Au jour 1, tu lui donnes le nom de ton agence.",
          "Garde bien cette app : c'est dans son chat que tu colleras tous les prompts suivants."
        ]
      },
      {
        "type": "prompt",
        "id": "PROMPT_J0",
        "titre": "Le prompt du jour 0"
      },
      {
        "type": "reussite",
        "items": [
          "Sans connexion, ton app affiche une page de connexion en français.",
          "Les six pages s'ouvrent depuis le menu : Accueil, Coach, Mon agence, Commerces, Suivi et Argent.",
          "En bas du menu, tu vois « WORKSHOP · JOUR 0 / 7 »."
        ]
      }
    ]
  },
  {
    "jour": 1,
    "titre": "Ton agence et ton coach IA",
    "construit": "Ta page Mon agence, avec ta ville, tes métiers cibles, tes services et tes prix. Puis ton coach IA, que tu retrouves dans ton app et sur WhatsApp. Aujourd'hui, il y a 2 prompts.",
    "blocs": [
      {
        "type": "partie",
        "titre": "Partie 1 · Mon agence"
      },
      {
        "type": "etapes",
        "debut": 1,
        "items": [
          "Ouvre ton app Kairo dans Base44, celle que tu as créée au jour 0.",
          "Copie le prompt « Jour 1 · Mon agence », colle-le dans le chat de ton app et envoie. Attends que Base44 ait fini.",
          "Ouvre Mon agence. Remplis le nom de ton agence, ton prénom et ta ville, coche 1 ou 2 métiers cibles, puis clique sur « ENREGISTRER ».",
          "Clique sur « UTILISER LES SERVICES DE DÉPART », puis mets tes propres prix avec le crayon.",
          "Clique sur « ÉCRIRE MA PRÉSENTATION », puis sur « ANALYSER MON AGENCE » : l'IA te dit si ta cible et tes prix tiennent la route."
        ]
      },
      {
        "type": "savoir",
        "items": [
          "Les textes grisés dans les champs sont des exemples : ils ne sont pas remplis. Tape tes vraies infos.",
          "Les prix de départ sont des exemples. Mets les tiens : ils serviront partout, dans tes audits, tes devis et tes factures.",
          "Pas encore d'entreprise ? Choisis « Pas encore créé ». Tu en auras besoin pour facturer au jour 7, et ton coach peut t'expliquer."
        ]
      },
      {
        "type": "prompt",
        "id": "PROMPT_J1_AGENCE",
        "titre": "Jour 1 · Mon agence"
      },
      {
        "type": "partie",
        "titre": "Partie 2 · Ton coach IA"
      },
      {
        "type": "etapes",
        "debut": 6,
        "items": [
          "Copie le prompt « Jour 1 · Mon coach », colle-le dans le chat de la même app et envoie. Attends que Base44 ait fini.",
          "Ouvre la page Coach et écris-lui : « Je fais quoi ? ». Il lit tes données et te répond.",
          "Pour l'avoir aussi sur WhatsApp : clique sur « CONNECTER MON WHATSAPP », puis écris-lui le premier message. C'est toujours toi qui écris en premier."
        ]
      },
      {
        "type": "aide",
        "titre": "Si le bouton WhatsApp ne marche pas",
        "debut": 1,
        "items": [
          "Dans Base44, ouvre Agents, puis le Coach, puis Modifier.",
          "Va dans WhatsApp, clique sur Send to Chat, puis sur Enregistrer.",
          "Sur ton téléphone, écris le premier message à ton coach."
        ]
      },
      {
        "type": "savoir",
        "items": [
          "En bas du menu, « WORKSHOP · JOUR 1 / 7 » veut dire que tu as collé les prompts du jour 1. Sur ton accueil, la ligne « Jour 1 » passe à « Fait » quand ta mission est remplie : ton agence a un nom, tu as au moins un service, et tu as écrit à ton coach.",
          "Ton coach connaît le métier : demande-lui de jouer un commerçant méfiant pour t'entraîner, de relire tes messages, ou de t'expliquer un mot que tu ne connais pas."
        ]
      },
      {
        "type": "prompt",
        "id": "PROMPT_J1_COACH",
        "titre": "Jour 1 · Mon coach"
      },
      {
        "type": "reussite",
        "items": [
          "Le nom de ton agence s'affiche en haut du menu.",
          "Ton coach te répond et cite tes services.",
          "Quand tu quittes la page Coach puis que tu reviens, ta conversation est toujours là.",
          "Sur ton accueil, la ligne Jour 1 est passée à « Fait »."
        ]
      }
    ]
  },
  {
    "jour": 2,
    "titre": "L'audit d'un commerce",
    "construit": "Ta page Commerces. Tu ajoutes un commerce de ta ville, l'outil lui donne une note sur 100 et ses 3 manques, et l'IA te dit quoi lui vendre, avec tes prix.",
    "blocs": [
      {
        "type": "etapes",
        "debut": 1,
        "items": [
          "Copie le prompt du jour 2, colle-le dans le chat de ton app et envoie. Attends que Base44 ait fini.",
          "Choisis un vrai commerce de ta ville, dans un de tes métiers cibles. Regarde sa fiche Google, son site s'il en a un, et son Instagram.",
          "Dans Commerces, clique sur « AJOUTER UN COMMERCE » et remplis ce que tu as vu.",
          "Ouvre sa fiche et clique sur « LANCER L'AUDIT IA ».",
          "Ajoute 2 ou 3 autres commerces, puis clique sur « ANALYSER MES COMMERCES » : l'IA te dit par lequel commencer."
        ]
      },
      {
        "type": "savoir",
        "items": [
          "Pour trouver ses infos, tape le nom du commerce dans Google Maps : tu y vois sa note, son nombre d'avis, ses horaires et ses photos.",
          "Une fiche Google « incomplète », c'est une fiche où il manque des photos, les horaires ou la description.",
          "Des réseaux « abandonnés », c'est aucun post depuis plus d'un mois.",
          "Une note basse, c'est une bonne nouvelle : c'est un commerce que tu peux aider."
        ]
      },
      {
        "type": "prompt",
        "id": "PROMPT_J2",
        "titre": "Le prompt du jour 2"
      },
      {
        "type": "reussite",
        "items": [
          "Ton commerce a sa note sur 100, ses 3 manques et son audit IA.",
          "L'audit ne propose que tes services, avec tes prix.",
          "Sur ton accueil, COMMERCES AUDITÉS affiche au moins 1, et la ligne Jour 2 est passée à « Fait »."
        ]
      }
    ]
  },
  {
    "jour": 3,
    "titre": "La démo du site",
    "construit": "L'outil écrit le prompt parfait pour le site de ton commerce. Tu le colles dans une nouvelle app Base44, et tu obtiens une démo à montrer au gérant sur ton téléphone.",
    "blocs": [
      {
        "type": "etapes",
        "debut": 1,
        "items": [
          "Copie le prompt du jour 3, colle-le dans le chat de ton app Kairo (pas dans une nouvelle app) et envoie. Attends que Base44 ait fini.",
          "Ouvre la fiche de ton commerce. Dans « Démo du site », remplis ses horaires, ses spécialités et ce qui le rend unique, puis clique sur « ENREGISTRER LES INFOS ».",
          "Clique sur « ANALYSER MES INFOS » : l'IA te dit ce qui manque pour une démo qui donne envie.",
          "Clique sur « ÉCRIRE LE PROMPT DU SITE », puis sur « COPIER LE PROMPT ».",
          "Dans Base44, crée une NOUVELLE app et colle ce prompt. Attends la fin.",
          "Dans les paramètres de cette nouvelle app, règle l'accès sur Public, puis publie-la.",
          "Copie le lien de la démo, reviens dans Kairo, colle-le à l'étape 4 et clique sur « ENREGISTRER LE LIEN »."
        ]
      },
      {
        "type": "savoir",
        "items": [
          "C'est le seul jour où tu crées une autre app : la démo appartient au commerce, pas à ton outil.",
          "Ouvre la démo dans une fenêtre de navigation privée : si elle s'ouvre sans te demander de compte, le gérant pourra la voir.",
          "Les photos de la démo sont des illustrations. Tu mettras les vraies photos du commerce quand il sera client.",
          "Ce qui est entre crochets dans la démo, c'est une info à compléter avec le commerçant."
        ]
      },
      {
        "type": "prompt",
        "id": "PROMPT_J3",
        "titre": "Le prompt du jour 3"
      },
      {
        "type": "reussite",
        "items": [
          "Ta démo s'ouvre sur ton téléphone, sans compte.",
          "La carte de ton commerce affiche « Démo prête ».",
          "Sur ton accueil, DÉMOS PRÊTES affiche au moins 1, et la ligne Jour 3 est passée à « Fait »."
        ]
      }
    ]
  },
  {
    "jour": 4,
    "titre": "Le kit Google et contenu",
    "construit": "Pour un commerce : la description de sa fiche Google, 10 posts avec leurs légendes, et 5 réponses types à ses avis. De quoi lui montrer ce que tu feras pour lui chaque mois.",
    "blocs": [
      {
        "type": "etapes",
        "debut": 1,
        "items": [
          "Copie le prompt du jour 4, colle-le dans le chat de ton app et envoie. Attends que Base44 ait fini.",
          "Ouvre la fiche de ton commerce et clique sur « PRÉPARER LE KIT ».",
          "Clique sur « ANALYSER SA FICHE » : l'IA te dit quoi faire en premier sur sa fiche Google.",
          "Un post ne te plaît pas ? Clique sur « Refaire » sur ce post.",
          "Clique sur « COPIER TOUT LE KIT » pour le garder ou l'envoyer au commerçant."
        ]
      },
      {
        "type": "savoir",
        "items": [
          "La description d'une fiche Google fait 750 caractères au maximum : le compteur te le dit.",
          "Ce qui est entre crochets, c'est une info que l'IA n'a pas. Complète-la avec le commerçant.",
          "Un avis Google se demande à tous les clients, sans rien offrir en échange : c'est la règle de Google."
        ]
      },
      {
        "type": "prompt",
        "id": "PROMPT_J4",
        "titre": "Le prompt du jour 4"
      },
      {
        "type": "reussite",
        "items": [
          "Ton commerce a son kit : une description, 10 posts et 5 réponses aux avis.",
          "Sa carte affiche « Kit prêt ».",
          "Sur ton accueil, la ligne Jour 4 est passée à « Fait »."
        ]
      }
    ]
  },
  {
    "jour": 5,
    "titre": "Le message d'approche",
    "construit": "L'outil écrit tes messages pour contacter ce commerce : un message Instagram, un script d'appel, un pitch en boutique et deux relances. Puis tu le contactes pour de vrai.",
    "blocs": [
      {
        "type": "etapes",
        "debut": 1,
        "items": [
          "Copie le prompt du jour 5, colle-le dans le chat de ton app et envoie. Attends que Base44 ait fini.",
          "Ouvre la fiche d'un commerce audité, si possible avec sa démo, et clique sur « ÉCRIRE MES MESSAGES ».",
          "Adapte-les à ta façon de parler avec « Modifier », puis clique sur « Analyser » sur ton message Instagram.",
          "Clique sur « M'ENTRAÎNER AVEC LE COACH » et fais un appel d'essai.",
          "Contacte le commerce pour de vrai, par le canal de ton choix, puis clique sur « J'AI CONTACTÉ CE COMMERCE »."
        ]
      },
      {
        "type": "savoir",
        "items": [
          "Le bon moment pour contacter : un restaurant entre 15 h et 17 h, un artisan tôt le matin ou en fin de journée, une boutique en semaine aux heures creuses.",
          "Le but du premier contact, c'est un rendez-vous de 15 minutes pour montrer la démo. Pas de prix à ce stade.",
          "Un message à la fois, personnalisé. Jamais d'envoi en masse.",
          "Un non, c'est normal. Passe au suivant : ton rythme, c'est 5 nouveaux commerces par jour."
        ]
      },
      {
        "type": "prompt",
        "id": "PROMPT_J5",
        "titre": "Le prompt du jour 5"
      },
      {
        "type": "reussite",
        "items": [
          "Tes cinq messages sont écrits et restent après un rechargement.",
          "Ton commerce est passé au statut « Contacté ».",
          "Sur ton accueil, la ligne Jour 5 est passée à « Fait »."
        ]
      }
    ]
  },
  {
    "jour": 6,
    "titre": "Le suivi",
    "construit": "Ton tableau de suivi. Chaque commerce avance d'une colonne à l'autre, et ton accueil te dit qui relancer aujourd'hui.",
    "blocs": [
      {
        "type": "etapes",
        "debut": 1,
        "items": [
          "Copie le prompt du jour 6, colle-le dans le chat de ton app et envoie. Attends que Base44 ait fini.",
          "Ouvre Suivi et ajoute des commerces jusqu'à en avoir 10.",
          "Change le statut d'un commerce dès qu'il avance : contacté, rendez-vous, devis envoyé, client.",
          "Clique sur « ANALYSER MON SUIVI » : l'IA te dit qui relancer en premier.",
          "Chaque matin, regarde « Tes relances du jour » sur ton accueil."
        ]
      },
      {
        "type": "savoir",
        "items": [
          "Les relances se calculent toutes seules : 3 jours après le contact, puis 7 jours après. Après 2 relances sans réponse, passe au suivant.",
          "Un rendez-vous calé ? Passe le commerce en « Rendez-vous » et note la date et l'heure.",
          "Ton suivi, c'est ta routine : 10 minutes chaque matin suffisent."
        ]
      },
      {
        "type": "prompt",
        "id": "PROMPT_J6",
        "titre": "Le prompt du jour 6"
      },
      {
        "type": "reussite",
        "items": [
          "Tu as 10 commerces dans ton suivi.",
          "Passer un commerce en « Rendez-vous » te demande la date et l'heure.",
          "Sur ton accueil, la ligne Jour 6 est passée à « Fait »."
        ]
      }
    ]
  },
  {
    "jour": 7,
    "titre": "Le devis et l'argent",
    "construit": "Tes devis en PDF à partir de tes services, puis tes factures et ce que tu as encaissé. Aujourd'hui, il y a 2 prompts.",
    "blocs": [
      {
        "type": "partie",
        "titre": "Partie 1 · Le devis"
      },
      {
        "type": "etapes",
        "debut": 1,
        "items": [
          "Copie le prompt « Jour 7 · Le devis », colle-le dans le chat de ton app et envoie. Attends que Base44 ait fini.",
          "Ouvre Argent et clique sur « NOUVEAU DEVIS ». Choisis un commerce : les services proposés par son audit sont déjà cochés.",
          "Vérifie le récapitulatif, puis clique sur « ENREGISTRER LE DEVIS ».",
          "Clique sur « ANALYSER CE DEVIS », puis sur « ÉCRIRE LE MESSAGE D'ENVOI ».",
          "Clique sur « TÉLÉCHARGER LE PDF » et choisis « Enregistrer en PDF »."
        ]
      },
      {
        "type": "prompt",
        "id": "PROMPT_J7_DEVIS",
        "titre": "Jour 7 · Le devis"
      },
      {
        "type": "partie",
        "titre": "Partie 2 · Les factures et l'argent"
      },
      {
        "type": "etapes",
        "debut": 6,
        "items": [
          "Copie le prompt « Jour 7 · Les factures et l'argent », colle-le dans le chat de la même app et envoie. Attends que Base44 ait fini.",
          "Quand un client accepte un devis, crée sa facture d'acompte. Quand il paie, clique sur « MARQUER COMME ENCAISSÉE ».",
          "Clique sur « ANALYSER MON ARGENT » : l'IA te dit quoi relancer pour encaisser."
        ]
      },
      {
        "type": "prompt",
        "id": "PROMPT_J7_FACTURES",
        "titre": "Jour 7 · Les factures et l'argent"
      },
      {
        "type": "savoir",
        "items": [
          "Pour facturer, il te faut un statut et un SIRET, à remplir dans Mon agence. Pas encore d'entreprise ? Tu peux déjà faire tes devis, et demander à ton coach comment créer ta micro-entreprise.",
          "Le PDF s'ouvre mieux depuis ton app publiée, dans un nouvel onglet.",
          "Ne commence jamais le travail avant d'avoir reçu l'acompte.",
          "Une facture ne se supprime pas. En cas d'erreur, demande à ton coach comment faire un avoir."
        ]
      },
      {
        "type": "reussite",
        "items": [
          "Ton devis a un numéro (D-2026-001), et son PDF s'ouvre en A4.",
          "Sur ton accueil, la ligne Jour 7 est passée à « Fait », et ta carte affiche « Ton agence est prête »."
        ]
      },
      {
        "type": "fin",
        "texte": "Ton outil est complet ! Chaque matin, ouvre ton accueil : tes relances du jour, tes rendez-vous et ton coach sont là. Ton objectif maintenant : 5 commerces contactés par jour. Et si quelque chose a bougé dans ton app, va dans « Si ça ne marche pas »."
      }
    ]
  }
]

export const SECOURS = {
  "intro": "Un souci dans ton app ? Choisis le prompt qui correspond à ton problème, colle-le dans le chat de ton app Kairo et envoie. Un seul à la fois. Tu peux aussi demander à ton coach : il t'aide à décrire le problème.",
  "prompts": [
    {
      "id": "SOS_BUG",
      "titre": "Un bug sur une page",
      "avant": "Remplace ce qui est entre crochets par ta situation avant d'envoyer."
    },
    {
      "id": "SOS_DESIGN",
      "titre": "Le design a changé",
      "avant": null
    },
    {
      "id": "SOS_MENU",
      "titre": "Le menu a changé",
      "avant": null
    },
    {
      "id": "SOS_ACCUEIL",
      "titre": "Une ligne de « Ton agence en 7 jours » reste « À faire »",
      "avant": "À coller si tu as fait ta mission et que la ligne du jour ne passe pas à « Fait ». Vérifie d'abord que tu as bien fait la mission."
    },
    {
      "id": "SOS_COACH",
      "titre": "Le coach perd la conversation ou ne répond pas",
      "avant": null
    },
    {
      "id": "SOS_EXPERT",
      "titre": "Le coach répond à côté",
      "avant": "Remets ton coach et l'IA de ton outil à leur dernière version."
    }
  ]
}
