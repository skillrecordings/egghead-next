import {NextApiRequest, NextApiResponse} from 'next'
import {getTokenFromCookieHeaders} from 'utils/parse-server-cookie'
import {createClient} from '@supabase/supabase-js'
import {first} from 'lodash'
import fetchEggheadUser from 'api/egghead/users/from-token'

import {
  loadUserNotesForResource,
  loadStaffNotesForResource,
  convertNotes,
} from 'lib/notes'

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
          start_time: Math.floor(req.body.startTime),
          type: 'learner',
          end_time: req.body.endTime
            ? Math.floor(req.body.endTime) + 2
            : Math.floor(req.body.startTime) + 5,
          // We fetch the user's avatar from the contacts API instead so it's available later
          // image: req.body.image,
        },
      ])

      if (error) {
        console.error(error)
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
    const staff_notes_url = req.query.staff_notes_url
    const staffNotes = staff_notes_url
      ? await loadStaffNotesForResource(staff_notes_url as string)
      : []

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
