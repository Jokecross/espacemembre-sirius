import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'
import { ARTICLES, EDITEUR } from '../lib/contrat.js'
import Monogramme from '../components/Monogramme.jsx'
import Signature from '../components/Signature.jsx'

/**
 * Le contrat de garantie d'un lien d'invitation, ouvert sans compte. Le
 * client remplit son nom, signe avec le doigt, et le contrat est figé :
 * on ne peut plus le modifier, seulement le relire et l'imprimer.
 */
export default function Contrat() {
  const { token } = useParams()
  const [c, setC] = useState(undefined) // undefined = chargement, null = introuvable
  const [form, setForm] = useState({ prenom: '', nom: '', email: '', telephone: '' })
  const [signature, setSignature] = useState(null)
  const [lu, setLu] = useState(false)
  const [etat, setEtat] = useState('idle')
  const [erreur, setErreur] = useState('')

  async function charger() {
    const { data, error } = await supabase.rpc('contrat_lire', { p_token: token })
    setC(error ? null : data || null)
  }
  useEffect(() => {
    charger()
  }, [token])

  async function signer(e) {
    e.preventDefault()
    if (!signature) return setErreur('Signe dans la case blanche avant de valider.')
    if (!lu) return setErreur('Coche « Lu et approuvé » pour valider.')
    setEtat('envoi')
    setErreur('')
    const { error } = await supabase.rpc('contrat_signer', {
      p_token: token,
      p_prenom: form.prenom,
      p_nom: form.nom,
      p_email: form.email,
      p_telephone: form.telephone,
      p_signature: signature,
      p_navigateur: navigator.userAgent,
    })
    setEtat('idle')
    if (error) return setErreur(/déjà signé/.test(error.message) ? 'Ce contrat est déjà signé.' : "La signature n'a pas pu être enregistrée. Réessaie.")
    await charger()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (c === undefined) return <p className="p-8 text-center text-muted">Chargement du contrat…</p>
  if (c === null)
    return (
      <div className="grid min-h-screen place-items-center px-5">
        <div className="card max-w-md p-7 text-center">
          <h1 className="text-[24px]">Contrat introuvable</h1>
          <p className="mt-2 text-sm">Ce lien n'est plus valable. Demande un nouveau lien à la personne de l'équipe qui t'a appelé.</p>
        </div>
      </div>
    )

  const date = (d) => new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Paris' })
  const champ = (cle, label, type = 'text', auto) => (
    <label className="block">
      <span className="text-[11.5px] font-semibold uppercase tracking-[0.12em] text-muted">{label}</span>
      <input className="field mt-1.5" type={type} autoComplete={auto} required value={form[cle]}
        onChange={(e) => setForm({ ...form, [cle]: e.target.value })} />
    </label>
  )

  return (
    <div className="contrat-page mx-auto max-w-[760px] px-4 py-6 sm:py-10">
      <div className="card page-in overflow-hidden">
        <div className="flex items-center justify-between gap-4 bg-black px-6 py-5 sm:px-8">
          <div className="flex items-center gap-3">
            <Monogramme />
            <div>
              <h1 className="text-[22px] text-white sm:text-[28px]">Contrat de garantie</h1>
              <p className="text-[13px] font-semibold text-[#C9CACB]">Premier client en 7 jours, ou tes 9,99 € remboursés</p>
            </div>
          </div>
        </div>
        <span className="block h-1 bg-accent" />

        <div className="space-y-5 px-6 py-6 text-[14.5px] leading-relaxed text-ink sm:px-8">
          {c.signe && (
            <p className="no-print rounded-xl border border-success/40 bg-success-bg px-4 py-3 font-semibold text-success">
              ✓ Contrat signé le {date(c.signe_at)}. Tu peux l'enregistrer en PDF avec le bouton en bas.
            </p>
          )}

          <p><b className="text-navy">Entre</b> {EDITEUR},</p>
          <p><b className="text-navy">Et le client</b> ci-dessous, ci-après « le Client ».</p>

          <div className="grid gap-3 rounded-xl border border-white/[.08] bg-white/[.02] p-4 sm:grid-cols-2">
            <Info label="Formule" valeur={c.formule} />
            <Info label="Date d'entrée dans le programme" valeur={date(c.date_entree)} />
            {c.signe && (
              <>
                <Info label="Prénom et nom" valeur={`${c.prenom} ${c.nom}`} />
                <Info label="Téléphone" valeur={c.telephone} />
                <Info label="E-mail (celui du paiement)" valeur={c.email} />
              </>
            )}
          </div>

          {ARTICLES.map(([titre, texte], i) => (
            <div key={titre}>
              <p className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-navy">
                <span className="text-accent-light">Article {i + 1}</span> · {titre}
              </p>
              <p className="mt-1">{texte}</p>
            </div>
          ))}

          <div className="grid gap-4 border-t border-white/[.08] pt-5 sm:grid-cols-2">
            <div>
              <p className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-navy">Pour Sirius</p>
              <div className="mt-2 grid h-[120px] place-items-center rounded-xl bg-white">
                <span className="signature-sirius text-[40px] leading-none text-[#0B1F4D]">Anthony Sirius</span>
              </div>
              <p className="mt-1.5 text-[12px] text-muted">Anthony Sirius, pour Sirius Circle Project Management Services</p>
            </div>
            <div>
              <p className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-navy">Le Client · lu et approuvé</p>
              {c.signe ? (
                <>
                  <div className="mt-2 grid h-[120px] place-items-center rounded-xl bg-white">
                    <img src={c.signature} alt={`Signature de ${c.prenom} ${c.nom}`} className="max-h-[110px]" />
                  </div>
                  <p className="mt-1.5 text-[12px] text-muted">{c.prenom} {c.nom}, le {date(c.signe_at)}</p>
                </>
              ) : (
                <p className="mt-2 text-[13px] text-muted">Remplis tes informations et signe ci-dessous.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {c.signe ? (
        <button onClick={() => window.print()} className="btn no-print mt-5 w-full">Enregistrer en PDF</button>
      ) : (
        <form onSubmit={signer} className="card no-print mt-5 space-y-4 p-6 sm:p-8">
          <h2 className="text-[22px]">Signe ton contrat</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {champ('prenom', 'Prénom', 'text', 'given-name')}
            {champ('nom', 'Nom', 'text', 'family-name')}
            {champ('email', 'E-mail du paiement', 'email', 'email')}
            {champ('telephone', 'Téléphone', 'tel', 'tel')}
          </div>
          <div>
            <span className="text-[11.5px] font-semibold uppercase tracking-[0.12em] text-muted">Ta signature</span>
            <div className="mt-1.5"><Signature onChange={setSignature} /></div>
          </div>
          <label className="flex items-start gap-3 text-[14px]">
            <input type="checkbox" checked={lu} onChange={(e) => setLu(e.target.checked)} className="mt-1 h-4 w-4 flex-none accent-[#AE0000]" />
            <span>Lu et approuvé. Je signe ce contrat de garantie.</span>
          </label>
          {erreur && <p className="text-sm font-semibold text-red-700">{erreur}</p>}
          <button className="btn w-full" disabled={etat === 'envoi'}>{etat === 'envoi' ? 'Signature…' : 'Signer le contrat'}</button>
        </form>
      )}
    </div>
  )
}

function Info({ label, valeur }) {
  return (
    <div>
      <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">{label}</span>
      <b className="mt-0.5 block text-[14.5px] text-navy">{valeur}</b>
    </div>
  )
}
