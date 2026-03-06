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
  const shikiPlugin: any[] | undefined = syntaxHighlighterOptions
    ? [[shikiRemotePlugin as any, syntaxHighlighterOptions]]
    : undefined

  if (useShikiTwoslash) {
    return serialize(text, {
      blockJS: false,
      blockDangerousJS: true,
      scope,
      mdxOptions: {
        useDynamicImport: true,
        rehypePlugins: [[rehypeRaw as any, {passThrough: nodeTypes}]],
        remarkPlugins: shikiPlugin ?? [],
      },
    })
  } else {
    return serialize(text, {
      blockJS: false,
      blockDangerousJS: true,
      scope,
      mdxOptions: {
        useDynamicImport: true,
        remarkPlugins: shikiPlugin ?? [],
      },
    })
  }
}

export default serializeMDX
