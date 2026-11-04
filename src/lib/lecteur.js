/**
 * L'adresse d'un lecteur vidéo, quelle que soit celle qu'on a collée.
 *
 * Loom, Vimeo, YouTube et Google Drive refusent d'être affichés avec leur lien de
 * partage : il leur faut leur adresse de lecteur. On convertit ici plutôt
 * que de compter sur celui qui remplit le back-office.
 */
export function lecteur(url) {
  if (!url) return null
  const u = url.trim()

  const loom = u.match(/loom\.com\/(?:share|embed)\/([a-zA-Z0-9]+)/)
  if (loom) return `https://www.loom.com/embed/${loom[1]}?hide_owner=true&hide_share=true&hide_title=true`

  // Google Drive : le lien de partage d'un fichier ouvre la page Drive.
  // Le lecteur intégrable est sur /preview. Le fichier doit être partagé
  // à « Tous les utilisateurs disposant du lien ».
  const drive =
    u.match(/drive\.google\.com\/file\/d\/([A-Za-z0-9_-]{10,})/) ||
    u.match(/drive\.google\.com\/(?:open|uc)\?(?:[^#]*&)?id=([A-Za-z0-9_-]{10,})/)
  if (drive) return `https://drive.google.com/file/d/${drive[1]}/preview`

  const vimeo = u.match(/vimeo\.com\/(?:video\/)?(\d+)(?:[/?]([a-zA-Z0-9]+))?/)
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}${vimeo[2] ? `?h=${vimeo[2]}` : ''}`

  const yt = u.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/)
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`

  return u
}
