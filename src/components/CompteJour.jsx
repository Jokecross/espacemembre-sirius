import { useEffect, useState } from 'react'

/** Le temps qu'il reste avant minuit, mis à jour chaque minute. */
export default function Compte({ ouvreLe }) {
  const [reste, setReste] = useState(() => calcul(ouvreLe))

  useEffect(() => {
    const t = setInterval(() => setReste(calcul(ouvreLe)), 30000)
    return () => clearInterval(t)
  }, [ouvreLe])

  if (!reste) return <span className="flex-none text-[11px] font-bold text-muted">Bientôt</span>
  return (
    <span className="flex-none text-right text-[11px] font-bold text-muted">
      s’ouvre dans
      <b className="block font-title text-[13.5px] text-navy">{reste}</b>
    </span>
  )
}

function calcul(iso) {
  if (!iso) return null
  const ms = new Date(iso) - new Date()
  if (ms <= 0) return null
  const h = Math.floor(ms / 3600000)
  const m = Math.floor((ms % 3600000) / 60000)
  return h >= 24 ? `${Math.floor(h / 24)} j ${h % 24} h` : h >= 1 ? `${h} h ${m} min` : `${m} min`
}
