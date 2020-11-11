module.exports = {
  plugins: {
    tailwindcss: {},
    'postcss-preset-env': {
      autoprefixer: {
        flexbox: 'no-2009',
      },
    },
    'postcss-nested': {},
  },
}
