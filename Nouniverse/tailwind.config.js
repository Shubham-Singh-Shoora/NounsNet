/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'londrina': ['Londrina Solid', 'cursive'],
        'pixel': ['Press Start 2P', 'monospace'],
        'inter': ['Inter', 'sans-serif'],
      },
      colors: {
        'nouns': {
          'bg': '#FDFDFD',
          'text': '#1C1C1E',
          'red': '#D63638',
          'blue': '#2563EB',
          'green': '#059669',
          'grey': '#F7F7F7',
          'dark-grey': '#6B7280',
          'cool-grey': '#D5D7e1',
          'warm-grey': '#E1D7D5',
        }
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(5deg)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(214, 54, 56, 0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(214, 54, 56, 0.6)' },
        }
      }
    },
  },
  plugins: [],
};