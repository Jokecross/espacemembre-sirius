import { useCallback, useEffect, useState } from 'react'
import { supabase } from './supabase.js'

/** Le fuseau de l'élève, pour que ses jours s'ouvrent à minuit chez lui. */
function fuseauNavigateur() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || null
  } catch {
    return null
  }
}

/** Où vit chaque prompt d'un jour dans `mon_workshop`. */
const COLONNES = {
  PROMPT_J1_AGENCE: [1, 'prompt'],
  PROMPT_J1_COACH: [1, 'prompt_2'],
  PROMPT_J2: [2, 'prompt'],
  PROMPT_J3: [3, 'prompt'],
  PROMPT_J4: [4, 'prompt'],
  PROMPT_J5: [5, 'prompt'],
  PROMPT_J6: [6, 'prompt'],
  PROMPT_J7_DEVIS: [7, 'prompt'],
  PROMPT_J7_FACTURES: [7, 'prompt_2'],
}

/**
 * Le texte exact d'un prompt, sans aucune retouche : ce qui sort d'ici est ce
 * que l'élève colle dans Base44. Le jour 0 et les secours sont ouverts à tous ;
 * un jour à venir revient vide de la base, c'est elle qui décide.
 */
export function textePrompt(id, jours, reglages) {
  if (id === 'PROMPT_J0') return reglages?.prompt_j0 || null
  if (id.startsWith('SOS_')) return reglages?.prompts_sos?.[id] || null
  const [jour, colonne] = COLONNES[id] || []
  return jours?.find((j) => j.jour === jour)?.[colonne] || null
}

/** Les sept jours tels que la base les ouvre, et les réglages du workshop. */
export function useWorkshop() {
  const [jours, setJours] = useState(null)
  const [reglages, setReglages] = useState(null)

  const recharger = useCallback(
    () => supabase.rpc('mon_workshop').then(({ data }) => setJours(data || [])),
    [],
  )

  useEffect(() => {
    // Les jours partent de l'inscription : `workshop_demarrer` ne fait que
    // relever le fuseau, pour que minuit soit celui de l'élève.
    supabase.rpc('workshop_demarrer', { p_fuseau: fuseauNavigateur() }).then(() => recharger())
    supabase
      .from('workshop_reglages')
      .select('*')
      .eq('id', 1)
      .maybeSingle()
      .then(({ data }) => setReglages(data || {}))
  }, [recharger])

  return { jours, reglages, recharger }
}
