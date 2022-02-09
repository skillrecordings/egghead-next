import axios from 'axios'

import {NextApiRequest, NextApiResponse} from 'next'
import {isEmpty} from 'lodash'
import {sanityClient} from 'utils/sanity-client'
import {getTokenFromCookieHeaders} from 'utils/auth'
import fetchEggheadUser from 'api/egghead/users/from-token'

function formatLessonAsSanityData(lesson: LessonData): SanityLesson {
  // do the data munging
  return {
    // leave ID blank
    _type: 'lesson',
    title: lesson.title,
    awsFilename: lesson.fileMetadata.signedUrl,
  }
}

function formatSanityMutationForLessons(lessons: LessonData[]) {
  const sanityLessons = lessons.map(formatLessonAsSanityData)

  return {
    mutations: sanityLessons.map((lesson) => {
      return {
        create: {
          ...lesson,
        },
      }
    }),
  }
}

// if (!process.env.EGGHEAD_SUPPORT_BOT_TOKEN) {
//   throw new Error('no egghead support+bot token found')
// }
const createSanityLessons = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const {eggheadToken} = getTokenFromCookieHeaders(req.headers.cookie as string)

  if (req.method === 'POST') {
    const eggheadViewer = await fetchEggheadUser(eggheadToken, false)

    // permissions check for creating lessons in Sanity
    const {is_publisher, is_instructor} = eggheadViewer

    if (!is_publisher && !is_instructor) {
      res.status(403).end()
    } else {
      // create the lessons
      //
      const mutationQuery = formatSanityMutationForLessons(req.body.lessons)
      const sanityResponse = sanityClient
        .create(mutationQuery)
        .then(() => {
          console.log({sanityResponse})

          res.status(200).json({sanityResponse})
        })
        .catch((error) => {
          console.log(error)
        })
    }

    // const {lessons} = req.body
    // if (!emailIsValid(email)) {
    //   res.status(400).end()
    // } else {
    //   const userUrl = `${process.env.NEXT_PUBLIC_AUTH_DOMAIN}/api/v1/users/${email}?by_email=true`

    //   const eggheadUser = await axios
    //     .get(userUrl, {
    //       headers: {
    //         Authorization: `Bearer ${process.env.EGGHEAD_SUPPORT_BOT_TOKEN}`,
    //       },
    //     })
    //     .then(({data}) => data)

    //   const hasProAccess =
    //     !isEmpty(eggheadUser) &&
    //     (eggheadUser.is_pro || eggheadUser.is_instructor)

    //   const stripeCustomerId = !isEmpty(eggheadUser) &&
    //     eggheadUser.subscription && {
    //       stripeCustomerId: eggheadUser.subscription.stripe_customer_id,
    //     }

    //   res.status(200).json({hasProAccess, ...stripeCustomerId})
    // }
  } else {
    res.statusCode = 404
    res.end()
  }
}

export default createSanityLessons
