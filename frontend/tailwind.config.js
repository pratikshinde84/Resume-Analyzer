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
        'cb-blue': '#0052ff',
        'cb-blue-active': '#003ecc',
        'cb-blue-disabled': '#a8b8cc',
        'cb-ink': '#0a0b0d',
        'cb-body': '#5b616e',
        'cb-body-strong': '#0a0b0d',
        'cb-muted': '#7c828a',
        'cb-muted-soft': '#a8acb3',
        'cb-hairline': '#dee1e6',
        'cb-hairline-soft': '#eef0f3',
        'cb-canvas': '#ffffff',
        'cb-surface-soft': '#f7f7f7',
        'cb-surface-strong': '#eef0f3',
        'cb-dark': '#0a0b0d',
        'cb-dark-elevated': '#16181c',
        'cb-up': '#05b169',
        'cb-down': '#cf202f',
        'cb-yellow': '#f4b000',
      },
      borderRadius: {
        'cb-pill': '100px',
        'cb-xl': '24px',
        'cb-lg': '16px',
        'cb-md': '12px',
        'cb-sm': '8px',
        'cb-xs': '4px',
      },
      fontFamily: {
        display: ["'Inter'", '-apple-system', 'system-ui', 'sans-serif'],
        sans: ["'Inter'", '-apple-system', 'system-ui', 'sans-serif'],
        mono: ["'JetBrains Mono'", 'monospace'],
      },
      boxShadow: {
        'cb-soft': '0 4px 12px rgba(0, 0, 0, 0.04)',
        'cb-elevated': '0 12px 32px rgba(0, 0, 0, 0.12)',
        'cb-dark-card': '0 8px 24px rgba(0, 0, 0, 0.4)',
      }
    },
  },
  plugins: [],
}

