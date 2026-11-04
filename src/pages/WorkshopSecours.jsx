import { Link } from 'react-router-dom'
import PromptKairo from '../components/PromptKairo.jsx'
import { textePrompt, useWorkshop } from '../lib/useWorkshop.js'
import { SECOURS } from '../lib/kairo.js'

/** Les six prompts de secours, ouverts à tous quel que soit le jour. */
export default function WorkshopSecours() {
  const { jours, reglages } = useWorkshop()

  return (
    <>
      <Link
        to="/workshop"
        className="inline-flex min-h-[44px] items-center text-sm font-bold text-muted hover:text-navy"
      >
        ← Tous les jours
      </Link>
      <h1 className="mt-1 text-[25px] sm:text-[31px]">Si ça ne marche pas</h1>
      <p className="mt-2.5 max-w-[62ch] text-[15px] leading-relaxed">{SECOURS.intro}</p>

      {!reglages ? (
        <p className="mt-6 text-muted">Chargement…</p>
      ) : (
        SECOURS.prompts.map((p) => (
          <PromptKairo
            key={p.id}
            id={p.id}
            titre={p.titre}
            avant={p.avant}
            texte={textePrompt(p.id, jours, reglages)}
          />
        ))
      )}
    </>
  )
}
