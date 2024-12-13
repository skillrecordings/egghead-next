import {pgQuery} from '@/db'
import {ContactSchema} from './contact'

export async function getContactByEmail(email: string) {
  const result = await pgQuery(
    `SELECT contacts.*
            FROM contacts
      WHERE contacts.email = $1
      ORDER BY contacts.id ASC
      LIMIT 1;`,
    [email],
  )

  return ContactSchema.parse(result.rows[0])
}
