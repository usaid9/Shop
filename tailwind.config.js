/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary:        'rgb(var(--tw-color-primary) / <alpha-value>)',
        secondary:      'rgb(var(--tw-color-secondary) / <alpha-value>)',
        tertiary:       'rgb(var(--tw-color-tertiary) / <alpha-value>)',
        foreground:     'rgb(var(--tw-color-foreground) / <alpha-value>)',
        muted:          'rgb(var(--tw-color-muted) / <alpha-value>)',
        accent:         'rgb(var(--tw-color-accent) / <alpha-value>)',
        'accent-hover': 'rgb(var(--tw-color-accent-hover) / <alpha-value>)',
      },
      fontFamily: {
        sans:    ['"DM Sans"', 'system-ui', 'sans-serif'],
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
      },
      letterSpacing: {
        superwide: '0.3em',
      },
    },
  },
  plugins: [],
}
