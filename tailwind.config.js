/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}",],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {//texto
          "50":"#FFF9F2",
          "100":"#FFF1E0",
          "200":"#FEE5C5",
          "300":"#FDD8AB",
          "400":"#F8CC96",
          "500":"#F5C585",
          "600":"#F0CD98",
          "700":"#E3B278",
          "800":"#C4955A",
          "900":"#A57444",
          "950":"#7A502A"},
        'pallete': {//botones y componentes
          100: '#FDE7E6',
          200: '#FDE7E6',
          300: '#F5A5A2',
          400: '#EE817F',
          500: '#E65757',
          600: '#B74444',
          700: '#8E3434',
          800: '#6B2423',
          900: '#490D0B',
        },
      }
    },
  },
  plugins: [],
}

