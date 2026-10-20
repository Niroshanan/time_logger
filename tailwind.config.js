/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",

  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        surface: "var(--surface)",
        foreground: "var(--foreground)",
        muted: "var(--muted)",
        primary: "var(--primary)",
        "primary-hover": "var(--primary-hover)",
        border: "var(--border)",
        input: "var(--input)",
        danger: "var(--danger)",
      },
    },
  },

  plugins: [],
};