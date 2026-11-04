import { useState } from 'react'
import { Link } from 'react-router-dom'
import Icone from './Icone.jsx'
import { copierTexte } from '../lib/copier.js'

/**
 * Ce qui accompagne une vidéo : un bouton, un lien de ressources, des blocs
 * à copier. Le contenu vit sur la leçon : une vidéo fermée ne le renvoie pas.
 */
export default function SousVideo({ blocs }) {
  // Un lien pas encore fourni ne s'affiche pas : il attend dans le back-office.
  const visibles = (blocs || []).filter((b) => b.type !== 'lien' || b.url)
  if (!visibles.length) return null

  return (
    <div className="mt-8 space-y-5">
      {visibles.map((b, i) => {
        if (b.type === 'bouton') {
          return (
            <Link key={i} to={b.to} className="btn w-full sm:w-auto">
              {b.texte}
              <Icone nom="fleche" taille={17} />
            </Link>
          )
        }
        if (b.type === 'lien') {
          return (
            <div key={i}>
              <a href={b.url} target="_blank" rel="noopener" className="btn w-full whitespace-normal text-center">
                {b.texte}
              </a>
              {b.note && <p className="mt-2.5 text-[13px] leading-relaxed text-muted">{b.note}</p>}
            </div>
          )
        }
        if (b.type === 'copie') return <Bloc key={i} titre={b.titre} texte={b.texte} />
        if (b.type === 'groupe') {
          return (
            <section key={i}>
              <h3 className="font-title text-[15.5px] font-extrabold text-navy">{b.titre}</h3>
              <div className="mt-2.5 space-y-3">
                {b.items.map((it, k) => (
                  <Bloc key={k} sousTitre={it.titre} texte={it.texte} />
                ))}
              </div>
            </section>
          )
        }
        if (b.type === 'note') {
          return (
            <p key={i} className="border-l-2 border-accent/60 pl-3.5 text-[14px] leading-relaxed text-navy">
              {b.texte}
            </p>
          )
        }
        return null
      })}
    </div>
  )
}

function Bloc({ titre, sousTitre, texte }) {
  const [copie, setCopie] = useState(false)

  async function copier() {
    if (!(await copierTexte(texte))) return
    setCopie(true)
    setTimeout(() => setCopie(false), 2000)
  }

  return (
    <section data-bloc>
      {titre && <h3 className="mb-2.5 font-title text-[15.5px] font-extrabold text-navy">{titre}</h3>}
      <div className="rounded-xl border border-line bg-surface p-4 sm:p-5">
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            {sousTitre && <p className="mb-2 text-[13px] font-semibold text-muted">{sousTitre}</p>}
            <p className="whitespace-pre-wrap text-[14.5px] leading-relaxed text-navy [overflow-wrap:anywhere]">
              {texte}
            </p>
          </div>
          <button onClick={copier} className="btn-ghost w-full flex-none px-3.5 py-2.5 text-[13px] sm:w-auto sm:py-2">
            <Icone nom={copie ? 'valide' : 'copier'} taille={15} />
            {copie ? 'Copié !' : 'Copier'}
          </button>
        </div>
      </div>
    </section>
  )
}
