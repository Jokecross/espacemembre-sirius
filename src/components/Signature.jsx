import { useEffect, useRef, useState } from 'react'

/**
 * Une case où l'on signe avec le doigt ou la souris. Rend l'image en PNG
 * (fond transparent) dès qu'il y a un trait, null tant que la case est vide.
 */
export default function Signature({ onChange }) {
  const ref = useRef(null)
  const [vide, setVide] = useState(true)
  const dessine = useRef(false)

  useEffect(() => {
    const c = ref.current
    const ratio = window.devicePixelRatio || 1
    c.width = c.offsetWidth * ratio
    c.height = c.offsetHeight * ratio
    const ctx = c.getContext('2d')
    ctx.scale(ratio, ratio)
    ctx.lineWidth = 2.4
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.strokeStyle = '#0B1F4D'
  }, [])

  const point = (e) => {
    const r = ref.current.getBoundingClientRect()
    return [e.clientX - r.left, e.clientY - r.top]
  }
  function debut(e) {
    e.preventDefault()
    ref.current.setPointerCapture(e.pointerId)
    dessine.current = true
    const ctx = ref.current.getContext('2d')
    const [x, y] = point(e)
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x + 0.1, y + 0.1)
    ctx.stroke()
  }
  function trait(e) {
    if (!dessine.current) return
    const ctx = ref.current.getContext('2d')
    const [x, y] = point(e)
    ctx.lineTo(x, y)
    ctx.stroke()
  }
  function fin() {
    if (!dessine.current) return
    dessine.current = false
    setVide(false)
    onChange(ref.current.toDataURL('image/png'))
  }
  function effacer() {
    const c = ref.current
    c.getContext('2d').clearRect(0, 0, c.width, c.height)
    setVide(true)
    onChange(null)
  }

  return (
    <div>
      <div className="relative overflow-hidden rounded-xl border border-white/[.15] bg-white">
        <canvas
          ref={ref}
          onPointerDown={debut}
          onPointerMove={trait}
          onPointerUp={fin}
          onPointerCancel={fin}
          className="block h-[170px] w-full cursor-crosshair touch-none"
          aria-label="Case de signature"
        />
        {vide && (
          <span className="pointer-events-none absolute inset-0 grid place-items-center text-sm font-semibold text-[#9AA0A6]">
            Signe ici avec ton doigt
          </span>
        )}
      </div>
      {!vide && (
        <button type="button" onClick={effacer} className="mt-2 text-[13px] font-semibold text-muted underline-offset-2 hover:text-navy hover:underline">
          Effacer et recommencer
        </button>
      )}
    </div>
  )
}
