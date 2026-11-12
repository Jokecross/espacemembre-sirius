import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'
import Icone from './Icone.jsx'

const jour = (d) => new Date(`${d}T12:00:00`).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })

/**
 * La garantie « Premier client en 7 jours », sur l'accueil de l'élève qui a
 * signé le contrat. Pendant les 7 jours : où il en est des conditions.
 * Ensuite : « As-tu trouvé ton premier client ? », puis, s'il répond non, sa
 * demande de remboursement. C'est la base qui décide (garantie_etat).
 */
export default function CarteGarantie() {
  const [g, setG] = useState(null)
  const [erreur, setErreur] = useState('')
  const [envoi, setEnvoi] = useState(false)

  useEffect(() => {
    supabase.rpc('garantie_etat').then(({ data }) => setG(data || null))
  }, [])

  if (!g || !g.contrat_signe || g.rembourse_at) return null

  const finie = new Date() >= new Date(`${g.fin_7_jours}T00:00:00`)
  const conditions = g.version >= 2
  const ws = `${g.workshop}/7`, vids = `${g.videos_vues}/${g.videos_total}`

  async function appeler(fn, args) {
    setEnvoi(true)
    setErreur('')
    const { data, error } = await supabase.rpc(fn, args)
    setEnvoi(false)
    if (error) return setErreur(error.message)
    setG(data)
  }

  const ligne = (ok, texte) => (
    <li className="flex items-center gap-2.5 text-[14px]">
      <span className={`grid h-5 w-5 flex-none place-items-center rounded-full ${ok ? 'bg-success-bg text-success' : 'bg-white/[.06] text-muted'}`}>
        {ok ? <Icone nom="valide" taille={12} epaisseur={2.6} /> : <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      </span>
      <span className={ok ? 'text-navy' : 'text-ink'}>{texte}</span>
    </li>
  )
  const liste = conditions && (
    <ul className="mt-3 space-y-2">
      {ligne(g.workshop >= 7, `Workshop : ${ws} captures déposées`)}
      {ligne(g.videos_total > 0 && g.videos_vues >= g.videos_total, `Vidéos de ta formule regardées en entier : ${vids}`)}
    </ul>
  )

  let corps
  if (!finie) {
    corps = (
      <>
        <h2 className="text-[20px] sm:text-[22px]">Ta garantie « Premier client en 7 jours »</h2>
        <p className="mt-1.5 text-[14.5px]">
          Tes 7 jours se terminent le <b className="text-navy">{jour(g.fin_7_jours)}</b>.
          {conditions && ' Pour pouvoir être remboursé si tu n’as pas trouvé de client, remplis ces deux conditions :'}
        </p>
        {liste}
      </>
    )
  } else if (g.premier_client === null || g.premier_client === undefined) {
    corps = (
      <>
        <h2 className="text-[22px] sm:text-[26px]">As-tu trouvé ton <span className="mot-cle">premier client</span> ?</h2>
        <p className="mt-1.5 text-[14.5px]">Tes 7 jours sont terminés. Dis-le-nous, c’est ce qui déclenche ta garantie.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button className="btn" disabled={envoi} onClick={() => appeler('garantie_repondre', { p_premier_client: true })}>Oui, j’ai mon premier client</button>
          <button className="btn-ghost" disabled={envoi} onClick={() => appeler('garantie_repondre', { p_premier_client: false })}>Non, pas encore</button>
        </div>
      </>
    )
  } else if (g.premier_client) {
    corps = (
      <>
        <h2 className="text-[22px]">Bravo pour ton <span className="mot-cle">premier client</span> !</h2>
        <p className="mt-1.5 text-[14.5px]">C’est noté. Continue sur ta lancée : le prochain arrive plus vite que le premier.</p>
      </>
    )
  } else if (g.demande_at) {
    corps = (
      <>
        <h2 className="text-[22px]">Ta demande de remboursement est enregistrée</h2>
        <p className="mt-1.5 text-[14.5px]">
          Demandée le {new Date(g.demande_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}. Tes 9,99 € te sont remboursés
          par Whop sur ton moyen de paiement, dans les 14 jours.
        </p>
      </>
    )
  } else {
    corps = (
      <>
        <h2 className="text-[22px]">Ta garantie : <span className="mot-cle">9,99 € remboursés</span></h2>
        <p className="mt-1.5 text-[14.5px]">
          {g.eligible
            ? 'Tu remplis les conditions. Tu peux demander ton remboursement.'
            : `Tu ne peux pas encore la demander : ${g.raison.charAt(0).toLowerCase()}${g.raison.slice(1)}.`}
          {' '}Tu as jusqu’au {jour(g.date_limite)}.
        </p>
        {liste}
        <button className="btn mt-4" disabled={envoi || !g.eligible} onClick={() => appeler('garantie_demander')}>
          Demander mon remboursement
        </button>
      </>
    )
  }

  return (
    <section className="carte-phare mt-6">
      {corps}
      {erreur && <p className="mt-3 text-sm font-semibold text-red-700">{erreur}</p>}
    </section>
  )
}
