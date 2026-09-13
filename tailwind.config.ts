import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        obsidian: "#121212",
        rose: "#B76E79",
        botanical: "#2C4C3B",
        cream: "#F5F5F0"
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "serif"],
        sans: ["var(--font-inter)", "sans-serif"]
      },
      boxShadow: {
        glow: "0 20px 60px rgba(183, 110, 121, 0.22)"
      },
      backgroundImage: {
        "velvet-gradient":
          "radial-gradient(circle at top, rgba(183,110,121,0.22), transparent 45%), linear-gradient(180deg, rgba(44,76,59,0.14), transparent 60%)"
      }
    }
  },
  plugins: []
};

export default config;
