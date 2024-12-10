/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./main/templates/main/**/*.html'],
  theme: {
    extend: {
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
        oswald: ['Oswald', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

