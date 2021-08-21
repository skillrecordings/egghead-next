import {NextApiRequest, NextApiResponse} from 'next'
import mdx from '@mdx-js/mdx'
import VFile from 'vfile'
import visit from 'unist-util-visit'
import fetch from 'isomorphic-fetch'
import toMarkdown from 'mdast-util-to-markdown'
import {getTokenFromCookieHeaders} from '../../utils/parse-server-cookie'
import fetchEggheadUser from '../../api/egghead/users/from-token'
import {loadUserNotesForResource} from '../../lib/notes'

const loadGithubNotes = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET' && req.query.url) {
    const text = await loadNotesFromUrl(req.query.url as string)

    const notes = await parseMdxNotesFile(text)

    const {eggheadToken} = getTokenFromCookieHeaders(
      req.headers.cookie as string,
    )

    const {contact_id} = await fetchEggheadUser(eggheadToken, true)

    const {data} = await loadUserNotesForResource(
      contact_id,
      req.query.resource as string,
    )

    const toNotes = data
      ? data.map((note) => {
          return {
            start: note.start_time,
            end: note.end_time,
            text: note.text,
            type: note.type ?? 'learner',
          }
        })
      : []

    const allNotes = [...notes, ...toNotes].sort((a, b) => b.start - a.start)

    let vtt = `WEBVTT\n\n`

    allNotes.forEach((note: any) => {
      vtt =
        vtt +
        `note\n${new Date(note.start * 1000)
          .toISOString()
          .substr(11, 8)}.000 --> ${new Date(note.end * 1000)
          .toISOString()
          .substr(11, 8)}.000
${JSON.stringify(note)}\n\n`
    })

    res.status(200).json(vtt)
  } else {
    res.status(200).end()
  }
}

export default loadGithubNotes

export function parseMdxNotesFile(text: string) {
  // @ts-ignore
  const file = new VFile(text.trimStart())

  function extractNotes() {
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
    remarkPlugins: [extractNotes],
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
      const contents = note.children
        .map((node: any) => toMarkdown(node))
        .join(' ')

      return {
        text: contents.trim(),
        type: 'staff',
        ...attributes,
      }
    })

    return notes
  })
}

export async function loadNotesFromUrl(url: string) {
  const result = await fetch(url)

  return await result.text()
}
