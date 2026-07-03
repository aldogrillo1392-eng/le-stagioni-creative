import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand palette - Le Stagioni Creative
        teal: {
          50:  '#f0fafa',
          100: '#d9f2f2',
          200: '#b0e4e4',
          300: '#7ecece',
          400: '#4db8b8',
          500: '#2fa5a5', // primary brand teal/acqua
          600: '#268a8a',
          700: '#1d6e6e',
          800: '#155555',
          900: '#0e3b3b',
        },
        sand: {
          50:  '#fdfaf5',
          100: '#f7f0e3',
          200: '#ede0c4',
          300: '#dfc9a0',
          400: '#ceaf78',
          500: '#b8955a', // accent sand
        },
        cream: '#FAF8F4',
        panna: '#F4F0E8',
        ivory: '#EFEBE1',
      },
      fontFamily: {
        display: ['var(--font-cormorant)', 'Georgia', 'serif'],
        body:    ['var(--font-inter)', 'system-ui', 'sans-serif'],
        accent:  ['var(--font-cormorant)', 'Georgia', 'serif'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '1rem' }],
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        'brand-sm': '0 1px 3px 0 rgba(47, 165, 165, 0.08)',
        'brand':    '0 4px 16px 0 rgba(47, 165, 165, 0.12)',
        'brand-lg': '0 8px 32px 0 rgba(47, 165, 165, 0.16)',
        'card':     '0 2px 12px 0 rgba(0,0,0,0.06)',
        'card-hover': '0 6px 24px 0 rgba(0,0,0,0.10)',
      },
      animation: {
        'fade-up':   'fadeUp 0.5s ease forwards',
        'fade-in':   'fadeIn 0.4s ease forwards',
        'shimmer':   'shimmer 1.8s infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #2fa5a5 0%, #4db8b8 100%)',
        'gradient-hero':  'linear-gradient(160deg, #FAF8F4 0%, #f0fafa 60%, #d9f2f2 100%)',
      },
    },
  },
  plugins: [],
}

export default config
