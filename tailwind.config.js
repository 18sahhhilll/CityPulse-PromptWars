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
        brand: {
          50:  '#f0f4ff',
          100: '#e0eaff',
          200: '#c7d7fd',
          300: '#a5b8fc',
          400: '#818cf8',
          500: '#6366f1',   // primary indigo
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          violet: '#8b5cf6',
          indigo: '#6366f1',
          cyan:   '#06b6d4',
          pink:   '#ec4899',
        },
        accent: {
          pink:   '#ec4899',
          violet: '#8b5cf6',
          cyan:   '#06b6d4',
          orange: '#f97316',
          green:  '#10b981',
          amber:  '#f59e0b',
        },
        surface: {
          page:  '#f8fafc',   // main page background
          card:  '#ffffff',   // card background
          muted: '#f1f5f9',   // subtle section backgrounds
          border:'#e2e8f0',   // borders
        },
        text: {
          primary:   '#0f172a',
          secondary: '#475569',
          muted:     '#94a3b8',
        },
        pulse: {
          safe: '#10b981',
          caution: '#f59e0b',
          danger: '#ef4444',
          info: '#3b82f6',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Space Grotesk', 'Poppins', 'sans-serif'],
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: 0.8, filter: 'drop-shadow(0 0 8px rgba(99, 102, 241, 0.5))' },
          '50%': { opacity: 1, filter: 'drop-shadow(0 0 16px rgba(139, 92, 246, 0.8))' },
        }
      }
    },
  },
  plugins: [],
}
