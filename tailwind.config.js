module.exports = {
  purge: [
    './src/**/*.js',
    './pages/**/*.js',
    './pages/**/*.tsx',
    './src/**/*.tsx',
  ],
  theme: {
    typography: (theme) => ({
      default: {
        css: {
          color: theme('colors.gray.800'),
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
