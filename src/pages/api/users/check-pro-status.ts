import axios from 'axios'

if (!process.env.EGGHEAD_SUPPORT_BOT_TOKEN) {
  throw new Error('no egghead support+bot token found')
}

import {NextApiRequest, NextApiResponse} from 'next'
import emailIsValid from 'utils/email-is-valid'
import {isEmpty} from 'lodash'
export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const {email} = req.body
    if (!emailIsValid(email)) {
      res.status(400).end()
    } else {
      const userUrl = `${process.env.NEXT_PUBLIC_AUTH_DOMAIN}/api/v1/users/${email}?by_email=true`

      const eggheadUser = await axios
        .get(userUrl, {
          headers: {
            Authorization: `Bearer ${process.env.EGGHEAD_SUPPORT_BOT_TOKEN}`,
          },
        })
        .then(({data}) => data)

      res.status(200).json(!isEmpty(eggheadUser.subscription))
    }
  } else {
    res.statusCode = 404
    res.end()
  }
}
