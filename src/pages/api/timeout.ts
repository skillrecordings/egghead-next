import {NextApiRequest, NextApiResponse} from 'next'
import {withPagesApiLogging} from '@/lib/logging'
import {sleep} from '../../utils/sleep'

const visits = async (req: NextApiRequest, res: NextApiResponse) => {
  await sleep(20000)
  res.json({})
}

export default withPagesApiLogging(visits)
