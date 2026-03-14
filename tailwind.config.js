/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#080808',
        secondary: '#141414',
        tertiary: '#1e1e1e',
        foreground: '#f0ede8',
        muted: '#6b6460',
        accent: '#c8102e',
        'accent-hover': '#a50d26',
      },
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
      },
      letterSpacing: {
        superwide: '0.3em',
      },
    },
  },
  plugins: [],
}
