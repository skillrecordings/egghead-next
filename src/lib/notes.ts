import {Viewer} from 'types'
import {loadContactAvatars} from 'lib/contacts'
import {createClient} from '@supabase/supabase-js'
import getAccessTokenFromCookie from 'utils/get-access-token-from-cookie'
import isEmpty from 'lodash/isEmpty'
import VFile from 'vfile'
import visit from 'unist-util-visit'
import toMarkdown from 'mdast-util-to-markdown'
import mdx from '@mdx-js/mdx'
import fetch from 'isomorphic-fetch'

export const eggheadLogo =
  'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/001/033/thumb/eggheadlogo.png'

const SUPABASE_URL = `https://${process.env.RESOURCE_NOTES_DATABASE_ID}.supabase.co`
const SUPABASE_KEY = process.env.SUPABASE_KEY
const supabase = SUPABASE_KEY && createClient(SUPABASE_URL, SUPABASE_KEY)

export const loadStaffNotesForResource = async (staffNotesUrl: any) => {
  const data = await (await fetch(staffNotesUrl)).text()
  const notes = await parseMdxNotesFile(data)
  return notes
}

export const loadUserNotesForResource = async (
  lessonSlug: string,
  viewer: Viewer,
) => {
  const {contact_id, avatar_url} = viewer
  // all notes for the specific user
  // all public notes
  if (supabase) {
    const {data, error} = await supabase
      .from(process.env.RESOURCE_NOTES_TABLE_NAME || 'resource_notes')
      .select()
      .eq('resource_id', lessonSlug)
      .or(`state.eq.published${contact_id ? `,user_id.eq.${contact_id}` : ``}`)

    // load and add user avatars to display along with notes
    const token = getAccessTokenFromCookie()
    const userIds = data?.map((note) => note.user_id)
    // TODO: fix the GraphQL query in loadContactAvatars as it's not working
    const avatars = userIds && (await loadContactAvatars(userIds, token))
    const notes = !isEmpty(avatars)
      ? data?.map((note, i) => {
          return {
            ...note,
            image: avatars[i].avatar_url,
          }
        })
      : data?.map((note) => {
          note.user_id === contact_id && (note.image = avatar_url)
          return note
        })

    return {data: notes, error}
  } else {
    return {data: [], error: 'no supabase'}
  }
}

export const parseMdxNotesFile = async (text: string) => {
  // @ts-ignore
  const file = new VFile(text.trimStart())

  function extractNotes() {
    return function transformer(tree: any, file: any) {
      file.data.notes = []
      visit(tree, 'mdxJsxFlowElement', function visitor(node: any) {
        file.data.notes.push(node)
      })
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
        image: eggheadLogo,
        ...attributes,
      }
    })
    return notes
  })
}

export const convertNotes = async (userNotes: any, staffNotes?: any) => {
  const default_avatar_url =
    'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'

  const toNotes = userNotes
    ? userNotes.map((note: any) => {
        return {
          id: note.id,
          start: note.start_time,
          end: note.end_time,
          text: note.text,
          type: note.type ?? 'learner',
          image: note.image ?? default_avatar_url,
        }
      })
    : []

  const allNotes = [...toNotes, ...staffNotes].sort((a, b) => b.start - a.start)

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
  return vtt
}
