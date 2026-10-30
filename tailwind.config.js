/** @type {import('tailwindcss').Config} */
// Charte Anthony Sirius (~/Desktop/design.md) : noir #050607, blanc, un seul
// accent, le rouge #AE0000. Anton pour les grands titres, Poppins pour le
// reste (à la place de Blackheat et Nexa). Les noms de couleur sont ceux de
// l'espace d'origine (navy = titres, ink = texte…) : les écrans n'ont pas à
// changer, seules les valeurs ont basculé en sombre.
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#FFFFFF',            // titres et texte fort
        ink: '#B0B1B2',             // texte courant (blanc à 68 %)
        muted: '#7C7D7E',           // texte secondaire (blanc à 48 %)
        line: '#1A1C1D',
        'line-strong': '#2A2C2D',
        accent: '#AE0000',          // le rouge
        'accent-light': '#E4B3B3',
        'accent-pastel': '#1C0606', // fond teinté de rouge
        'on-accent': '#FFFFFF',     // texte posé sur le rouge
        canvas: '#050607',          // fond de page
        surface: '#0E0F10',         // cartes (blanc à 3,5 %)
        panel: '#141516',           // blocs mis en avant
        success: '#5BC98C',
        'success-bg': '#0E2418',
        red: {
          50: '#2A1012',
          100: '#3A1517',
          200: '#5C2023',
          600: '#FF8A8D',
          700: '#FFB0B2',
        },
      },
      fontFamily: {
        display: ['Anton', 'Impact', 'sans-serif'],
        title: ['Poppins', 'system-ui', 'sans-serif'],
        body: ['Poppins', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 0 rgba(255,255,255,.03) inset',
        lift: '0 18px 40px rgba(0,0,0,.55)',
      },
    },
  },
  plugins: [],
}
