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
        background: "#000000",
        card: "#111111",
        text: "#FFFFFF",
        accent: "#FFD600",
        border: "rgba(255,255,255,0.08)",
        // Light mode
        light: {
          background: "#FFFFFF",
          card: "#F9F9F9",
          text: "#000000",
          border: "rgba(0,0,0,0.08)",
        },
        yellow: {
          400: '#FFD600',
          500: '#FFD600',
          600: '#C9A227',
        },
      },
      spacing: {
        1: '4px',
        2: '8px',
        3: '12px',
        4: '16px',
        5: '24px',
        6: '32px',
      },
      borderRadius: {
        '2xl': '1.5rem',
      },
      boxShadow: {
        'modern': '0 4px 24px 0 rgba(0,0,0,0.08), 0 1.5px 4px 0 rgba(0,0,0,0.04)',
      },
    },
  },
  plugins: [],
};

export default config;
