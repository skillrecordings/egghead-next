import TinCan from 'tincanjs'
import axios from 'axios'
import {NextApiRequest, NextApiResponse} from 'next'
import {connectScrollTo} from 'react-instantsearch-dom'

const SCORM_CLOUD_ENDPOINT = `https://cloud.scorm.com/lrs/PZ9CYEKKV8/`

export default async (req: NextApiRequest, res: NextApiResponse) => {
  console.log(req.query)
  if (req.method === 'GET') {
    try {
      const lrs = new TinCan.LRS({
        endpoint: SCORM_CLOUD_ENDPOINT,
        username: process.env.SCORM_CLOUD_USERNAME,
        password: process.env.SCORM_CLOUD_PASSWORD,
        allowFail: false,
      })

      const verb = req.query.verb

      const statement: any = new TinCan.Statement({
        actor: {
          account: {
            homePage: 'https://egghead.io',
            name: '1',
          },
        },
        verb: {
          id: `https://w3id.org/xapi/dod-isd/verbs/${verb}`,
          display: {
            'en-US': verb,
          },
        },
        target: {
          id: 'egghead::lesson::420',
          definition: {
            name: {
              'en-US': 'Taming the Shrew',
            },
            description: {
              'en-US': 'This is a really great video lesson',
            },
            type: 'https://egghead.io/xapi/types#video',
            moreinfo: 'https://egghead.io/lessons/420',
          },
        },
      })

      lrs.saveStatement(statement, {
        callback: function (err: any, xhr: any) {
          if (err !== null) {
            if (xhr !== null) {
              console.log(
                'Failed to save statement: ' +
                  xhr.responseText +
                  ' (' +
                  xhr.status +
                  ')',
              )
              res
                .status(500)
                .end(
                  'failed to save statement: ' +
                    xhr.responseText +
                    ' (' +
                    xhr.status +
                    ')',
                )
              return
            }
            res.status(500).end('failed to save statement: ' + err)
            return
          }

          res.status(200).json(statement)
        },
      })
    } catch (ex) {
      res.status(500).end('failed to create lrs')
    }
  } else {
    res.statusCode = 404
    res.end()
  }
}
