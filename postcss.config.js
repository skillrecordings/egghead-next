module.exports = {
  plugins: [
    'tailwindcss',
    'postcss-preset-env',
    'postcss-nested',
    ...(process.env.NODE_ENV === 'production' ? ['autoprefixer'] : []),
  ],
}
