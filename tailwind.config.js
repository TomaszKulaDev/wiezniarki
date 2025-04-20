/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/frontend/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#1e50a0",
        "primary-dark": "#163b78",
        secondary: "#d1213d",
        accent: "#f6f9fc",
        muted: "#f5f5f5",
        border: "#e5e5e5",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)"],
        mono: ["var(--font-geist-mono)"],
      },
      backgroundColor: {
        DEFAULT: "#ffffff",
      },
      textColor: {
        DEFAULT: "#1a1a1a",
      },
    },
  },
  plugins: [
    function ({ addBase }) {
      addBase({
        html: { backgroundColor: "#ffffff" },
        body: { backgroundColor: "#ffffff", color: "#1a1a1a" },
      });
    },
  ],
};
