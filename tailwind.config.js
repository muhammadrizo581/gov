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
        appDark: '#0E1013',
        appCardBg: '#181B20',
        appBorder: '#24272E',
        uzbekBlue: '#92BCF4',
        uzbekGreen: '#22C55E',
        tabBorder: '#3CD5C9',
      },
      fontFamily: {
        sans: ['"Montserrat"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['"SF Mono"', 'Menlo', 'Monaco', 'Consolas', 'monospace']
      },
      letterSpacing: {
        normal: '0.3px',
      }
    },
  },
  plugins: [],
}
