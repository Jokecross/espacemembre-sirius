/**
 * Copie un texte tel quel. Certains navigateurs laissent la promesse du
 * presse-papiers en attente sans jamais répondre : passé ce délai, on prend
 * la solution de secours.
 */
export async function copierTexte(texte) {
  try {
    await Promise.race([
      navigator.clipboard.writeText(texte),
      new Promise((_, non) => setTimeout(non, 1500)),
    ])
    return true
  } catch {
    const zone = document.createElement('textarea')
    zone.value = texte
    zone.setAttribute('readonly', '')
    zone.style.position = 'fixed'
    zone.style.left = '-9999px'
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
}
