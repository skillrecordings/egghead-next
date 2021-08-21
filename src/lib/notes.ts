import {createClient} from '@supabase/supabase-js'

const SUPABASE_URL = 'https://aprlrbqhhehhvukdhgbz.supabase.co'
const SUPABASE_KEY = process.env.SUPABASE_KEY || ''
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

export const loadUserNotesForResource = async (
  contactId: string,
  lessonSlug: string,
) => {
  // all notes for the specific user
  // all public notes
  return supabase
    .from('resource_notes')
    .select()
    .eq('resource_id', lessonSlug)
    .or(`state.eq.published${contactId ? `,user_id.eq.${contactId}` : ``}`)
}
