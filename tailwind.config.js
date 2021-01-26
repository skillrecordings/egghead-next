const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')
const {spacing, fontFamily} = require('tailwindcss/defaultTheme')

module.exports = {
  purge: [
    './src/**/*.js',
    './src/pages/**/*.js',
    './src/pages/**/*.tsx',
    './src/pages/**/*.mdx',
    './src/components/**/*.mdx',
    './src/**/*.tsx',
  ],
  theme: {
    colors: {
      ...defaultTheme.colors,
      ...colors,
      gray: colors.blueGray,
      // red: colors.red,
      // blue: colors.blue,
      // yellow: colors.amber,
    },
    extend: {
      colors: {},
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: `${theme('colors.black')}`,
            a: {
              color: `${theme('colors.blue.600')}`,
            },
            'strong > a': {
              color: `${theme('colors.blue.600')}`,
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
              fontWeight: theme('fontWeight.extrabold'),
            },
          },
        },
        dark: {
          css: {
            color: theme('colors.gray.300'),
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
        print: {raw: 'print'},
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
    typography: ['dark'],
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/ui'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/custom-forms'),
  ],
}
