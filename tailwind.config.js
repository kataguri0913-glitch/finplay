/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#15332f",
        mint: "#dff7ef",
        teal: "#12a594",
        tealDark: "#087f73",
        cream: "#f6faf8",
        gold: "#f4b942"
      },
      boxShadow: {
        soft: "0 12px 35px rgba(21,51,47,.08)"
      }
    }
  },
  plugins: []
};