/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        quest: {
          bg: '#FDFBF7',
          card: '#FFFFFF',
          pink: '#FCE7F3',
          'pink-dark': '#F472B6',
          yellow: '#FEF9C3',
          'yellow-dark': '#FACC15',
          purple: '#F3E8FF',
          'purple-dark': '#C084FC',
          sky: '#E0F2FE',
          'sky-dark': '#38BDF8',
          mint: '#D1FAE5',
          'mint-dark': '#34D399',
          orange: '#FFEDD5',
          'orange-dark': '#FB923C',
          slate: '#334155',
          border: '#E2E8F0',
        }
      },
      fontFamily: {
        pixel: ['"Galmuri9"', '"Press Start 2P"', 'monospace'],
        sans: ['"Pretendard"', '"Noto Sans KR"', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'pixel': '2px 2px 0px 0px rgba(0,0,0,0.15)',
        'pixel-md': '3px 3px 0px 0px rgba(0,0,0,0.2)',
        'pixel-lg': '4px 4px 0px 0px rgba(0,0,0,0.25)',
        'pixel-pink': '3px 3px 0px 0px #F472B6',
        'pixel-purple': '3px 3px 0px 0px #C084FC',
        'pixel-yellow': '3px 3px 0px 0px #EAB308',
        'pixel-sky': '3px 3px 0px 0px #38BDF8',
        'inner-pixel': 'inset 2px 2px 0px 0px rgba(0,0,0,0.05)',
      },
      animation: {
        'bounce-short': 'bounce 0.5s ease-in-out 1',
        'wiggle': 'wiggle 0.3s ease-in-out infinite',
        'float-xp': 'floatUp 1.2s ease-out forwards',
        'pulse-subtle': 'pulseSubtle 2s infinite',
        'sparkle': 'sparkle 1.5s ease-in-out infinite',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        floatUp: {
          '0%': { opacity: '0', transform: 'translateY(10px) scale(0.8)' },
          '20%': { opacity: '1', transform: 'translateY(-5px) scale(1.1)' },
          '80%': { opacity: '1', transform: 'translateY(-25px) scale(1)' },
          '100%': { opacity: '0', transform: 'translateY(-40px) scale(0.9)' },
        },
        pulseSubtle: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.03)' },
        },
        sparkle: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(0.9)' },
          '50%': { opacity: '1', transform: 'scale(1.1)' },
        }
      }
    },
  },
  plugins: [],
}
