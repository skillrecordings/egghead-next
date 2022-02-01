import axios from 'axios'

import {NextApiRequest, NextApiResponse} from 'next'
import emailIsValid from 'utils/email-is-valid'
import {isEmpty} from 'lodash'

if (!process.env.EGGHEAD_SUPPORT_BOT_TOKEN) {
  throw new Error('no egghead support+bot token found')
}
const checkProStatus = async (req: NextApiRequest, res: NextApiResponse) => {
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

      const hasProAccess =
        !isEmpty(eggheadUser) &&
        (eggheadUser.is_pro || eggheadUser.is_instructor)

      res.status(200).json({hasProAccess})
    }
  } else {
    res.statusCode = 404
    res.end()
  }
}

export default checkProStatus
