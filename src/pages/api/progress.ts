import TinCan from 'tincanjs'
import {NextApiRequest, NextApiResponse} from 'next'
import fetchEggheadUser from 'api/egghead/users/from-token'
import {getTokenFromCookieHeaders} from 'utils/auth'

const SCORM_CLOUD_ENDPOINT = `https://cloud.scorm.com/lrs/PZ9CYEKKV8/`

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {eggheadToken} = getTokenFromCookieHeaders(req.headers.cookie as string)

  if (req.method === 'POST') {
    try {
      const lrs = new TinCan.LRS({
        endpoint: SCORM_CLOUD_ENDPOINT,
        username: process.env.SCORM_CLOUD_USERNAME,
        password: process.env.SCORM_CLOUD_PASSWORD,
        allowFail: false,
      })

      const eggheadViewer = await fetchEggheadUser(eggheadToken, true)

      const {verb, target} = req.body

      const statement: any = new TinCan.Statement({
        actor: {
          account: {
            mbox: `mailto:${eggheadViewer.email}`,
            homePage: `https://egghead.io/users/${eggheadViewer.id}`,
            name: `${eggheadViewer.id}`,
          },
        },
        verb: {
          id: `https://w3id.org/xapi/dod-isd/verbs/${verb}`,
          display: {
            'en-US': verb,
          },
        },
        target: target,
      })

      const result: any = await new Promise((resolve, reject) => {
        lrs.saveStatement(statement, {
          callback: function (err: any, xhr: any) {
            if (err !== null) {
              if (xhr !== null) {
                reject(
                  'failed to save statement: ' +
                    xhr.responseText +
                    ' (' +
                    xhr.status +
                    ')',
                )
                return
              }
              reject('failed to save statement: ' + err)
              return
            }
            resolve(statement)
          },
        })
      })
      res.status(200).json(result)
    } catch (ex) {
      res.status(500).end('failed to create lrs')
    }
  } else {
    res.statusCode = 404
    res.end()
  }
}
