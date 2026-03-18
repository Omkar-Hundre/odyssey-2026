/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Orbitron', 'sans-serif'],
        gloock: ['Gloock', 'serif'],
        body: ['Rajdhani', 'sans-serif'],
        mono: ['Share Tech Mono', 'monospace'],
      },
      colors: {
        neon: {
          blue: '#00d4ff',
          purple: '#9b59ff',
          cyan: '#00fff0',
          pink: '#ff006e',
        },
        dark: {
          900: '#020408',
          800: '#050a10',
          700: '#080f18',
          600: '#0d1829',
        }
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 8s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          'from': { boxShadow: '0 0 10px #00d4ff, 0 0 20px #00d4ff' },
          'to': { boxShadow: '0 0 20px #9b59ff, 0 0 40px #9b59ff' },
        }
      },
    },
  },
  plugins: [],
}
