module.exports = {
  purge: [
    './components/**/*.js',
    './pages/**/*.js',
    './pages/**/*.tsx',
    './components/**/*.tsx',
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
  variants: {},
  plugins: [require('@tailwindcss/typography', require('@tailwindcss/ui'))],
}
