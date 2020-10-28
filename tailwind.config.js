module.exports = {
  purge: [
    './src/**/*.js',
    './pages/**/*.js',
    './pages/**/*.tsx',
    './src/**/*.tsx',
  ],
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
    defaultLineHeights: true,
    standardFontWeights: true,
  },
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1440px',
      '3xl': '1920px',
    },
    fontSize: {
      // Set in Major Third typescale (1.25)
      base: '1em',
      lg: '1.25em',
      xl: '1.563em',
      '2xl': '1.953em',
      '3xl': '2.441em',
      '4xl': '3.052em',
      '5xl': '3.815em',
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
            lineHeight: theme('lineHeight.tight'),
            fontSize: theme('fontSize.3xl'),
          },
          h2: {
            lineHeight: theme('lineHeight.snug'),
            fontSize: theme('fontSize.xl'),
          },
          h3: {
            lineHeight: theme('lineHeight.normal'),
            fontSize: theme('fontSize.lg'),
          },
        },
      },
      xl: {
        css: {
          h1: {
            lineHeight: theme('lineHeight.tight'),
            fontSize: theme('fontSize.4xl'),
          },
          h2: {
            lineHeight: theme('lineHeight.snug'),
            fontSize: theme('fontSize.2xl'),
          },
          h3: {
            lineHeight: theme('lineHeight.normal'),
            fontSize: theme('fontSize.lg'),
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
