// Installation:
// yarn add -D @codemod/cli @babel/plugin-syntax-jsx @babel/generator

import jsx from '@babel/plugin-syntax-jsx'
import generate from '@babel/generator'

const COLOR_MAP = {
  white: 'white',
  'near-white': 'gray-100',
  'light-gray': 'gray-200',
  'moon-gray': 'gray-400',
  silver: 'gray-500',
  gray: 'gray-600',
  'dark-gray': 'gray-800',
  black: 'black',
  blue: 'blue-600',

  // my tailwind.config.js extensions
  'black-90': 'black-90',
}

const COLOR_PREFIX_MAP = {
  '': 'text-',
  'bg-': 'bg-',
  'b--': 'border-',
}

// Custom classes that should not be converted because they're included in my index.css
const CUSTOM_CLASSES = []

const MAP = {
  // Remove (junk classes in my specific source)

  // Color mappings for text, background, and border
  ...Object.keys(COLOR_PREFIX_MAP).reduce(
    (result, prefix) => ({
      ...result,
      ...Object.keys(COLOR_MAP).reduce(
        (rest, key) => ({
          ...rest,
          [prefix + key]: COLOR_PREFIX_MAP[prefix] + COLOR_MAP[key],
        }),
        {},
      ),
    }),
    {},
  ),

  'p([tblr])(\\d+)': 'p$1-SPACING$2',
  'pa(\\d+)': 'p-SPACING$1',
  'ph(\\d+)': 'px-SPACING$1',
  'pv(\\d+)': 'py-SPACING$1',

  'm([tblr])(\\d+)': 'm$1-SPACING$2',
  'ma(\\d+)': 'm-SPACING$1',
  'mh(\\d+)': 'mx-SPACING$1',
  'mv(\\d+)': 'my-SPACING$1',

  '(.*)-SPACING0': '$1-0',
  '(.*)-SPACING1': '$1-1',
  '(.*)-SPACING2': '$1-2',
  '(.*)-SPACING3': '$1-4',
  '(.*)-SPACING4': '$1-8',
  '(.*)-SPACING5': '$1-16',
  '(.*)-SPACING6': '$1-32',
  '(.*)-SPACING7': '$1-64',

  'b([tblr])': 'border-$1',
  ba: 'border border-solid',
  bt: 'border-t border-solid',
  bb: 'border-b border-solid',
  bl: 'border-l border-solid',
  br: 'border-r border-solid',
  bn: 'border-0 border-none',
  br0: 'rounded-none',
  br1: 'rounded-sm',
  br2: 'rounded',
  br3: 'rounded-lg',
  'br-pill': 'rounded-full',

  'sans-serif': 'font-sans',
  serif: 'font-serif',
  code: 'font-mono',

  b: 'font-bold',
  tc: 'text-center',
  tr: 'text-right',
  tl: 'text-left',
  tj: 'text-justify',
  'absolute--fill': 'inset-0',
  'outline-0': 'outline-none',
  ttu: 'uppercase',
  ttl: 'lowercase',
  ttc: 'capitalize',
  ttn: 'normal-case',

  '(pointer)': 'cursor-$1',
  'flex-column': 'flex-col',
  'flex-column-reverse': 'flex-col-reverse',

  f7: 'text-xs',
  f6: 'text-sm',
  f5: 'text-base',
  f4: 'text-xl',
  f3: 'text-2xl',
  f2: 'text-4xl',
  f1: 'text-5xl',

  fw9: 'font-black',
  fw8: 'font-extrabold',
  fw7: 'font-bold',
  fw6: 'font-semibold',
  fw5: 'font-medium',
  fw4: 'font-normal',
  fw3: 'font-light',
  fw2: 'font-thin',
  fw1: 'font-hairline',

  mw6: 'max-w-lg',
  mw7: 'max-w-3lx',
  mw8: 'max-w-5xl',

  w1: 'w-4',
  w2: 'w-8',
  w3: 'w-16',
  w4: 'w-32',
  w5: 'w-64',
  'w-third': 'w-1/3',
  'w-two-thirds': 'w-2/3',
  'w-60': 'w-3/5',
  'w-100': 'w-full',
  'measure-narrow': 'max-w-xs',
  measure: 'max-w-md',
  'measure-wide': 'max-w-lg',

  h1: 'h-4',
  h2: 'h-8',
  h3: 'h-16',
  h4: 'h-32',
  h5: 'h-64',
  'h-100': 'h-full',
  'vh-100': 'h-screen',

  'input-reset': 'appearance-none',
  list: 'list-reset',
  'lh-solid': 'leading-none',
  'lh-copy': 'leading-normal',
  'lh-title': 'leading-tight',

  db: 'block',
  di: 'inline',
  dib: 'inline-block',
  dn: 'hidden',
  center: 'mx-auto',
  nowrap: 'whitespace-no-wrap',

  'z-0': 'z-0',
  'z-1': 'z-10',
  'z-2': 'z-20',
  'z-3': 'z-30',
  'z-4': 'z-40',
  'z-5': 'z-50',

  cover: 'bg-cover',
  contain: 'bg-contain',

  // No mapping necessary: matches Tailwind.
  // We still need to list them because everything else will be flagged as UNSUPPORTED so that
  // we can quickly tell which mappings need to be added to this MAP
  flex: 'flex',
  'flex-row': 'flex-row',
  'flex-row-reverse': 'flex-row-reverse',
  'inline-flex': 'inline-flex',
  'items-center': 'items-center',
  'justify-start': 'justify-start',
  'justify-center': 'justify-center',
  'justify-end': 'justify-end',
  'justify-between': 'justify-between',
  'justify-around': 'justify-around',
  absolute: 'absolute',
  'top-0': 'top-0',
  'bottom-0': 'bottom-0',
  'left-0': 'left-0',
  'right-0': 'right-0',
  'inset-0': 'inset-0',
  'bg-transparent': 'bg-transparent',
  truncate: 'truncate',

  // No mapping necessary: manually added to my index.css to match Tachyons
  'aspect-ratio--object': 'aspect-ratio--object',

  // my tailwind.config.js extensions
  'vh-25': 'h-25vh',
  'vh-50': 'h-50vh',
  'vh-75': 'h-75vh',
  mw5: 'max-w-2xs',
  'z-999': 'z-999',
  'z-max': 'z-max',

  // tailwindcss-aspect-ratio plugin
  'aspect-ratio--1x1': 'aspect-ratio-1x1',
  'aspect-ratio--16x9': 'aspect-ratio-16x9',

  // Unsupported
  // '(mw\\d+)': 'UNSUPPORTED-$1', // mw2
  // dim: 'UNSUPPORTED-dim',
  '(.*\\$\\{.*)': '$1',
  '(UNSUPPORTED-.+)': '$1',
  '(APPROXNEXT-.+)': '$1',
}

