/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: "#0b0f19",       // deep dark background
          card: "#131a2a",     // card surface
          text: "#e5f0ff",     // light text
          sky: { DEFAULT: "#38bdf8", 600: "#0284c7" } // sky-blue accents
        }
      },
      boxShadow: {
        soft: "0 10px 25px rgba(0,0,0,0.35)",
      }
    },
  },
  plugins: [],
}
