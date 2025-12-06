import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", // Enable dark mode with class strategy
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "#0052FF", // Base blue
          light: "#3374FF",
          dark: "#0041CC",
        },
        secondary: {
          DEFAULT: "#F0F0F0",
          dark: "#1A1A1A",
        },
        accent: "#00D395",
        bird: "#FFD700",
        pipe: {
          light: "#2ECC71",
          dark: "#27AE60",
        },
      },
      animation: {
        "loading-bar": "loading-bar 2s ease-in-out infinite",
      },
      keyframes: {
        "loading-bar": {
          "0%": { width: "0%" },
          "50%": { width: "100%" },
          "100%": { width: "0%" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
