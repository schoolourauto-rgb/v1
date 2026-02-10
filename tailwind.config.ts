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
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: "hsl(var(--primary))",
        'primary-foreground': "hsl(var(--primary-foreground))",
        muted: "hsl(var(--muted))",
        'muted-foreground': "hsl(var(--muted-foreground))",
        card: "hsl(var(--card))",
        'card-foreground': "hsl(var(--card-foreground))",
        border: "hsl(var(--border))",
      },
    },
  },
  plugins: [],
};

export default config;
