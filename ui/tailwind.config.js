/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primaryBG: "#4A4458",
        secondaryBG: "#D9D9D9",
        primaryText: "#FFFFFF",
        secondaryText: "#000000",
        tertiaryText: "#7D5260"
      },
      fontFamily: {
        primaryFont: ['HermeneusOne']
      }
    },
  },
  plugins: [],
}