const NS_REGEXP = /-ns$/
const M_OR_L_REGEXP = /-[ml]$/

function replace(className) {
  return className
    .split(/\s/g)
    .map((klass) => {
      if (klass === '') {
        return klass
      }

      if (
        CUSTOM_CLASSES.some((pattern) => new RegExp(`^${pattern}$`).test(klass))
      ) {
        return klass
      }

      // Strip tachyon responsive modifiers
      let responsivePrefix = ''
      let result = klass.replace(NS_REGEXP, '')
      if (result !== klass) {
        responsivePrefix = 'sm:'
      } else {
        result = klass.replace(M_OR_L_REGEXP, '')
        if (result !== klass) {
          responsivePrefix = 'lg:'
        }
      }

      let matchFound = false
      result = Object.keys(MAP).reduce((acc, key) => {
        // console.log(result);
        const regexp = new RegExp(`^${key}$`)
        if (regexp.test(acc)) {
          matchFound = true
          return acc.replace(regexp, MAP[key])
        }
        return acc
      }, result)
      // return matchFound ? `${responsivePrefix}${result}` : `UNSUPPORTED-${klass}`;
      return `${responsivePrefix}${result}`
    })
    .join(' ');
}

export default function ({types: t}) {
  function isClassNameJSXAttribute(path) {
    // console.log(path.node)
    // return (
    //   path.node.type === 'JSXAttribute' && path.node.name.name === 'className'
    // )
    return t.isJSXIdentifier(path.node.name, {name: 'className'})
  }

  function isContainedInClassNameJSXAttribute(path) {
    return path.findParent((p) => p.node && isClassNameJSXAttribute(p))
  }

  const visitor = {
    ObjectProperty(path) {
      if (isContainedInClassNameJSXAttribute(path)) {
        // className={classNames('white', { bb: 'value' })}
        console.log(
          'ObjectProperty',
          path.findParent(isClassNameJSXAttribute).toString(),
        )
        if (t.isIdentifier(path.node.key)) {
          path.node.key = t.stringLiteral(replace(path.node.key.name))
        } else if (t.isStringLiteral(path.node.key)) {
          path.node.key.value = replace(path.node.key.value)
        }
      }
    },
    TemplateElement(path) {
      if (isContainedInClassNameJSXAttribute(path)) {
        // className={`${a} white`}
        console.log(
          'TemplateElement',
          path.findParent(isClassNameJSXAttribute).toString(),
        )
        const replacement = replace(path.node.value.raw)
        path.node.value.raw = replacement
        path.node.value.cooked = replacement
      }
    },
    StringLiteral(path) {
      if (isContainedInClassNameJSXAttribute(path)) {
        console.log(
          'StringLiteral',
          path.findParent(isClassNameJSXAttribute).toString(),
        )
        path.node.value = replace(path.node.value)
      }
    },
    JSXAttribute(path) {
      if (isClassNameJSXAttribute(path) && t.isStringLiteral(path.node.value)) {
        // className="pointer"
        console.log('JSXAttribute', path.toString())
        path.node.value.value = replace(path.node.value.value).trim()
      }
    },
  }

  return {
    inherits: jsx,
    visitor,
  }
}
