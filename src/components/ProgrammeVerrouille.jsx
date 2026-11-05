import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Icone from './Icone.jsx'
import { supabase } from '../lib/supabase.js'

/**
 * Le bandeau qui annonce l'ouverture du reste du programme.
 *
 * Les premiers modules sont ouverts dès l'inscription — le jour 0 a été
 * fait avec le setter. Tous les autres de sa formule arrivent au jour 3
 * du workshop. Plutôt que
 * de laisser l'élève buter sur des cadenas sans explication, on lui dit
 * quand et pourquoi, et on l'envoie construire son outil en attendant.
 */
/** Le nombre vient du réglage du back-office : aucun texte ne l'écrit en dur. */
export function videosOuvertes(n) {
  if (n === 1) return 'ton premier module'
  return n > 1 ? `tes ${n} premiers modules` : 'tes premiers modules'
}

export default function ProgrammeVerrouille({ etat }) {
  if (!etat || etat.dispense || etat.equipe) return null
  if (etat.jour >= etat.jour_deblocage) return null

  const restants = etat.jour_deblocage - etat.jour
  const ouverts = videosOuvertes(etat.modules_avant ?? 1)

  return (
    <section className="card flex flex-wrap items-center gap-4 border-accent/25 bg-gradient-to-r from-accent-pastel to-surface p-5">
      <span className="grid h-12 w-12 flex-none place-items-center rounded-2xl border border-accent/50 bg-accent/[.16] text-navy">
        <Icone nom="cadenas" taille={20} />
      </span>

      {/* Largeur minimale : sous ce seuil, le bouton passe à la ligne au lieu
          d'écraser le texte en un mot par ligne. */}
      <div className="min-w-[200px] flex-1">
        <b className="block font-title font-extrabold text-navy">
          Tout ton programme s'ouvre au jour {etat.jour_deblocage} de ton workshop
        </b>
        <span className="text-sm">
          {restants === 1
            ? 'Demain, tous tes modules seront accessibles. En attendant, avance sur ton workshop.'
            : `Encore ${restants} jours. En attendant, tu as ${ouverts} et ton workshop.`}
        </span>
      </div>

      <Link to="/workshop" className="btn w-full whitespace-nowrap px-5 py-2.5 text-[13px] sm:w-auto">
        {etat.jour === 0 ? 'Voir le workshop' : `Faire le jour ${etat.jour}`}
      </Link>
    </section>
  )
}

/** L'état du workshop, partagé par la page d'accueil. */
export function useEtatWorkshop(actif = true) {
  const [etat, setEtat] = useState(null)
  useEffect(() => {
    if (!actif) return
    supabase.rpc('mon_etat_workshop').then(({ data }) => setEtat(data || null))
  }, [actif])
  return etat
}
