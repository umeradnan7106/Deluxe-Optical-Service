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
