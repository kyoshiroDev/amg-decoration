/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './apps/amg-deco/src/**/*.{html,ts}',
    './libs/**/*.{html,ts}',
  ],
  theme: {
    extend: {
      colors: {
        // Palette AMG Décoration
        'amg-gold': '#C4A882',
        'amg-gold-light': '#D4BC9A',
        'amg-gold-dark': '#A8916A',
        'amg-gold-accessible': '#7A5E38',
        'amg-dark': '#1A1A1A',
        'amg-dark-secondary': '#2D2D2D',
        'amg-gray': '#6B6B6B',
        'amg-gray-light': '#F5F5F5',
        'amg-white': '#FFFFFF',
        'amg-cream': '#FAF8F5',
      },
      fontFamily: {
        'heading': ['Playfair Display', 'Georgia', 'serif'],
        'body': ['Lato', 'Helvetica Neue', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      maxWidth: {
        '8xl': '88rem',
      },
      transitionDuration: {
        '400': '400ms',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-left': {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.6s ease-out forwards',
        'slide-in-left': 'slide-in-left 0.6s ease-out forwards',
      },
    },
  },
  plugins: [],
};
