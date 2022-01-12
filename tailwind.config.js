const defaultTheme = require('tailwindcss/defaultTheme')
const {spacing} = require('tailwindcss/defaultTheme')

const containerStylesPlugin = ({addComponents}) =>
  addComponents({
    '.container': {
      maxWidth: '1280px',
    },
  })

module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,tsx,mdx}'],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '0.5rem',
        md: '1.5rem',
      },
    },
    extend: {
      colors: {
        transparentLight: 'rgba(255, 255, 255, 0)', // safari fix
        transparentDark: 'rgba(17, 24, 39, 0)', // safari fix
        gray: {...defaultTheme.colors.gray, 1000: '#0A0F19'},
      },
      boxShadow: {
        smooth:
          '0 4.5px 3.6px -8px rgba(0, 0, 0, 0.01), 0 12.5px 10px -8px rgba(0, 0, 0, 0.015), 0 30.1px 24.1px -8px rgba(0, 0, 0, 0.02), 0 100px 80px -8px rgba(0, 0, 0, 0.03)',
      },
      typography: (theme) => ({
        default: {
          css: {
            color: theme('colors.black'),
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
            'h2,h3,h4': {
              'scroll-margin-top': spacing[32],
            },
            mark: {
              background: theme('colors.pink.100'),
            },
          },
        },
        dark: {
          css: {
            color: theme('colors.white'),
            blockquote: {
              borderLeftColor: theme('colors.gray.700'),
              color: theme('colors.gray.100'),
            },
            h1: {
              color: theme('colors.white'),
            },
            'h2,h3,h4': {
              color: theme('colors.white'),
              'scroll-margin-top': spacing[32],
            },
            code: {
              padding: '3px 5px',
              borderRadius: 5,
              color: theme('colors.white'),
              background: theme('colors.gray.800'),
            },
            'pre > code': {
              background: 'none',
              padding: 0,
            },
            hr: {borderColor: theme('colors.gray.700')},
            strong: {color: theme('colors.white')},
            thead: {
              color: theme('colors.gray.100'),
            },
            tbody: {
              tr: {
                borderBottomColor: theme('colors.gray.700'),
              },
            },
            mark: {
              background: theme('colors.yellow.100'),
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
        print: {raw: 'print'},
      },
      fontSize: {
        // Set in Major Third typescale (1.25)
        base: '1rem',
        lg: '1.25rem',
        xl: '1.563rem',
        '2xl': '1.953rem',
        '3xl': '2.441rem',
        '4xl': '3.052rem',
        '5xl': '3.815rem',
      },
      lineHeight: {
        tighter: 1.1,
      },
    },
  },
  plugins: [
    containerStylesPlugin,
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/line-clamp'),
    require('tailwindcss-autofill'),
    require('tailwindcss-text-fill'),
  ],
}
