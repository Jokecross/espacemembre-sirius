import { useRef, useState } from 'react'
import { supabase } from '../lib/supabase.js'
import Icone from './Icone.jsx'
import { APP } from '../lib/marque'

/* ---------- La capture du jour ----------
   Le compteur de jours n'est qu'un calendrier : il avance tout seul. La
   capture est la seule chose qui dise ce que l'élève a réellement
   construit.

   Elle n'ouvre ni ne ferme rien. Un élève coincé un soir ne doit pas
   perdre son lendemain. */
export default function Capture({ jour, deja, onDepose }) {
  const champ = useRef(null)
  const [faite, setFaite] = useState(!!deja)
  const [envoi, setEnvoi] = useState(false)
  const [erreur, setErreur] = useState('')

  async function deposer(fichier) {
    if (!fichier) return
    setErreur('')
    if (!fichier.type.startsWith('image/')) {
      return setErreur("Dépose une image : une capture d'écran ou une photo.")
    }
    if (fichier.size > 10 * 1024 * 1024) {
      return setErreur('Image trop lourde : 10 Mo maximum.')
    }

    setEnvoi(true)
    const { data: s } = await supabase.auth.getSession()
    const membre = s.session.user.id
    const ext = (fichier.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '')
    const chemin = `${membre}/workshop-jour-${jour}-${Date.now()}.${ext}`

    const { error: envoiErreur } = await supabase.storage
      .from('preuves')
      .upload(chemin, fichier, { contentType: fichier.type })
    if (envoiErreur) {
      setEnvoi(false)
      return setErreur(`L'envoi a échoué : ${envoiErreur.message}`)
    }

    const { error: dbErreur } = await supabase.from('workshop_captures').upsert(
      {
        member_id: membre,
        jour,
        file_path: chemin,
        file_name: fichier.name,
        taille: fichier.size,
      },
      { onConflict: 'member_id,jour' },
    )
    setEnvoi(false)
    if (dbErreur) return setErreur(`Enregistrement impossible : ${dbErreur.message}`)
    setFaite(true)
    // Le jour suivant s'ouvre avec cette capture : on rafraîchit la liste.
    onDepose?.()
  }

  return (
    <div
      className={`mt-5 rounded-xl border p-4 ${
        faite ? 'border-success/30 bg-success-bg' : 'border-[1.5px] border-accent/60 bg-canvas'
      }`}
    >
      <div className="flex items-start gap-3">
        <Icone
          nom={faite ? 'valide' : 'document'}
          taille={18}
          className={`mt-0.5 ${faite ? 'text-success' : 'text-navy'}`}
        />
        <div className="min-w-0 flex-1">
          {faite ? (
            <>
              <b className="block font-title text-[14.5px] font-extrabold text-success">
                Capture du jour {jour} reçue
              </b>
              <span className="block text-[13px] text-success">
                Tu peux la remplacer si tu as avancé depuis.
              </span>
            </>
          ) : (
            <>
              <b className="block font-title text-[14.5px] font-extrabold text-navy">
                Montre-nous ton résultat
              </b>
              <span className="block text-[13px]">
                Une capture d'écran de ton {APP} une fois le prompt passé. C'est ce
                qui nous permet de voir où tu en es et de t'aider si tu bloques.
              </span>
            </>
          )}

          <input
            ref={champ}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => deposer(e.target.files?.[0])}
          />
          <button
            onClick={() => champ.current?.click()}
            disabled={envoi}
            className="btn-ghost mt-3 text-[13.5px]"
          >
            {envoi ? 'Envoi…' : faite ? 'Remplacer ma capture' : 'Déposer ma capture'}
          </button>

          {erreur && <p className="mt-2 text-sm font-semibold text-red-600">{erreur}</p>}
        </div>
      </div>
    </div>
  )
}
