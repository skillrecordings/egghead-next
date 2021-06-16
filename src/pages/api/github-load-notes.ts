import axios from 'axios'
import {NextApiRequest, NextApiResponse} from 'next'
import {getTokenFromCookieHeaders, AUTH_DOMAIN} from 'utils/auth'
import mdx from '@mdx-js/mdx'
import detectFrontmatter from 'remark-frontmatter'
import VFile from 'vfile'
import visit from 'unist-util-visit'
import fetch from 'isomorphic-fetch'
import toMarkdown from 'mdast-util-to-markdown'

const loadGithubNotes = async (req: NextApiRequest, res: NextApiResponse) => {
  const {eggheadToken} = getTokenFromCookieHeaders(req.headers.cookie as string)
  if (req.method === 'GET' && req.query.url) {
    // await axios
    //   .get(req.query.url)
    //   .then(({data}) => {
    //     res.status(200).json(data)
    //   })
    //   .catch((error) => {
    //     console.error(error)
    //     res.status(error.response.status).end(error.response.statusText)
    //   })

    const test = await loadNotesFromUrl(req.query.url as string)

    res.status(200).json(test)
  } else {
    res.status(200).end()
  }
}

export default loadGithubNotes

export async function loadNotesFromUrl(url: string) {
  const result = await fetch(url)

  const text = await result.text()

  // @ts-ignore
  const file = new VFile(text.trimStart())

  function extractFrontmatter() {
    return function transformer(tree: any, file: any) {
      file.data.notes = []
      visit(tree, 'mdxJsxFlowElement', function visitor(node) {
        file.data.notes.push(node)
      })
      // remove(tree, 'mdxJsxFlowElement')
    }
  }

  // @ts-ignore
  const mdxCompiler = mdx.createCompiler({
    remarkPlugins: [detectFrontmatter, extractFrontmatter],
  })

  return mdxCompiler.process(file).then((file: any) => {
    function convertHMS(timeString: string) {
      let seconds = 0

      const arr = timeString.split(':')

      if (arr.length === 3) {
        seconds = Number(arr[0]) * 3600 + Number(arr[1]) * 60 + +Number(arr[2])
      } else if (arr.length === 2) {
        seconds = Number(arr[0]) * 60 + +Number(arr[1])
      } else {
        throw new Error(`can't parse ${timeString}`)
      }
      return seconds
    }

    const notes = file.data.notes.map((note: any) => {
      const attributes = note.attributes.reduce((acc: any, attribute: any) => {
        return {
          ...acc,
          [attribute.name]: convertHMS(attribute.value),
        }
      }, {})
      note.type = 'root'
      const contents = toMarkdown(note)
      return {
        text: contents.trim(),
        ...attributes,
      }
    })

    let vtt = `WEBVTT\n\n`

    notes.forEach((note: any) => {
      vtt =
        vtt +
        `note\n${new Date(note.start * 1000)
          .toISOString()
          .substr(11, 8)}.000 --> ${new Date(note.end * 1000)
          .toISOString()
          .substr(11, 8)}.000
${note.text}\n\n`
    })

    return vtt
  })
}
