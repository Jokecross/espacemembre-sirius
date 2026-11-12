import { useEffect, useRef } from 'react'
import { supabase } from './supabase.js'

/**
 * Le suivi des vidéos Loom, seconde par seconde.
 *
 * Le lecteur Loom parle le protocole player.js : abonné à « timeupdate », il
 * envoie la seconde en cours et la durée plusieurs fois par seconde. On ne
 * compte que la lecture continue : un saut de plus de 2 secondes (l'élève
 * avance dans la vidéo) ne marque rien. Les secondes vues partent à la base
 * (visionnage_noter) par paquets ; elle tient le compte et coche la vidéo à
 * 95 %.
 */
export function useSuiviLoom(iframeRef, lessonId, actif, onPourcentage) {
  const rappel = useRef(onPourcentage)
  rappel.current = onPourcentage

  useEffect(() => {
    if (!actif) return
    const secondes = new Set()
    let dernier = null
    let duree = 0
    let envoi = Promise.resolve()

    const fenetre = () => iframeRef.current?.contentWindow
    const parler = (method, value) =>
      fenetre()?.postMessage(JSON.stringify({ context: 'player.js', version: '0.0.11', method, value, listener: value }), '*')

    function envoyer() {
      if (!secondes.size || !duree) return
      const lot = [...secondes]
      secondes.clear()
      envoi = envoi.then(() =>
        supabase
          .rpc('visionnage_noter', { p_lesson: Number(lessonId), p_duree: Math.round(duree), p_secondes: lot })
          .then(({ data, error }) => {
            if (error) lot.forEach((s) => secondes.add(s)) // on retentera au prochain envoi
            else if (typeof data === 'number') rappel.current?.(data)
          }),
      )
    }

    function message(e) {
      if (!/(^|\.)loom\.com$/.test(new URL(e.origin).hostname) || e.source !== fenetre()) return
      let d = e.data
      try {
        d = typeof d === 'string' ? JSON.parse(d) : d
      } catch {
        return
      }
      if (!d || d.context !== 'player.js') return
      if (d.event === 'ready') {
        ;['timeupdate', 'pause', 'ended'].forEach((ev) => parler('addEventListener', ev))
      } else if (d.event === 'timeupdate' && d.value) {
        const t = Number(d.value.seconds), total = Number(d.value.duration)
        if (total > 0) duree = total
        if (dernier !== null && t >= dernier && t - dernier <= 2) {
          for (let s = Math.floor(dernier); s <= Math.floor(t); s++) secondes.add(s)
        }
        dernier = t
      } else if (d.event === 'pause' || d.event === 'ended') {
        dernier = null
        envoyer()
      }
    }

    const minuterie = setInterval(envoyer, 8000)
    const cache = () => document.visibilityState === 'hidden' && envoyer()
    window.addEventListener('message', message)
    document.addEventListener('visibilitychange', cache)
    return () => {
      envoyer()
      clearInterval(minuterie)
      window.removeEventListener('message', message)
      document.removeEventListener('visibilitychange', cache)
    }
  }, [actif, lessonId])
}
