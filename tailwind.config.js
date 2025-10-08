/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'slate-850': '#1e293b',
        'slate-750': '#334155',
        'blue-950': '#172554'
      }
    },
  },
  plugins: [],
}
