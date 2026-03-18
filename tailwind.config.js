/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          green: "#0B2B11",   /* Deep dark green for dark theme */
          gold: "#D4AF37",    /* Rich gold accent */
          light: "#EAEAEA",
        },
        dark: {
          bg: "#051A08",     /* Deeper background */
          card: "#0A2410",   /* Dark cards */
          accent: "#0D3215", /* Slightly lighter accents */
        }
      }
    },
  },
  plugins: [],
}
