import {NextApiRequest, NextApiResponse} from 'next'
import {sanityClient} from 'utils/sanity-client'
import {getTokenFromCookieHeaders} from 'utils/auth'
import fetchEggheadUser from 'api/egghead/users/from-token'
import {nanoid} from 'nanoid'

type LessonData = {
  title: string
  fileMetadata: {
    fileName: string
    signedUrl: string
  }
}

type SanityVideoResource = {
  _type: string
  _id: string
  filename: string
  originalVideoUrl: string
}

type SanityLesson = {
  _type: string
  title: string
  resource: {
    _type: string
    _ref: string
  }
}

async function formatSanityMutationForLessons(lessons: LessonData[]) {
  let sanityLessons: SanityLesson[] = []
  let sanityResources: SanityVideoResource[] = []

  lessons.forEach(async (lesson) => {
    const videoId = await nanoid()

    sanityResources.push({
      _type: 'videoResource',
      _id: videoId,
      filename: lesson.fileMetadata.fileName,
      originalVideoUrl: lesson.fileMetadata.signedUrl,
    })

    sanityLessons.push({
      _type: 'lesson',
      title: lesson.title,
      resource: {
        _type: 'reference',
        _ref: videoId,
      },
    })
  })

  return {sanityLessons, sanityResources}
}

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
      let transaction = sanityClient.transaction()

      const {sanityLessons, sanityResources} =
        await formatSanityMutationForLessons(req.body.lessons)

      sanityResources.forEach((lesson) => {
        transaction.create(lesson)
      })

      sanityLessons.forEach((lesson) => {
        transaction.create(lesson)
      })

      transaction
        .commit()
        .then((sanityRes) => {
          console.log('Transaction', sanityRes)

          res.status(200).end()
        })
        .catch((err) => console.log('ERROR', err))
    }
  } else {
    res.statusCode = 404
    res.end()
  }
}

export default createSanityLessons
