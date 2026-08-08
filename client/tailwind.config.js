/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Trebuchet MS"', '"Segoe UI"', 'sans-serif'],
        body: ['"Aptos"', '"Segoe UI"', 'sans-serif']
      },
      boxShadow: {
        glow: '0 20px 60px rgba(251, 191, 36, 0.18)'
      }
    }
  },
  plugins: []
};