/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ivory: '#F8F5EF',
        champagne: { DEFAULT: '#C5A46D', dark: '#9C7E4C' },
        sand: '#E9DDC9',
        ocean: '#A9C3C5',
        charcoal: { DEFAULT: '#37332F', deep: '#2B2825' },
      },
      fontFamily: {
        // Fallbacks must contain Vietnamese glyphs (Georgia does not).
        display: ['"Playfair Display Variable"', '"Playfair Display"', '"Times New Roman"', 'Tinos', 'serif'],
        // Formal script for titles (supports Vietnamese)
        script: ['"Great Vibes"', '"Playfair Display Variable"', 'cursive'],
        sans: ['"Be Vietnam Pro"', '"Segoe UI"', 'Roboto', 'Arial', 'sans-serif'],
      },
      letterSpacing: { label: '0.35em' },
      maxWidth: { site: '1360px' },
    },
  },
  plugins: [],
}
