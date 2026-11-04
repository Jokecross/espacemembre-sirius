import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'
import OutilsSousVideo from '../components/OutilsSousVideo.jsx'
import SousVideo from '../components/SousVideo.jsx'
import Icone from '../components/Icone.jsx'

export default function Lesson() {
  const { lessonId } = useParams()
  const navigate = useNavigate()
  const [lesson, setLesson] = useState(null)
  const [video, setVideo] = useState(null) // null = pas encore reçu ; { kind, url }
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  // Tout le programme de l'élève, pour la colonne de droite : savoir où on
  // en est et ce qui vient après compte autant que la vidéo elle-même.
  const [programme, setProgramme] = useState(null)

  useEffect(() => {
    let alive = true
    setVideo(null)
    setError('')

    // Si le module n'est pas débloqué, RLS ne renvoie rien : la leçon est
    // introuvable, et on repart à l'accueil.
    supabase
      .from('lessons')
      .select('id, title, module_id, position, avertissement, sous_video, modules(title, position)')
      .eq('id', lessonId)
      .maybeSingle()
      .then(async ({ data, error: dbError }) => {
        if (!alive) return
        // Une requête en erreur n'est pas une leçon absente : renvoyer à
        // l'accueil sans rien dire donnait l'impression que le clic ne
        // marchait pas, alors qu'il manquait une migration.
        if (dbError) {
          setError(`La leçon n'a pas pu être chargée : ${dbError.message}`)
          setLesson({ id: lessonId, title: 'Leçon indisponible', modules: null })
          return
        }
        if (!data) return navigate('/', { replace: true })
        setLesson(data)

        const { data: p } = await supabase
          .from('lesson_progress')
          .select('lesson_id')
          .eq('lesson_id', data.id)
          .maybeSingle()
        if (alive) setDone(!!p)

        const [{ data: mods }, { data: liste }, { data: vues }] = await Promise.all([
          supabase.rpc('my_modules'),
          // RLS ne renvoie que les vidéos ouvertes : les autres restent
          // visibles dans la liste, mais sans lien.
          supabase.from('lessons').select('id, module_id, position, title, duration_seconds').order('position'),
          supabase.from('lesson_progress').select('lesson_id'),
        ])
        if (!alive) return
        const faites = new Set((vues || []).map((v) => v.lesson_id))
        setProgramme(
          (mods || [])
            .filter((m) => !m.is_intro && !m.is_bonus)
            .flatMap((m) => {
              const siennes = (liste || []).filter((l) => l.module_id === m.id)
              return siennes.length
                ? siennes.map((l) => ({ ...l, vue: faites.has(l.id), ouverte: true }))
                : [{ id: `module-${m.id}`, title: m.title, vue: false, ouverte: false }]
            })
        )

        // L'URL de lecture est signée côté serveur et expire au bout de
        // trois heures : copiée ailleurs, elle ne sert plus très longtemps.
        const { data: s } = await supabase.auth.getSession()
        const res = await fetch(`/api/video-token?lessonId=${data.id}`, {
          headers: { Authorization: `Bearer ${s.session.access_token}` },
        })
        if (!alive) return
        if (res.ok) setVideo(await res.json())
        else setError((await res.json().catch(() => ({}))).error || "La vidéo n'est pas disponible pour l'instant.")
      })

    return () => {
      alive = false
    }
  }, [lessonId, navigate])

  async function toggleDone() {
    if (done) {
      await supabase.from('lesson_progress').delete().eq('lesson_id', lesson.id)
      setDone(false)
      marquer(false)
    } else {
      const { data: s } = await supabase.auth.getSession()
      await supabase
        .from('lesson_progress')
        .insert({ lesson_id: lesson.id, member_id: s.session.user.id })
      setDone(true)
      marquer(true)
    }
  }

  function marquer(vue) {
    setProgramme((p) => p?.map((l) => (String(l.id) === String(lesson.id) ? { ...l, vue } : l)) ?? p)
  }

  if (!lesson) return <p className="text-muted">Chargement…</p>

  // Le serveur a répondu, et il n'y a pas de vidéo : la leçon ne tient
  // qu'à son document.
  const sansVideo = !!video && !video.kind && !error

  const total = programme?.length || 0
  const faites = programme?.filter((l) => l.vue).length || 0
  const indice = programme?.findIndex((l) => String(l.id) === String(lesson.id)) ?? -1
  const suivante = indice >= 0 ? programme?.[indice + 1] : null
  const numero = indice >= 0 ? indice + 1 : lesson.modules?.position

  return (
    <>
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm font-bold text-accent hover:underline"
      >
        <span className="rotate-180">
          <Icone nom="fleche" taille={15} />
        </span>
        Retour au programme
      </Link>

      <div className="mt-5 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* ---------- La vidéo ---------- */}
        <div className="min-w-0">
          <p className="eyebrow">
            Module {numero}
            {total > 0 && <span className="text-muted"> sur {total}</span>}
          </p>
          <h1 className="mt-2 font-title text-[23px] font-extrabold leading-tight tracking-tight text-navy sm:text-[28px]">
            {lesson.title}
          </h1>

          {error && !lesson.modules && (
            <div className="card mt-5 border-red-200 bg-red-50 p-5 text-sm font-semibold text-red-700">
              {error}
            </div>
          )}

          {lesson.avertissement && (
            <div className="mt-5 flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
              <span aria-hidden="true" className="text-lg leading-tight">⚠️</span>
              <p className="whitespace-pre-line text-sm font-semibold leading-relaxed text-red-700">
                {lesson.avertissement}
              </p>
            </div>
          )}

          {/* Une leçon peut n'avoir qu'un document — une checklist, par
              exemple. Le serveur répond alors sans vidéo, et le cadre noir
              restait sur « Préparation de la vidéo… » indéfiniment. On ne
              l'affiche plus du tout dans ce cas. */}
          {!sansVideo && (
          <div className="mt-5 aspect-video overflow-hidden rounded-[18px] bg-panel shadow-[0_18px_40px_rgba(0,0,0,.18)]">
            {video?.kind === 'lecteur' ? (
              <iframe
                key={video.url}
                src={video.url}
                title={lesson.title}
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                className="h-full w-full border-0"
              />
            ) : video?.kind ? (
              <video
                key={video.url}
                src={video.url}
                controls
                controlsList="nodownload"
                onContextMenu={(e) => e.preventDefault()}
                className="h-full w-full"
              />
            ) : (
              <div className="grid h-full place-items-center px-6 text-center text-sm text-[#DDE1E7]">
                {error || 'Préparation de la vidéo…'}
              </div>
            )}
          </div>
          )}

          {/* Les deux actions, côte à côte */}
          <div className="mt-5 flex flex-wrap gap-3">
            <button onClick={toggleDone} className={done ? 'btn-ghost' : 'btn'}>
              {done ? (
                <>
                  <Icone nom="valide" taille={17} epaisseur={2.2} /> Leçon terminée
                </>
              ) : (
                "J'ai terminé cette leçon"
              )}
            </button>

            {video?.document && (
              <a href={video.document.url} target="_blank" rel="noopener" className="btn-ghost">
                <Icone nom="document" taille={17} />
                {video.document.name || 'Le document de la leçon'}
              </a>
            )}

            {suivante?.ouverte && (
              <Link to={`/lecon/${suivante.id}`} className="btn-ghost">
                Module suivant <Icone nom="fleche" taille={16} />
              </Link>
            )}
          </div>

          <SousVideo blocs={lesson.sous_video} />

          <OutilsSousVideo />
        </div>

        {/* ---------- Le programme, à droite ---------- */}
        {programme && programme.length > 1 && (
          <aside className="min-w-0">
            <div className="card p-[18px] lg:sticky lg:top-6">
              <div className="flex items-baseline justify-between gap-2">
                <p className="eyebrow">Ton programme</p>
                <span className="text-xs font-bold text-muted">
                  {faites} / {total}
                </span>
              </div>

              <span className="mt-3 block h-1.5 w-full overflow-hidden rounded-full bg-line">
                <span
                  className="block h-full rounded-full bg-accent transition-[width] duration-500"
                  style={{ width: `${total ? (faites / total) * 100 : 0}%` }}
                />
              </span>

              <div className="mt-3.5 flex max-h-[420px] flex-col gap-0.5 overflow-y-auto lg:max-h-[calc(100vh-190px)]">
                {programme.map((l, i) => {
                  const actuelle = String(l.id) === String(lesson.id)
                  const contenu = (
                    <>
                      <span
                        className={`grid h-6 w-6 flex-none place-items-center rounded-full ${
                          l.vue
                            ? 'bg-success-bg text-success'
                            : actuelle
                              ? 'bg-accent text-on-accent'
                              : 'bg-canvas text-muted'
                        }`}
                      >
                        {l.vue ? (
                          <Icone nom="valide" taille={13} epaisseur={2.4} />
                        ) : actuelle ? (
                          <Icone nom="lecture" taille={12} />
                        ) : !l.ouverte ? (
                          <Icone nom="cadenas" taille={12} />
                        ) : (
                          <span className="text-[11px] font-bold">{i + 1}</span>
                        )}
                      </span>
                      <span
                        className={`min-w-0 flex-1 text-[13.5px] ${
                          actuelle ? 'font-bold text-navy' : l.vue ? 'text-ink' : 'text-muted'
                        }`}
                      >
                        {l.title}
                      </span>
                      {l.duration_seconds > 0 && (
                        <span className="flex-none text-[11px] text-muted">
                          {Math.round(l.duration_seconds / 60)} min
                        </span>
                      )}
                    </>
                  )
                  const classe = `flex items-center gap-3 rounded-xl px-2.5 py-2.5 transition ${
                    actuelle ? 'bg-accent-pastel' : l.ouverte ? 'hover:bg-canvas' : 'opacity-60'
                  }`
                  return l.ouverte ? (
                    <Link key={l.id} to={`/lecon/${l.id}`} className={classe}>
                      {contenu}
                    </Link>
                  ) : (
                    <div key={l.id} className={classe}>
                      {contenu}
                    </div>
                  )
                })}
              </div>
            </div>
          </aside>
        )}
      </div>
    </>
  )
}
