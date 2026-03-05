import {type MDXRemoteSerializeResult} from 'next-mdx-remote'
import {nodeTypes} from '@mdx-js/mdx'
import {serialize} from 'next-mdx-remote/serialize'
import rehypeRaw from 'rehype-raw'
import {
  ShikiRemotePluginOptions,
  shikiRemotePlugin,
} from './shiki-remote-plugin'

/**
 * Serialize MDX with next-mdx-remote. Uses shikiRemotePlugin for syntax highlighting.
 * @param {string} text - The text to serialize
 * @param {boolean} useShikiTwoslash - Whether to use shikiRemotePlugin with rehypeRaw/nodeTypes, defaults to `false`
 * @param {ShikiRemotePluginOptions} syntaxHighlighterOptions - The options to pass to shikiRemotePlugin
 * @param {scope} options.scope - Pass-through variables for use in the MDX content
 * @returns {Promise<MDXRemoteSerializeResult>} The serialized MDX
 * @example
 * const mdx = await serializeMDX('# Hello World')
 * // <h1>Hello World</h1>
 */

type SerializeMDXProps = {
  scope?: Record<string, unknown>
  syntaxHighlighterOptions?: ShikiRemotePluginOptions
  useShikiTwoslash?: boolean
}

const serializeMDX = async (
  text: string,
  {scope, syntaxHighlighterOptions, useShikiTwoslash}: SerializeMDXProps = {},
): Promise<MDXRemoteSerializeResult> => {
  if (useShikiTwoslash) {
    const mdxContent = await serialize(text, {
      blockJS: false,
      blockDangerousJS: true,
      scope,
      mdxOptions: {
        useDynamicImport: true,
        rehypePlugins: [[rehypeRaw as any, {passThrough: nodeTypes}]],
        remarkPlugins: [
          [
            shikiRemotePlugin as any,
            syntaxHighlighterOptions as ShikiRemotePluginOptions,
          ],
        ],
      },
    })
    return mdxContent
  } else {
    const mdxContent = await serialize(text, {
      blockJS: false,
      blockDangerousJS: true,
      scope,
      mdxOptions: {
        useDynamicImport: true,
        remarkPlugins: [
          [
            shikiRemotePlugin as any,
            syntaxHighlighterOptions as ShikiRemotePluginOptions,
          ],
        ],
      },
    })
    return mdxContent
  }
}

export default serializeMDX
