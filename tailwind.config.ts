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
        card: "rgba(var(--card))",
        muted: "rgb(var(--muted))",
        border: "rgba(var(--border))",
        primary: "rgb(var(--primary))",
        'primary-foreground': "rgb(var(--primary-foreground))",
        success: "rgb(var(--success))",
        danger: "rgb(var(--danger))",
      },
    },
  },
  plugins: [],
};

export default config;
