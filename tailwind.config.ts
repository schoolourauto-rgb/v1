import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--background))",
        foreground: "rgb(var(--foreground))",
        card: "rgb(var(--card))",
        border: "rgb(var(--border))",
        accent: "rgb(var(--accent))",
        accentFg: "rgb(var(--accent-fg))",
        // legacy
        yellow: {
          400: '#FFD600',
          500: '#FFC700',
          600: '#C9A227',
        },
      },
    },
  },
  plugins: [],
};

export default config;
