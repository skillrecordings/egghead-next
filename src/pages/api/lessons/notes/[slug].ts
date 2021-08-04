import {NextApiRequest, NextApiResponse} from 'next'
import getTracer from 'utils/honeycomb-tracer'
import {setupHttpTracing} from 'utils/tracing-js/dist/src'
import fetchEggheadUser from 'api/egghead/users/from-token'
import {getTokenFromCookieHeaders} from 'utils/parse-server-cookie'
import {createClient} from '@supabase/supabase-js'
import {loadCurrentUser} from '../../../../lib/users'

const tracer = getTracer('subscriber-api')

const SUPABASE_URL = 'https://aprlrbqhhehhvukdhgbz.supabase.co'
const SUPABASE_KEY = process.env.SUPABASE_KEY || ''
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

const addNote = async (req: NextApiRequest, res: NextApiResponse) => {
  setupHttpTracing({name: addNote.name, tracer, req, res})

  if (req.method === 'POST') {
    try {
      console.log(req.method, req.body, req.query)
      const {eggheadToken} = getTokenFromCookieHeaders(
        req.headers.cookie as string,
      )

      // TODO: Cache the egghead user so we aren't hammering?
      const {can_comment, contact_id} = await fetchEggheadUser(
        eggheadToken,
        true,
      )

      if (!can_comment) {
        throw new Error('Unable to add note.')
      }

      const {data, error} = await supabase.from('resource_notes').insert([
        {
          user_id: contact_id,
          resource_id: req.query.slug,
          resource_type: 'Lesson',
          text: req.body.text,
          state: 'draft',
          start_time: req.body.startTime,
        },
      ])

      res.status(200).send({data, error})
    } catch (error) {
      console.error(error.message)
      res.status(400).end()
    }
  } else if (req.method === 'GET') {
    console.log(req.method, req.query)
    const {eggheadToken} = getTokenFromCookieHeaders(
      req.headers.cookie as string,
    )

    // TODO: Cache the egghead user so we aren't hammering?
    const {contact_id} = await fetchEggheadUser(eggheadToken, true)
    // all notes for the specific user
    // all public notes
    const {data, error} = await supabase
      .from('resource_notes')
      .select()
      .eq('resource_id', req.query.slug)
      .or(`state.eq.published,user_id.eq.${contact_id}`)
    res.status(200).json(data)
  } else {
    console.error('unhandled request made')
    res.status(404).end()
  }
}

export default addNote
