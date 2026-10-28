/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        snowfall: '#fffbf7',
        paper: '#fbf8f1',
        kraft: '#ebdcc9',
        snickerdoodle: '#bda186',
        berry: '#a10b0b',
        santa: '#7d0a00',
        wine: '#530400',
        evergreen: '#1a3b16',
        mistletoe: '#081c06',
        gold: '#c89d53',
        'gold-light': '#f3dfb7',
        charcoal: '#2a2523',
        muted: '#6f6762',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Montserrat"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
