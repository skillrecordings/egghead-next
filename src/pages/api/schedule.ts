import axios from 'axios'
import {NextApiRequest, NextApiResponse} from 'next'

const AIRTABLE_SCHEDULE_URL = `https://api.airtable.com/v0/appt9rslO0tkAwXUm/schedule`

const events = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    try {
      const {data} = await axios.get(AIRTABLE_SCHEDULE_URL, {
        headers: {
          Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
        },
      })

      const {records = []} = data

      const events = records.reduce((acc: any, potentialEvent: any) => {
        const {expirationDate, ...rawEvent} = potentialEvent.fields
        const now = new Date().getTime()
        const eventExpiration = new Date(expirationDate).getTime()
        const expired = now > eventExpiration

        if (expired) return acc

        return [
          ...acc,
          {
            expiresAt: eventExpiration,
            ...rawEvent,
          },
        ]
      }, [])

      res.setHeader('Cache-Control', 'max-age=1, stale-while-revalidate')
      res.status(200).json(events)
    } catch (error) {
      console.error(JSON.stringify(error))
      res.end()
    }
  } else {
    res.statusCode = 404
    res.end()
  }
}

export default events
