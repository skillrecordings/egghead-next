module.exports = {
  purge: [
    './components/**/*.js',
    './pages/**/*.js',
    './pages/**/*.tsx',
    './components/**/*.tsx',
  ],
  theme: {
    extend: {},
  },
  variants: {},
  plugins: [require('@tailwindcss/typography')],
}
