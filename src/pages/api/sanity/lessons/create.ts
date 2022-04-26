import {NextApiRequest, NextApiResponse} from 'next'
import {nanoid} from 'nanoid'
import {ACCESS_TOKEN_KEY} from 'utils/auth'
import {getAbilityFromToken} from 'server/ability'
import {CourseData} from 'types'

import client from '@sanity/client'

type LessonData = {
  title: string
  fileMetadata: {
    fileName: string
    signedUrl: string
  }
}

type SanityReferenceArray = Array<{
  _key: string
  _type: 'reference'
  _ref: string
}>

type SanityVideoResource = {
  _type: 'videoResource'
  _id: string
  filename: string
  originalVideoUrl: string
}

type SanityLesson = {
  _type: 'lesson'
  _id: string
  title: string
  resource: {
    _type: string
    _ref: string
  }
}

type SanityCourse = {
  _type: 'course'
  title: string
  collaborators: SanityReferenceArray
  lessons: SanityReferenceArray
}

const sanityClient = client({
  projectId: 'sb1i5dlc',
  dataset: 'production',
  useCdn: true,
  token: process.env.SANITY_EDITOR_TOKEN,
})

const sanityIdForDocumentType = async (
  documentType: string,
): Promise<string> => {
  const id = await nanoid()
  return `${documentType}-${id}`
}

async function formatSanityMutationForLessons(
  course: CourseData,
  lessons: LessonData[],
): Promise<{
  sanityCourse: SanityCourse
  sanityLessons: SanityLesson[]
  sanityResources: SanityVideoResource[]
}> {
  let sanityLessons: SanityLesson[] = []
  let sanityResources: SanityVideoResource[] = []

  const {title, collaboratorId} = course

  let sanityCourse: SanityCourse = {
    _type: 'course',
    title,
    lessons: [],
    collaborators: [],
  }

  const collaboratorKey = await nanoid()

  if (typeof collaboratorId === 'string') {
    sanityCourse.collaborators = [
      {
        _key: collaboratorKey,
        _type: 'reference',
        _ref: collaboratorId,
      },
    ]
  }

  await Promise.all(
    lessons.map(async (lesson) => {
      const videoId = await sanityIdForDocumentType('videoResource')

      sanityResources.push({
        _type: 'videoResource',
        _id: videoId,
        filename: lesson.fileMetadata.fileName,
        originalVideoUrl: lesson.fileMetadata.signedUrl,
      })

      const lessonId = await sanityIdForDocumentType('lesson')

      sanityLessons.push({
        _id: lessonId,
        _type: 'lesson',
        title: lesson.title,
        resource: {
          _type: 'reference',
          _ref: videoId,
        },
      })

      sanityCourse.lessons.push({
        _key: lessonId,
        _type: 'reference',
        _ref: lessonId,
      })
    }),
  )

  return {sanityCourse, sanityLessons, sanityResources}
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

      const {course, lessons} = req.body

      const {sanityCourse, sanityLessons, sanityResources} =
        await formatSanityMutationForLessons(course, lessons)

      sanityResources.forEach((resource) => {
        transaction.create(resource)
      })

      sanityLessons.forEach((lesson) => {
        transaction.create(lesson)
      })

      transaction.create(sanityCourse)

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
