/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FFF8F0',
          100: '#FFE8D1',
          200: '#FFD1A3',
          300: '#FFB975',
          400: '#FFA147',
          500: '#FF6B35', // Main orange
          600: '#E05528',
          700: '#B8441F',
          800: '#8F3318',
          900: '#662311',
        },
        secondary: {
          50: '#FFE5E8',
          100: '#FFCCD1',
          200: '#FF99A3',
          300: '#FF6675',
          400: '#FF3347',
          500: '#C1121F', // Deep red
          600: '#9D0E19',
          700: '#7A0B13',
          800: '#56080D',
          900: '#330508',
        },
        accent: {
          50: '#FFFAEB',
          100: '#FFF3C7',
          200: '#FFE78F',
          300: '#FFDB57',
          400: '#FFCF1F',
          500: '#FFC857', // Warm yellow
          600: '#E6B34F',
          700: '#CC9E47',
          800: '#B3893F',
          900: '#997437',
        }
      },
      fontFamily: {
        playfair: ['Playfair Display', 'serif'],
        montserrat: ['Montserrat', 'sans-serif'],
      },
      animation: {
        'slide-in': 'slideIn 0.3s ease-out',
        'fade-in': 'fadeIn 0.5s ease-in',
        'bounce-subtle': 'bounceSubtle 1s ease-in-out infinite',
      },
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
    },
  },
  plugins: [],
}
