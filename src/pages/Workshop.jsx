import { Link } from 'react-router-dom'
import Icone from '../components/Icone.jsx'
import Anneau from '../components/Anneau.jsx'
import Compte from '../components/CompteJour.jsx'
import { useEtatWorkshop } from '../components/ProgrammeVerrouille.jsx'
import { useWorkshop } from '../lib/useWorkshop.js'
import { lecteur } from '../lib/lecteur.js'
import { COMMENT_CA_MARCHE, JOURS } from '../lib/kairo.js'
import { OUTIL } from '../lib/marque'

/**
 * « Construis ton outil Kairo » : l'accueil du parcours, puis une page par jour
 * (`WorkshopJour.jsx`) et la page « Si ça ne marche pas » (`WorkshopSecours.jsx`).
 *
 * Un jour s'ouvre à minuit chez l'élève. C'est la base qui le décide
 * (`mon_workshop`), pas le navigateur : le prompt d'un jour à venir n'est tout
 * simplement pas renvoyé. Changer l'heure de son ordinateur ne donne rien.
 *
 * Le jour 1 s'ouvre dès l'inscription. Le jour 0 est ouvert à tous : il se fait en général pendant l'appel, mais
 * certains ne l'ont pas fait ou doivent recommencer.
 */
export default function Workshop() {
  const { jours, reglages } = useWorkshop()
  const etat = useEtatWorkshop(true)

  if (!jours) return <p className="text-muted">Chargement…</p>

  const faits = jours.filter((j) => j.ouvert).length
  const parJour = new Map(jours.map((j) => [j.jour, j]))

  // L'introduction n'est pas vue : c'est elle qui retient tout, et beaucoup
  // d'élèves ne le comprennent pas. On le dit ici, en grand.
  const introAFaire = etat && !etat.intro_ok && !etat.dispense && !etat.equipe

  return (
    <>
      <p className="eyebrow">Ton workshop</p>
      <h1 className="mt-1.5 text-[25px] sm:text-[31px]">Construis ton outil Kairo</h1>
      <p className="mt-2.5 max-w-[62ch] text-[15px] leading-relaxed">
        Un prompt par jour à coller dans {OUTIL}. En 7 jours, tu as l'outil de ton agence IA.
      </p>

      <section className="mt-6 rounded-[18px] border-[1.5px] border-accent/60 bg-surface p-5 sm:p-6">
        <h2 className="text-[20px] sm:text-[22px]">Comment ça marche</h2>
        <ul className="mt-3 space-y-2.5">
          {COMMENT_CA_MARCHE.map((point) => (
            <li key={point} className="flex gap-2.5 text-[14.5px] leading-relaxed text-navy">
              <span aria-hidden="true" className="mt-[9px] h-1.5 w-1.5 flex-none rounded-full bg-accent" />
              <span className="min-w-0">{point}</span>
            </li>
          ))}
        </ul>
      </section>

      {introAFaire ? (
        <section className="mt-6 rounded-[18px] border border-line-strong bg-panel p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
            <div className="min-w-0 flex-1">
              <h2 className="text-[20px] sm:text-[22px]">Regarde ton introduction</h2>
              <p className="mt-2 max-w-[46ch] text-[15px] leading-relaxed">
                Quelques minutes de vidéo pour bien démarrer ton workshop.
              </p>
            </div>
            <Link to="/" className="btn whitespace-nowrap">
              Regarder l'introduction
              <Icone nom="fleche" taille={18} />
            </Link>
          </div>
        </section>
      ) : (
        <div className="card mt-6 flex flex-wrap items-center gap-4 p-5">
          <Anneau valeur={faits / 7} taille={48} texte={faits} />
          <p className="min-w-0 flex-1 text-sm">
            <b className="block font-title text-[15px] font-extrabold text-navy">
              {faits === 7 ? 'Tes sept jours sont ouverts' : `Tu en es au jour ${faits}`}
            </b>
            <span className="text-muted">
              {faits === 7
                ? 'Tu peux avancer à ton rythme.'
                : 'Le jour suivant s’ouvre cette nuit, à minuit.'}
            </span>
          </p>
        </div>
      )}

      {reglages?.video_systeme_url && <VideoSysteme url={reglages.video_systeme_url} />}

      <div className="mt-6 flex flex-col gap-3">
        {JOURS.map((page) => {
          const j = parJour.get(page.jour)
          return (
            <CarteJour
              key={page.jour}
              page={page}
              ouvert={page.jour === 0 || !!j?.ouvert}
              ouvreLe={j?.ouvre_le}
              capture={!!j?.capture_faite}
            />
          )
        })}

        <Link
          to="/workshop/si-ca-ne-marche-pas"
          className="card-link flex items-center gap-3.5 p-4 sm:px-5"
        >
          <span className="grid h-[38px] w-[38px] flex-none place-items-center rounded-xl bg-panel text-navy">
            <Icone nom="coach" taille={18} />
          </span>
          <span className="min-w-0 flex-1">
            <b className="block font-title text-[15px] font-extrabold text-navy">Si ça ne marche pas</b>
            <span className="text-[13px] text-muted">De quoi te débloquer seul, à tout moment.</span>
          </span>
          <Icone nom="fleche" taille={18} className="flex-none text-navy" />
        </Link>
      </div>
    </>
  )
}

function CarteJour({ page, ouvert, ouvreLe, capture }) {
  const texte = (
    <span className="min-w-0 flex-1">
      <b className="block font-title text-[15px] font-extrabold text-navy">
        Jour {page.jour} · {page.titre}
      </b>
      <span className="line-clamp-2 text-[13px] text-muted">{page.construit}</span>
    </span>
  )

  if (!ouvert) {
    return (
      <div className="card flex items-center gap-3.5 p-4 opacity-[.55] sm:px-5">
        <span className="grid h-[38px] w-[38px] flex-none place-items-center rounded-xl bg-canvas text-muted">
          <Icone nom="cadenas" taille={17} />
        </span>
        {texte}
        <Compte ouvreLe={ouvreLe} />
      </div>
    )
  }

  return (
    <Link to={`/workshop/jour/${page.jour}`} className="card-link flex items-center gap-3.5 p-4 sm:px-5">
      <span
        className={`grid h-[38px] w-[38px] flex-none place-items-center rounded-xl font-title text-sm font-extrabold ${
          page.jour === 0 ? 'bg-panel text-white' : 'bg-accent text-on-accent'
        }`}
      >
        {page.jour}
      </span>
      {texte}
      {capture && <Icone nom="valide" taille={17} className="flex-none text-success" />}
      <Icone nom="fleche" taille={18} className="flex-none text-navy" />
    </Link>
  )
}

/** La vidéo obligatoire, avant le jour 1 : elle explique le système. */
function VideoSysteme({ url }) {
  return (
    <section className="mt-6 rounded-[18px] border-[1.5px] border-accent/45 bg-surface p-5 sm:p-6">
      <span className="pill pill-accent">
        <Icone nom="lecture" taille={14} /> Vidéo obligatoire
      </span>
      <h2 className="mt-3 text-[19px] sm:text-[22px]">À regarder pour comprendre le système</h2>
      <div className="mt-4 aspect-video overflow-hidden rounded-[14px] bg-panel">
        <iframe
          src={lecteur(url)}
          title="Vidéo obligatoire : comprendre le système"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          className="h-full w-full border-0"
        />
      </div>
    </section>
  )
}
