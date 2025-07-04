/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
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
        },
        // Theme variations
        'dark': {
          'bg': '#0A0A0A',
          'surface': '#1A1A1A',
          'text': '#F8F8F8',
          'muted': '#8E8E93',
          'border': '#2C2C2E',
        },
        'neon': {
          'bg': '#0F0F23',
          'primary': '#00FF88',
          'secondary': '#FF0080',
          'accent': '#00D4FF',
          'surface': '#1A1A3A',
        },
        'warm': {
          'bg': '#FFF8F0',
          'primary': '#D2691E',
          'secondary': '#8B4513',
          'accent': '#FF6347',
          'surface': '#F5F5DC',
        },
        'cool': {
          'bg': '#F0F8FF',
          'primary': '#4682B4',
          'secondary': '#5F9EA0',
          'accent': '#00CED1',
          'surface': '#E6F3FF',
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