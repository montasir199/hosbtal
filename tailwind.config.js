/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
        'primary-hover': 'var(--primary-hover)',
      },
      fontFamily: {
        kufi: ['Noto Kufi Arabic', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
