import {NextApiRequest, NextApiResponse} from 'next'
import {createClient} from '@supabase/supabase-js'
import {getTokenFromCookieHeaders} from 'utils/parse-server-cookie'
import fetchEggheadUser from 'api/egghead/users/from-token'
import isEmpty from 'lodash/isEmpty'
import {first} from 'lodash'
import VFile from 'vfile'
import visit from 'unist-util-visit'
import fetch from 'isomorphic-fetch'
import toMarkdown from 'mdast-util-to-markdown'
import mdx from '@mdx-js/mdx'
import {loadContactAvatars} from 'lib/contacts'
import getAccessTokenFromCookie from 'utils/get-access-token-from-cookie'
import {Viewer} from 'types'

export const eggheadLogo =
  'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/001/033/thumb/eggheadlogo.png'

const SUPABASE_URL = `https://${process.env.RESOURCE_NOTES_DATABASE_ID}.supabase.co`
const SUPABASE_KEY = process.env.SUPABASE_KEY
const supabase = SUPABASE_KEY && createClient(SUPABASE_URL, SUPABASE_KEY)

const tableName = process.env.RESOURCE_NOTES_TABLE_NAME || 'resource_notes'

const notes = async (req: NextApiRequest, res: NextApiResponse) => {
  // add note
  if (req.method === 'POST') {
    try {
      const {eggheadToken} = getTokenFromCookieHeaders(
        req.headers.cookie as string,
      )

      // TODO: Cache the egghead user so we aren't hammering?
      const {can_comment, contact_id} = await fetchEggheadUser(
        eggheadToken,
        true,
      )

      if (!can_comment || !supabase) {
        throw new Error('Unable to add note.')
      }

      const {data = [], error} = await supabase.from(tableName).insert([
        {
          user_id: contact_id,
          resource_id: req.query.slug,
          resource_type: 'Lesson',
          text: req.body.text,
          state: req.body.state,
          // image: req.body.image, // We fetch the user's avatar from the contacts API instead
          start_time: Math.floor(req.body.startTime),
          type: 'learner',
          end_time: req.body.endTime
            ? Math.floor(req.body.endTime) + 2
            : Math.floor(req.body.startTime) + 5,
        },
      ])

      if (error) {
        console.log(error)
        throw new Error('Data not loaded')
      }

      const note = first(data)

      res.status(200).json(note)
    } catch (error: any) {
      console.error(error.message)
      res.status(400).end(error.message)
    }
  }
  // get notes
  else if (req.method === 'GET') {
    const {eggheadToken} = getTokenFromCookieHeaders(
      req.headers.cookie as string,
    )
    // TODO: Cache the egghead user so we aren't hammering?
    const viewer = await fetchEggheadUser(eggheadToken, true)

    const {data: userNotes} = await loadUserNotesForResource(
      req.query.slug as string,
      viewer,
    )
    const staffNotes = await loadStaffNotesForResource(
      req.query.staff_notes_url as string,
    )

    const notes = await convertNotes(userNotes, staffNotes)

    res.status(200).json(notes)
  }
  // delete note
  else if (req.method === 'DELETE') {
    if (!supabase) {
      throw new Error('Unable to delete note.')
    }
    await supabase
      .from(tableName)
      .delete()
      .match({id: req.query.id})
      .then(() => {
        res.status(200).end()
      })
  } else {
    console.error('unhandled request made')
    res.status(404).end()
  }
}

export default notes

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

const parseMdxNotesFile = async (text: string) => {
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
