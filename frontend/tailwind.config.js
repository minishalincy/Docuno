/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        'primary':"#6d597a"
      },
      gridTemplateColumns:{
        'auto':'repeat(auto-fill,minmax(200px , 1fr))'
      }
    },
  },
  plugins: [],
}

//#5f6FFF