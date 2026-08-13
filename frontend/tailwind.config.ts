import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "rgb(var(--primary) / <alpha-value>)",
        "primary-hover": "rgb(var(--primary-hover) / <alpha-value>)",
        "primary-light": "rgb(var(--primary-light) / <alpha-value>)",
        "theme-bg": "var(--theme-bg)",
        "theme-card": "var(--theme-card)",
        "theme-border": "var(--theme-border)",
        "theme-text": "var(--theme-text)",
        "theme-text-secondary": "var(--theme-text-secondary)",
      },
    },
  },
  darkMode: "class",
  plugins: [],
};
export default config;
