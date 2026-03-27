/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#C4121A",
        dark: "#0F172A",
        darkSoft: "#1E293B",
        bg: "#F8FAFC",
        gold: "#D4AF37"
      },
      fontFamily: {
        heading: ['"Playfair Display"', "serif"],
        body: ["Inter", "sans-serif"]
      },
      boxShadow: {
        premium: "0 12px 30px rgba(15, 23, 42, 0.12)"
      }
    }
  },
  plugins: [],
};

