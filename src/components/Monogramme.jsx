/** Le signe de l'espace : un S en Anton sur le rouge d'Anthony. */
export default function Monogramme({ className = 'h-10 w-10 text-[20px]' }) {
  return (
    <span
      aria-hidden="true"
      className={`grid flex-none place-items-center rounded-xl bg-accent font-display leading-none text-on-accent ${className}`}
    >
      S
    </span>
  )
}
