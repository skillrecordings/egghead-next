import {NextApiRequest, NextApiResponse} from 'next'
import {sanityClient} from 'utils/sanity-client'
import {nanoid} from 'nanoid'
import {ACCESS_TOKEN_KEY} from 'utils/auth'
import {getAbilityFromToken} from 'server/ability'
import _get from 'lodash/get'
import slugify from 'slugify'

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
  slug: {current: string}
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

    const topics = _get(lesson, 'topics', ['egghead'])
    const lessonSlug = slugify(
      `${topics[0] || ''} ${lesson.title}`.toLowerCase(),
      {remove: /[*+~.()'"!:@]/g},
    )

    sanityLessons.push({
      _type: 'lesson',
      title: lesson.title,
      slug: {current: lessonSlug},
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
  if (req.method === 'POST') {
    const ability = await getAbilityFromToken(req.cookies[ACCESS_TOKEN_KEY])

    if (ability.cannot('upload', 'Video')) {
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
