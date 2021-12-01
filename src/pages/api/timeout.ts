import {NextApiRequest, NextApiResponse} from 'next'

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const visits = async (req: NextApiRequest, res: NextApiResponse) => {
  await sleep(20000)
  res.json({})
}

export default visits
