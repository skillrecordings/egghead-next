import type {Transformer} from 'unified'
import {Highlighter, getHighlighter} from 'shiki'
import defaultTheme from 'shiki/themes/github-dark.json'

interface MarkdownNode {
  type: string
  children?: MarkdownNode[]
}

interface CodeNode extends MarkdownNode {
  value: string
  lang: string | null
  meta: string | null
}

const visitCodeNodes = async (
  node: MarkdownNode,
  transformer: (node: CodeNode) => Promise<void>,
) => {
  if (node.type === 'code') {
    await transformer(node as CodeNode)
  }

  if (node.children) {
    for (const child of node.children) {
      await visitCodeNodes(child, transformer)
    }
  }
}

export interface ShikiRemotePluginOptions {
  endpoint: string
  authorization: string
  theme?: string
}

let highlighter: Highlighter | undefined = undefined

const prepHighlighter = async (theme: string | undefined) => {
  if (!highlighter) {
    highlighter = await getHighlighter({
      theme: theme ? require(`shiki/themes/${theme}.json`) : defaultTheme,
    })
  }
}

export function shikiRemotePlugin(opts: ShikiRemotePluginOptions): Transformer {
  return async (ast) => {
    await visitCodeNodes(ast, async (node) => {
      const code = node.value

      try {
        /**
         * We only need to call the remote service when necessary:
         * when 'twoslash' is specified in the code fence. Otherwise,
         * we can just use shiki
         */
        if (!node.meta?.includes('twoslash')) {
          await prepHighlighter(opts.theme)
          const html = await highlighter!.codeToHtml(code, {
            lang: node.lang ?? undefined,
          })

          node.type = 'html'
          node.value = html
          node.children = []

          return
        }
      } catch (e) {
        console.error('Local shiki failed, falling back to remote')
        console.error(e)
      }

      try {
        const response = await fetch(opts.endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: opts.authorization,
          },
          body: JSON.stringify({
            code,
            lang: node.lang,
            meta: node.meta,
            theme: opts.theme,
          }),
        })

        if (response.ok) {
          node.type = 'html'
          node.value = await response.text()
          node.children = []
        } else {
          console.error(await response.text())
        }
      } catch (e) {
        console.error(e)
      }
    })
  }
}
