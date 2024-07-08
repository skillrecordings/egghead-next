import {NextApiRequest, NextApiResponse} from 'next'

import {pgQuery} from '@/db'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.json((await pgQuery(`select title from lessons`)).rows)
}

export default handler
