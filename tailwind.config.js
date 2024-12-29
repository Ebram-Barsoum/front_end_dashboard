/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF765B',
        secondary: '#709EA8',
        grey: {
          1: '#EDEDED66',
          2: '#C4C2C2',
          3: '#A6A6A6',
        },
        light: '#F7FAFB',
        card: '#FAF6FF',
        stroke: '#EDEDED',
        warn: '#FF0C0C'

      }
    },
  },
  plugins: [],
}

