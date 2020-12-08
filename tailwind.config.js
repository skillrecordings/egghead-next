const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')

module.exports = {
  purge: [
    './src/**/*.js',
    './pages/**/*.js',
    './pages/**/*.tsx',
    './pages/**/*.mdx',
    './components/**/*.mdx',
    './src/**/*.tsx',
  ],
  theme: {
    extend: {
      colors: {
        gray: colors.coolGray,
        black: defaultTheme.colors.gray['900'],
        brand: defaultTheme.colors.blue['600'],
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            a: {
              color: `${theme('colors.blue.600')} !important`,
            },
            'strong > a': {
              color: `${theme('colors.blue.600')} !important`,
            },
            code: {
              padding: '3px 5px',
              borderRadius: 5,
              background: theme('colors.gray.100'),
            },
            h1: {
              fontSize: theme('fontSize.3xl'),
              lineHeight: theme('lineHeight.tight'),
              fontWeight: theme('fontWeight.bold'),
            },
            h2: {
              fontSize: theme('fontSize.xl'),
              lineHeight: theme('lineHeight.snug'),
              fontWeight: theme('fontWeight.bold'),
            },
            h3: {
              fontSize: theme('fontSize.lg'),
              lineHeight: theme('lineHeight.normal'),
              fontWeight: theme('fontWeight.bold'),
            },
          },
        },
      }),
      screens: {
        xs: '375px',
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
      lineHeight: {
        tighter: 1.1,
      },
    },
  },
  variants: {
    margin: ['responsive', 'first', 'last'],
    padding: ['responsive', 'first', 'last'],
    scale: ['hover'],
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/ui'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
  ],
}
