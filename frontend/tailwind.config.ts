import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: "365px",
      },
      fontFamily: {
        cormorant: ["var(--font-cormorant)", "serif"],
        playfair: ["var(--font-playfair)", "serif"],
        outfit: ["var(--font-outfit)", "sans-serif"],
      },
      colors: {
        brand: {
          orange: "#E8670A",
          "orange-light": "#FFF0E6",
          "orange-dark": "#C45408",
          dark: "#0F0F0F",
          "dark-2": "#1a1a1a",
          "dark-3": "#2a2a2a",
          navy: "#1B2B5E",
          "navy-2": "#243570",
          "navy-3": "#2d4080",
          "navy-l": "#EEF1FA",
          "navy-ll": "#F5F7FF",
          "navy-dark": "#0f1829",
          gold: "#C9A84C",
          "gold-l": "#FDF6E3",
          "gold-d": "#A8893A",
        },
      },
      maxWidth: {
        site: "1500px",
      },
      borderRadius: {
        btn: "5px",
      },
    },
  },
  plugins: [],
};
export default config;
