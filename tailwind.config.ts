import type { Config } from "tailwindcss";

// Merged palette: the site's rose-and-obsidian + the deck's gold-and-forest.
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        obsidian: "#0E1411",   // page background: obsidian warmed toward forest
        velvet: "#14211A",     // cards and panels
        line: "#25392D",       // borders and dividers
        botanical: "#2C4C3B",  // brand green: bars, chips, section bands
        gold: "#D4AF6A",       // primary accent: labels, key numbers, buttons
        "gold-soft": "#EAD2A4",// headings on dark cards
        rose: "#B76E79",       // secondary accent: highlights, hover, the "fee" line
        cream: "#F6F4EF",      // main text on dark; light section background
        sage: "#A3B1A8"        // muted text, captions
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Georgia", "serif"], // display (from the deck)
        sans: ["var(--font-inter)", "system-ui", "sans-serif"] // body (kept from the site)
      },
      boxShadow: {
        glow: "0 20px 60px rgba(212, 175, 106, 0.16), 0 10px 30px rgba(183, 110, 121, 0.12)"
      },
      backgroundImage: {
        "velvet-gradient":
          "radial-gradient(circle at top, rgba(183,110,121,0.18), transparent 45%), radial-gradient(circle at 85% 20%, rgba(212,175,106,0.10), transparent 40%), linear-gradient(180deg, rgba(44,76,59,0.18), transparent 60%)"
      }
    }
  },
  plugins: []
};

export default config;
