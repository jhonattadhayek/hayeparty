/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'neon-purple': '#8B5CF6',
        'neon-green': '#10B981',
        'neon-blue': '#3B82F6',
        'cyber-dark': '#0A0A0A',
        'cyber-gray': '#1A1A1A',
        'cyber-light': '#2A2A2A',
      },
      fontFamily: {
        'mono': ['Share Tech Mono', 'Courier New', 'monospace'],
      },
      animation: {
        'typing': 'typing 3.5s steps(40, end)',
        'blink': 'blink-caret .75s step-end infinite',
        'glitch': 'glitch 0.3s ease-in-out infinite alternate',
        'neon-pulse': 'neon-pulse 2s ease-in-out infinite alternate',
      },
      keyframes: {
        typing: {
          'from': { width: '0' },
          'to': { width: '100%' }
        },
        'blink-caret': {
          'from, to': { 'border-color': 'transparent' },
          '50%': { 'border-color': '#8B5CF6' }
        },
        glitch: {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
          '100%': { transform: 'translate(0)' }
        },
        'neon-pulse': {
          '0%': { 
            'box-shadow': '0 0 5px #8B5CF6, 0 0 10px #8B5CF6, 0 0 15px #8B5CF6',
            'text-shadow': '0 0 5px #8B5CF6'
          },
          '100%': { 
            'box-shadow': '0 0 10px #8B5CF6, 0 0 20px #8B5CF6, 0 0 30px #8B5CF6',
            'text-shadow': '0 0 10px #8B5CF6'
          }
        }
      },
      backgroundImage: {
        'cyber-grid': 'linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid': '20px 20px',
      }
    },
  },
  plugins: [],
} 