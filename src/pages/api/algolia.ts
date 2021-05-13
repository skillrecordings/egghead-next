import {NextApiRequest, NextApiResponse} from 'next'
import handleSanityAlgoliaWebhook from 'utils/handle-sanity-algolia-webhook'

const algoliaUpdater = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.headers['content-type'] !== 'application/json') {
    res.status(400)
    res.json({message: 'Bad request'})
    return
  }

  return handleSanityAlgoliaWebhook(req.body).then(() =>
    res.status(200).send('ok'),
  )
}

export default algoliaUpdater
