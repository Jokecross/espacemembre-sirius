import { useEffect, useRef, useState } from 'react'
import Icone from './Icone.jsx'

/** Copie par l'ancienne méthode, quand le navigateur refuse l'API moderne. */
function copieDeSecours(texte) {
  const zone = document.createElement('textarea')
  zone.value = texte
  zone.readOnly = true
  zone.style.position = 'fixed'
  zone.style.left = '-9999px'
  zone.style.fontSize = '16px'
  document.body.appendChild(zone)
  zone.select()
  zone.setSelectionRange(0, texte.length)
  let ok = false
  try {
    ok = document.execCommand('copy')
  } catch {
    ok = false
  }
  document.body.removeChild(zone)
  return ok
}

/**
 * Un prompt à copier. Le texte n'est jamais retouché : ce qui est dans la base
 * est ce qui s'affiche et ce qui part dans le presse-papier.
 */
export default function PromptKairo({ id, titre, avant, texte }) {
  const [copie, setCopie] = useState(false)
  const [echec, setEchec] = useState(false)
  const [entier, setEntier] = useState(false)
  const minuteur = useRef(null)

  useEffect(() => () => clearTimeout(minuteur.current), [])

  async function copier() {
    let ok = false
    try {
      await navigator.clipboard.writeText(texte)
      ok = true
    } catch {
      ok = copieDeSecours(texte)
    }
    setEchec(!ok)
    if (!ok) return
    setCopie(true)
    clearTimeout(minuteur.current)
    minuteur.current = setTimeout(() => setCopie(false), 2000)
  }

  return (
    <section data-prompt-id={id} className="mt-6 rounded-2xl border-[1.5px] border-accent/45 bg-surface p-4 sm:p-5">
      <h3 className="text-[16px] font-bold">{titre}</h3>
      {avant && <p className="mt-1.5 text-sm">{avant}</p>}

      {!texte ? (
        <p className="mt-2 text-sm text-muted">Ce prompt arrive très vite.</p>
      ) : (
        <>
          <button
            type="button"
            onClick={copier}
            aria-live="polite"
            className="btn mt-3 min-h-[56px] w-full text-[15px]"
          >
            <Icone nom={copie ? 'valide' : 'copier'} taille={19} epaisseur={copie ? 2.2 : 1.6} />
            {copie ? 'Copié !' : 'COPIER LE PROMPT'}
          </button>
          {echec && (
            <p className="mt-2 text-sm font-semibold text-red-600">
              Ton navigateur a bloqué la copie. Ouvre tout le prompt, sélectionne le texte et copie-le à la main.
            </p>
          )}

          <pre
            tabIndex={0}
            className={`mt-3 whitespace-pre-wrap break-words rounded-xl border border-line bg-canvas p-4 font-mono text-xs leading-relaxed text-navy ${
              entier ? '' : 'max-h-56 overflow-y-auto overscroll-contain'
            }`}
          >
            {texte}
          </pre>
          <button
            type="button"
            onClick={() => setEntier(!entier)}
            className="mt-2 min-h-[44px] text-sm font-bold text-navy underline underline-offset-2"
          >
            {entier ? 'Réduire le prompt' : 'Voir tout le prompt'}
          </button>
        </>
      )}
    </section>
  )
}
