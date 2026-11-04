import { useEffect } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import Icone from '../components/Icone.jsx'
import Capture from '../components/CaptureJour.jsx'
import Compte from '../components/CompteJour.jsx'
import PromptKairo from '../components/PromptKairo.jsx'
import { textePrompt, useWorkshop } from '../lib/useWorkshop.js'
import { lecteur } from '../lib/lecteur.js'
import { JOURS } from '../lib/kairo.js'

/**
 * Une page par jour, toujours dans le même ordre : le titre, ce qu'on construit,
 * puis les blocs tels qu'ils sont rangés dans le brief. Les jours 1 et 7 ont deux
 * parties, avec un prompt chacune.
 */
export default function WorkshopJour() {
  const { n } = useParams()
  const num = Number(n)
  const page = JOURS.find((j) => j.jour === num)
  const { jours, reglages, recharger } = useWorkshop()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [num])

  if (!page) return <Navigate to="/workshop" replace />
  if (!jours) return <p className="text-muted">Chargement…</p>

  const j = jours.find((x) => x.jour === num)
  const ouvert = num === 0 || !!j?.ouvert
  const suivant = jours.find((x) => x.jour === num + 1)

  return (
    <>
      <Link
        to="/workshop"
        className="inline-flex min-h-[44px] items-center text-sm font-bold text-muted hover:text-navy"
      >
        ← Tous les jours
      </Link>
      <h1 className="mt-1 text-[25px] sm:text-[31px]">
        Jour {page.jour} · {page.titre}
      </h1>

      {!ouvert ? (
        <div className="card mt-6 flex items-center gap-3.5 p-5">
          <Icone nom="cadenas" taille={18} className="flex-none text-muted" />
          <p className="min-w-0 flex-1 text-sm">Ce jour n'est pas encore ouvert.</p>
          <Compte ouvreLe={j?.ouvre_le} />
        </div>
      ) : (
        <>
          <div className="mt-4">
            <p className="eyebrow text-accent-light">Ce que tu construis aujourd'hui</p>
            <p className="mt-1.5 max-w-[68ch] text-[15px] leading-relaxed text-navy">{page.construit}</p>
          </div>

          {j?.video_url && (
            <div className="mt-5 aspect-video overflow-hidden rounded-[14px] bg-panel">
              <iframe
                src={lecteur(j.video_url)}
                title={`Jour ${num}`}
                allow="fullscreen"
                allowFullScreen
                className="h-full w-full border-0"
              />
            </div>
          )}

          {page.blocs.map((bloc, i) => (
            <Bloc key={i} bloc={bloc} jours={jours} reglages={reglages} />
          ))}

          {j?.consignes && (
            <div className="mt-6 rounded-xl border border-line-strong bg-surface p-4">
              <b className="block font-title text-[14.5px] font-extrabold text-navy">Avant demain</b>
              <span className="mt-0.5 block whitespace-pre-line text-sm">{j.consignes}</span>
            </div>
          )}

          {num > 0 && <Capture key={num} jour={num} deja={j?.capture_faite} onDepose={recharger} />}

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <Link
              to="/workshop/si-ca-ne-marche-pas"
              className="inline-flex min-h-[44px] items-center text-[13px] font-semibold text-muted underline underline-offset-2 hover:text-navy"
            >
              Ça coince ? Va dans « Si ça ne marche pas »
            </Link>
            {(num === 0 || suivant?.ouvert) && num < 7 && (
              <Link to={`/workshop/jour/${num + 1}`} className="btn w-full sm:w-auto">
                Jour {num + 1}
                <Icone nom="fleche" taille={18} />
              </Link>
            )}
          </div>
        </>
      )}
    </>
  )
}

function Bloc({ bloc, jours, reglages }) {
  switch (bloc.type) {
    case 'partie':
      return <h2 className="mt-9 border-t border-line pt-6 text-[20px] sm:text-[23px]">{bloc.titre}</h2>
    case 'etapes':
      return <Etapes titre="Les étapes" bloc={bloc} />
    case 'aide':
      return (
        <div className="mt-5 rounded-xl border-[1.5px] border-line-strong bg-panel p-4 sm:p-5">
          <h3 className="text-[15px] font-bold">{bloc.titre}</h3>
          <ol className="mt-3 space-y-2">
            {bloc.items.map((texte, i) => (
              <li key={i} className="flex gap-2.5 text-[14.5px] leading-relaxed text-navy">
                <span className="flex-none font-bold">{bloc.debut + i}.</span>
                <span className="min-w-0">{texte}</span>
              </li>
            ))}
          </ol>
        </div>
      )
    case 'savoir':
      return <Liste titre="Bon à savoir" items={bloc.items} />
    case 'prompt':
      return <PromptKairo id={bloc.id} titre={bloc.titre} texte={textePrompt(bloc.id, jours, reglages)} />
    case 'reussite':
      return <Liste titre="Tu as réussi si…" items={bloc.items} coche />
    case 'fin':
      return (
        <div className="mt-5 rounded-xl border-[1.5px] border-success/40 bg-success-bg p-4 text-[15px] leading-relaxed text-navy sm:p-5">
          {bloc.texte}
        </div>
      )
    default:
      return null
  }
}

/** Les étapes, numérotées et reliées : on voit d'un coup d'œil le chemin. */
function Etapes({ titre, bloc }) {
  return (
    <div className="mt-5 rounded-xl bg-surface p-4 sm:p-5">
      <h3 className="text-[15px] font-bold">{titre}</h3>
      <ol className="mt-4">
        {bloc.items.map((texte, i) => (
          <li key={i} className="relative flex gap-3.5 pb-5 last:pb-0">
            {i < bloc.items.length - 1 && (
              <span aria-hidden="true" className="absolute bottom-0 left-[14px] top-8 w-px bg-line-strong" />
            )}
            <span className="grid h-[29px] w-[29px] flex-none place-items-center rounded-full border-[1.5px] border-accent bg-canvas font-title text-[12.5px] font-extrabold text-navy">
              {bloc.debut + i}
            </span>
            <p className="min-w-0 flex-1 pt-[3px] text-[14.5px] leading-relaxed text-navy">{texte}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}

function Liste({ titre, items, coche }) {
  return (
    <div className={`mt-5 rounded-xl border p-4 sm:p-5 ${coche ? 'border-success/30 bg-success-bg' : 'border-line bg-surface'}`}>
      <h3 className="text-[15px] font-bold">{titre}</h3>
      <ul className="mt-3 space-y-2.5">
        {items.map((texte) => (
          <li key={texte} className="flex gap-2.5 text-[14.5px] leading-relaxed text-navy">
            {coche ? (
              <Icone nom="valide" taille={17} className="mt-[3px] flex-none text-success" />
            ) : (
              <span aria-hidden="true" className="mt-[9px] h-1.5 w-1.5 flex-none rounded-full bg-accent" />
            )}
            <span className="min-w-0">{texte}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
