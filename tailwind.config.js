/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/frontend/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1e50a0", // Ciemny niebieski kolor
        "primary-dark": "#163b78", // Ciemniejszy wariant dla hover
        secondary: "#d1213d", // czerwony
        accent: "#f6f9fc", // jasny niebieski
        muted: "#f5f5f5", // jasny szary
        border: "#e5e5e5", // szary do obramowań
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)"],
        mono: ["var(--font-geist-mono)"],
      },
    },
  },
  plugins: [],
};
