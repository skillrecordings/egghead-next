import {NextApiRequest, NextApiResponse} from 'next'
import {sleep} from '../../utils/sleep'

const visits = async (req: NextApiRequest, res: NextApiResponse) => {
  await sleep(20000)
  res.json({})
}

export default visits
