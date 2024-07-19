/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'], // Enable dark mode with class strategy
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        primary: {
          100: '#FFF1E6',
          500: '#FF7000',
          600: '#cc5c00', // Add the primary-600 color
        },
        dark: {
          100: '#000000',
          200: '#0F1117',
          300: '#151821',
          400: '#212734',
          500: '#101012',
          600: '#0D0D0D', // Slightly darker highlight for hover
        },
        light: {
          900: '#FFFFFF',
          800: '#F4F6F8',
          850: '#FDFDFD',
          700: '#DCE3F1',
          500: '#7B8EC8',
          400: '#858EAD',
        },
        'accent-blue': '#1DA1F2',
        'custom-light-hover': 'rgba(244, 246, 248, 1)', // Custom light hover color
        'custom-dark-hover': 'rgba(13, 13, 13, 1)', // Custom dark hover color updated to match dark-600
      },
      textColor: {
        'dark-100_light-900': {
          light: '#FFFFFF',
          dark: '#000000',
        },
        'dark-200_light-800': {
          light: '#F4F6F8',
          dark: '#0F1117',
        },
        'dark-300_light-700': {
          light: '#DCE3F1',
          dark: '#151821',
        },
        'dark-400_light-600': {
          light: '#858EAD',
          dark: '#212734',
        },
        'dark-500_light-500': {
          light: '#7B8EC8',
          dark: '#101012',
        },
      },
      fontFamily: {
        inter: ['var(--font-inter)'],
        spaceGrotesk: ['var(--font-spaceGrotesk)'],
      },
      boxShadow: {
        'light-100':
          '0px 12px 20px 0px rgba(184, 184, 184, 0.03), 0px 6px 12px 0px rgba(184, 184, 184, 0.02), 0px 2px 4px 0px rgba(184, 184, 184, 0.03)',
        'light-200': '10px 10px 20px 0px rgba(218, 213, 213, 0.10)',
        'light-300': '-10px 10px 20px 0px rgba(218, 213, 213, 0.10)',
        'dark-100': '0px 2px 10px 0px rgba(46, 52, 56, 0.10)',
        'dark-200': '2px 0px 20px 0px rgba(39, 36, 36, 0.04)',
      },
      backgroundImage: {
        'auth-dark': "url('/assets/images/auth-dark.png')",
        'auth-light': "url('/assets/images/auth-light.png')",
        'shimmer-gradient-light': 'linear-gradient(130deg, #ff7e5f, #feb47b)',
        'shimmer-gradient-dark': 'linear-gradient(130deg, #8B4513, #A0522D)', // Deep dark orange gradient
      },
      backgroundSize: {
        '200-percent': '200% 200%',
      },
      screens: {
        xs: '420px',
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
        shimmer: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '100% 50%' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        shimmer: 'shimmer 1s ease-in-out infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')],
}
