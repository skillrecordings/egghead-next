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
    extend: {
      colors: {
        blue: {
          50: '#EBF5FF',
          100: '#E1EFFE',
          200: '#C3DDFD',
          300: '#A4CAFE',
          400: '#76A9FA',
          500: '#3F83F8',
          600: '#1C64F2',
          700: '#1A56DB',
          800: '#1E429F',
          900: '#233876',
        },
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
      screens: {
        xs: '320px',
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
    },
  },
  variants: {
    margin: ['responsive', 'first', 'last'],
    padding: ['responsive', 'first', 'last'],
  },
  plugins: [require('@tailwindcss/typography', require('@tailwindcss/ui'))],
}
