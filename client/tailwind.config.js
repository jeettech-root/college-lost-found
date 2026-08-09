/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Outfit"', 'system-ui', 'sans-serif'],
        body: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif']
      },
      colors: {
        brand: {
          bg: '#0B0F17',
          surface: '#111726',
          surfaceElevated: '#172033',
          border: 'rgba(255, 255, 255, 0.08)',
          borderHover: 'rgba(255, 255, 255, 0.16)',
          found: '#38BDF8',
          lost: '#F59E0B'
        }
      },
      boxShadow: {
        glow: '0 12px 32px -4px rgba(0, 0, 0, 0.5)',
        'cyan-subtle': '0 8px 30px -4px rgba(56, 189, 248, 0.15)',
        'amber-subtle': '0 8px 30px -4px rgba(245, 158, 11, 0.15)',
        'card-hover': '0 20px 40px -15px rgba(0, 0, 0, 0.7)'
      }
    }
  },
  plugins: []
};