import {remarkCodeHike} from '@code-hike/mdx'
import {type MDXRemoteSerializeResult} from 'next-mdx-remote'
import {nodeTypes} from '@mdx-js/mdx'
import {serialize} from 'next-mdx-remote/serialize'
import rehypeRaw from 'rehype-raw'
import defaultTheme from 'shiki/themes/github-dark.json'
import {
  ShikiRemotePluginOptions,
  shikiRemotePlugin,
} from './shiki-remote-plugin'

/**
 * Serialize MDX with next-mdx-remote. Uses remark-code-hike for syntax highlighting.
 * @param {string} text - The text to serialize
 * @param {boolean} useShikiTwoslash - Whether to use remark-shiki-twoslash instead of remark-code-hike, defaults to `false`
 * @param {SyntaxHighlighterOptions} syntaxHighlighterOptions - The options to pass to the remarkCodeHike or remarkShikiTwoslash plugin
 * @param {ShikiTheme} options.theme - The theme to use for syntax highlighting, defaults to `github-dark`
 * @param {boolean} options.lineNumbers - Whether to render line numbers, defaults to `false`
 * @param {boolean} options.showCopyButton - Whether to render a copy button, defaults to `false`
 * @param {scope} options.scope - Pass-through variables for use in the MDX content
 * @see themes https://github.com/shikijs/shiki/blob/main/docs/themes.md
 * @returns {Promise<MDXRemoteSerializeResult>} The serialized MDX
 * @example
 * const mdx = await serializeMDX('# Hello World')
 * // <h1>Hello World</h1>
 * @example
 * const mdx = await serializeMDX('# Hello World', {theme: 'github-light', lineNumbers: true, showCopyButton: true})
 */

type RemarkCodeHikePluginOptions = {
  theme?: ShikiTheme
  lineNumbers?: boolean
  showCopyButton?: boolean
  autoImport?: boolean
}

type SerializeMDXProps = {
  scope?: Record<string, unknown>
} & (
  | {
      useShikiTwoslash: true
      syntaxHighlighterOptions: ShikiRemotePluginOptions
    }
  | {
      useShikiTwoslash?: false
      syntaxHighlighterOptions?: RemarkCodeHikePluginOptions
    }
)

const serializeMDX = async (
  text: string,
  {scope, syntaxHighlighterOptions, useShikiTwoslash}: SerializeMDXProps = {},
): Promise<MDXRemoteSerializeResult> => {
  if (useShikiTwoslash) {
    const mdxContent = await serialize(text, {
      scope,
      mdxOptions: {
        useDynamicImport: true,
        rehypePlugins: [[rehypeRaw, {passThrough: nodeTypes}]],
        remarkPlugins: [[shikiRemotePlugin, syntaxHighlighterOptions]],
      },
    })
    return mdxContent
  } else {
    const lineNumbers =
      syntaxHighlighterOptions && 'lineNumbers' in syntaxHighlighterOptions
        ? syntaxHighlighterOptions.lineNumbers
        : false

    const showCopyButton =
      syntaxHighlighterOptions && 'showCopyButton' in syntaxHighlighterOptions
        ? syntaxHighlighterOptions.showCopyButton
        : false

    const theme = syntaxHighlighterOptions?.theme
    const mdxContent = await serialize(text, {
      scope,
      mdxOptions: {
        useDynamicImport: true,
        remarkPlugins: [
          [
            remarkCodeHike,
            {
              theme: theme
                ? require(`shiki/themes/${theme}.json`)
                : defaultTheme,
              autoImport: false,
              lineNumbers,
              showCopyButton,
              // ...syntaxHighlighterOptions,
            } as RemarkCodeHikePluginOptions,
          ],
        ],
      },
    })
    return mdxContent
  }
}

export default serializeMDX

type ShikiTheme =
  | 'css-variables'
  | 'dark-plus'
  | 'dracula-soft'
  | 'dracula'
  | 'github-dark-dimmed'
  | 'github-dark'
  | 'github-light'
  | 'hc_light'
  | 'light-plus'
  | 'material-theme-darker'
  | 'material-theme-lighter'
  | 'material-theme-ocean'
  | 'material-theme-palenight'
  | 'material-theme'
  | 'min-dark'
  | 'min-light'
  | 'monokai'
  | 'nord'
  | 'one-dark-pro'
  | 'poimandres'
  | 'rose-pine-dawn'
  | 'rose-pine-moon'
  | 'rose-pine'
  | 'slack-dark'
  | 'slack-ochin'
  | 'solarized-dark'
  | 'solarized-light'
  | 'vitesse-dark'
  | 'vitesse-light'
