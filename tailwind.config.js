/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        'utn-blue': '#003366',
        'primary-teal': '#14b8a6', 
        'success-green': '#10b981',
        'warning-yellow': '#f59e0b',
      }
    },
  },
  plugins: [],
}