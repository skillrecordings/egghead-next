import {NextApiRequest, NextApiResponse} from 'next'
import getTracer from 'utils/honeycomb-tracer'
import {setupHttpTracing} from 'utils/tracing-js/dist/src'
import fetchEggheadUser from 'api/egghead/users/from-token'
import {getTokenFromCookieHeaders} from 'utils/parse-server-cookie'
import {createClient} from '@supabase/supabase-js'
import {loadUserNotesForResource} from '../../../../lib/notes'
import {first} from 'lodash'

const tracer = getTracer('note-api')

const SUPABASE_URL = 'https://aprlrbqhhehhvukdhgbz.supabase.co'
const SUPABASE_KEY = process.env.SUPABASE_KEY
const supabase = SUPABASE_KEY && createClient(SUPABASE_URL, SUPABASE_KEY)

const addNote = async (req: NextApiRequest, res: NextApiResponse) => {
  setupHttpTracing({name: addNote.name, tracer, req, res})

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

      const {data = [], error} = await supabase.from('resource_notes').insert([
        {
          user_id: contact_id,
          resource_id: req.query.slug,
          resource_type: 'Lesson',
          text: req.body.text,
          state: 'draft',
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

      res.status(200).json(first(data))
    } catch (error) {
      console.error(error.message)
      res.status(400).end(error.message)
    }
  } else if (req.method === 'GET') {
    const {eggheadToken} = getTokenFromCookieHeaders(
      req.headers.cookie as string,
    )

    // TODO: Cache the egghead user so we aren't hammering?
    const {contact_id} = await fetchEggheadUser(eggheadToken, true)

    const {data} = await loadUserNotesForResource(
      contact_id,
      req.query.slug as string,
    )
    res.status(200).json(data)
  } else {
    console.error('unhandled request made')
    res.status(404).end()
  }
}

export default addNote
