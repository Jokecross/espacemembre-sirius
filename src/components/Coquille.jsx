import { Link, useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'
import Icone from './Icone.jsx'
import Anneau from './Anneau.jsx'
import Monogramme from './Monogramme.jsx'
import { MARQUE, OFFRE } from '../lib/marque'

/**
 * La coquille de l'espace élève : barre latérale sur ordinateur, barre
 * d'onglets en bas sur téléphone.
 *
 * C'est ce qui distingue une application d'une page web. Sur téléphone
 * surtout : la navigation reste sous le pouce, on ne remonte jamais
 * chercher un menu.
 */
const ENTREES = [
  { to: '/', nom: 'accueil', libelle: 'Accueil', court: 'Accueil', tour: 'accueil' },
  { to: '/workshop', nom: 'outil', libelle: 'Ton workshop', court: 'Workshop', tour: 'workshop' },
  { to: '/outils', nom: 'ressources', libelle: 'Outils et ressources', court: 'Outils', tour: 'outils' },
]

export default function Coquille({ member, equipe, etatWorkshop, children }) {
  const { pathname } = useLocation()
  const actif = (to) => (to === '/' ? pathname === '/' || pathname.startsWith('/lecon') : pathname.startsWith(to))

  return (
    <div className="min-h-screen lg:flex">
      {/* ---------- Ordinateur : la barre latérale ---------- */}
      <aside className="sticky top-0 hidden h-screen w-[264px] flex-none flex-col gap-7 border-r border-white/[.07] bg-[#0E0E10]/80 px-4 py-7 lg:flex">
        <Link to="/" className="flex items-center gap-3 px-2">
          <Monogramme />
          <span className="min-w-0">
            <span className="block font-title text-[16px] font-bold leading-tight tracking-tight text-navy">
              {MARQUE}
            </span>
            <span className="block text-[12.5px] font-semibold leading-tight text-muted">{OFFRE}</span>
          </span>
        </Link>

        <nav className="flex flex-col gap-1">
          {ENTREES.map((e) => (
            <Link
              key={e.to}
              to={e.to}
              data-tour={e.tour}
              className={`relative flex items-center gap-3 rounded-xl px-3.5 py-3 text-[14.5px] transition ${
                actif(e.to)
                  ? 'bg-accent/[.16] font-semibold text-navy before:absolute before:-left-4 before:top-2.5 before:h-6 before:w-[3px] before:rounded-r before:bg-accent'
                  : 'font-medium text-muted hover:bg-white/[.04] hover:text-navy'
              }`}
            >
              <Icone nom={e.nom} taille={19} className={actif(e.to) ? 'text-navy' : 'text-muted'} />
              {e.libelle}
            </Link>
          ))}

          {equipe && (
            <Link
              to="/admin"
              className={`relative flex items-center gap-3 rounded-xl px-3.5 py-3 text-[14.5px] transition ${
                pathname === '/admin'
                  ? 'bg-accent/[.16] font-semibold text-navy before:absolute before:-left-4 before:top-2.5 before:h-6 before:w-[3px] before:rounded-r before:bg-accent'
                  : 'font-medium text-muted hover:bg-white/[.04] hover:text-navy'
              }`}
            >
              <Icone nom="reglages" taille={19} className={pathname === '/admin' ? 'text-navy' : 'text-muted'} />
              Back-office
            </Link>
          )}
        </nav>

        {/* L'avancement de l'outil, toujours sous les yeux : c'est ce qui
            ramène l'élève au workshop sans qu'on ait à le lui demander. */}
        {etatWorkshop && !etatWorkshop.dispense && etatWorkshop.jour > 0 && (
          <Link to="/workshop" className="card mt-auto p-4 transition hover:border-accent/30">
            <p className="eyebrow">Ton workshop</p>
            <div className="mt-2.5 flex items-center gap-3">
              <Anneau valeur={etatWorkshop.jour / 7} taille={44} epaisseur={4} texte={etatWorkshop.jour} />
              <span className="text-[13px] leading-tight">
                Jour {etatWorkshop.jour} sur 7
                <b className="block text-navy">Reprendre</b>
              </span>
            </div>
          </Link>
        )}

        <div
          className={`flex items-center gap-2.5 border-t border-white/[.07] pt-4 ${
            etatWorkshop && !etatWorkshop.dispense && etatWorkshop.jour > 0 ? '' : 'mt-auto'
          }`}
        >
          <span className="grid h-9 w-9 flex-none place-items-center rounded-full bg-accent font-title text-xs font-extrabold text-on-accent">
            {initiales(member)}
          </span>
          <span className="min-w-0 flex-1 truncate text-[13.5px] font-bold text-navy">
            {member.first_name || member.email}
          </span>
          <button
            onClick={() => supabase.auth.signOut()}
            title="Se déconnecter"
            className="text-muted transition hover:text-navy"
          >
            <Icone nom="deconnexion" taille={18} />
          </button>
        </div>
      </aside>

      {/* ---------- Téléphone : l'en-tête compact ---------- */}
      <div className="min-w-0 flex-1 pb-24 lg:pb-0">
        <header className="sticky top-0 z-40 flex items-center gap-3 border-b border-line bg-canvas/90 px-4 py-3 backdrop-blur-md lg:hidden">
          <Link to="/" className="flex items-center gap-2.5">
            <Monogramme className="h-7 w-7 rounded-lg text-[14px]" />
            <span className="font-title text-[15px] font-bold tracking-tight text-navy">{MARQUE}</span>
          </Link>
          <span className="ml-auto grid h-8 w-8 place-items-center rounded-full bg-accent font-title text-[11.5px] font-extrabold text-on-accent">
            {initiales(member)}
          </span>
        </header>

        <main key={pathname} className="page-in mx-auto max-w-[1120px] px-4 py-6 sm:px-6 lg:px-12 lg:py-11">{children}</main>
      </div>

      {/* ---------- Téléphone : la barre d'onglets ---------- */}
      <nav className="fixed inset-x-0 bottom-0 z-50 flex border-t border-line bg-surface/95 px-1.5 pb-[18px] pt-0.5 backdrop-blur-md lg:hidden">
        {ENTREES.map((e) => (
          <Link
            key={e.to}
            to={e.to}
            data-tour-mobile={e.tour}
            className={`relative flex flex-1 flex-col items-center gap-1 py-2.5 transition ${
              actif(e.to)
                ? 'text-navy before:absolute before:top-0 before:h-[2px] before:w-8 before:rounded-b before:bg-accent'
                : 'text-muted'
            }`}
          >
            <Icone nom={e.nom} taille={21} epaisseur={1.7} />
            <span className="text-[10.5px] font-extrabold">{e.court}</span>
          </Link>
        ))}
      </nav>
    </div>
  )
}

function initiales(m) {
  const source = [m.first_name, m.last_name].filter(Boolean).join(' ') || m.email
  return source
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((mot) => mot[0].toUpperCase())
    .join('')
}
