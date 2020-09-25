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
        },
      },
    }),
    extend: {},
  },
  variants: {
    margin: ['responsive', 'first', 'last'],
  },
  plugins: [require('@tailwindcss/typography', require('@tailwindcss/ui'))],
}
