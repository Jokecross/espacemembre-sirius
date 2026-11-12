import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'

const date = (d) => (d ? new Date(`${String(d).slice(0, 10)}T12:00:00`).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) : '—')

/**
 * Le suivi des garanties : chaque élève qui a signé le contrat, où il en est
 * des conditions, sa réponse, sa demande, et le verdict calculé par la base.
 * Seul un administrateur coche « remboursé », une fois le remboursement fait
 * sur Whop.
 */
export default function Garanties({ admin }) {
  const [liste, setListe] = useState(null)
  const [filtre, setFiltre] = useState('demandes')
  const [erreur, setErreur] = useState('')

  async function charger() {
    const { data, error } = await supabase.rpc('garanties_suivi')
    if (error) return setErreur(error.message)
    setListe(data || [])
  }
  useEffect(() => {
    charger()
  }, [])

  async function rembourser(id, fait) {
    const { error } = await supabase.rpc('garantie_rembourser', { p_member: id, p_fait: fait })
    if (error) return setErreur(error.message)
    charger()
  }

  if (erreur) return <p className="text-sm font-semibold text-red-700">{erreur}</p>
  if (!liste) return <p className="text-muted">Chargement…</p>

  const FILTRES = [
    ['demandes', 'Demandes à traiter', (g) => g.demande_at && !g.rembourse_at],
    ['encours', 'En cours (7 jours)', (g) => new Date() < new Date(`${g.fin_7_jours}T00:00:00`)],
    ['reponses', 'Sans client', (g) => g.premier_client === false],
    ['clients', 'Premier client trouvé', (g) => g.premier_client === true],
    ['tous', 'Tous', () => true],
  ]
  const visibles = liste.filter(FILTRES.find((f) => f[0] === filtre)[2])
  const compte = (fn) => liste.filter(fn).length

  return (
    <>
      <p className="max-w-[70ch] text-sm">
        Les élèves qui ont signé le contrat de garantie. Conditions (contrats signés depuis le 12 novembre) : les 7 captures du
        workshop et toutes les vidéos de leur formule regardées à 95 % au moins, mesuré seconde par seconde.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {FILTRES.map(([id, lib, fn]) => (
          <button key={id} onClick={() => setFiltre(id)}
            className={`rounded-full px-4 py-2 text-sm font-bold transition ${filtre === id ? 'bg-accent text-on-accent' : 'border border-line bg-surface text-navy hover:bg-canvas'}`}>
            {lib} · {compte(fn)}
          </button>
        ))}
      </div>

      <div className="card mt-5 overflow-x-auto">
        <table className="w-full min-w-[980px] text-left text-sm">
          <thead className="border-b border-line text-xs uppercase tracking-wider text-muted">
            <tr>
              {['Élève', 'Formule', 'Setter', 'Entrée', 'Fin 7 j', 'Workshop', 'Vidéos', 'Premier client', 'Demande', 'Verdict', ''].map((h) => (
                <th key={h} className="px-4 py-3 font-extrabold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibles.map((g) => (
              <tr key={g.member_id} className="border-b border-line last:border-0">
                <td className="px-4 py-3">
                  <b className="block text-navy">{[g.prenom, g.nom].filter(Boolean).join(' ') || '—'}</b>
                  <span className="text-xs text-muted">{g.email}</span>
                </td>
                <td className="px-4 py-3">{g.formule || '—'}</td>
                <td className="px-4 py-3 text-muted">{g.setter || '—'}</td>
                <td className="px-4 py-3">{date(g.date_entree)}</td>
                <td className="px-4 py-3">{date(g.fin_7_jours)}</td>
                <td className={`px-4 py-3 font-bold ${g.workshop >= 7 ? 'text-success' : 'text-navy'}`}>{g.workshop}/7</td>
                <td className={`px-4 py-3 font-bold ${g.videos_total && g.videos_vues >= g.videos_total ? 'text-success' : 'text-navy'}`}>{g.videos_vues}/{g.videos_total}</td>
                <td className="px-4 py-3">{g.premier_client === true ? 'Oui' : g.premier_client === false ? 'Non' : '—'}</td>
                <td className="px-4 py-3">{g.demande_at ? date(g.demande_at) : '—'}</td>
                <td className="px-4 py-3">
                  {g.rembourse_at ? <span className="font-bold text-success">Remboursé le {date(g.rembourse_at)}</span>
                    : g.eligible ? <span className="font-bold text-success">Éligible</span>
                    : <span className="text-muted">{g.raison}{g.version === 1 ? ' (contrat v1)' : ''}</span>}
                </td>
                <td className="px-4 py-3">
                  {admin && g.demande_at && (
                    <button onClick={() => rembourser(g.member_id, !g.rembourse_at)} className="font-bold text-navy hover:underline">
                      {g.rembourse_at ? 'Annuler' : 'Marquer remboursé'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {!visibles.length && (
              <tr><td colSpan={11} className="px-5 py-6 text-center text-muted">Personne dans cette liste.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}
