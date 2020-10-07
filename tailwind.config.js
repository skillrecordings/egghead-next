module.exports = {
  purge: [
    './src/**/*.js',
    './pages/**/*.js',
    './pages/**/*.tsx',
    './src/**/*.tsx',
  ],
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1440px',
      '3xl': '1920px',
    },
    typography: (theme) => ({
      default: {
        css: {
          color: theme('colors.gray.800'),
          marginTop: '3em',
          a: {
            color: theme('colors.blue.600'),
            textDecoration: 'underline',
          },
          h1: {
            lineHeight: '1.25',
          },
          h2: {
            lineHeight: '1.33',
          },
          h3: {
            lineHeight: '1.4',
          },
        },
      },
      xl: {
        css: {
          h1: {
            lineHeight: '1.25',
          },
          h2: {
            lineHeight: '1.33',
          },
          h3: {
            lineHeight: '1.4',
          },
        },
      },
    }),
    extend: {},
  },
  variants: {
    margin: ['responsive', 'first', 'last'],
    padding: ['responsive', 'first', 'last'],
  },
  plugins: [require('@tailwindcss/typography', require('@tailwindcss/ui'))],
}
