import {NextApiRequest, NextApiResponse} from 'next'
import {nanoid} from 'nanoid'
import {ACCESS_TOKEN_KEY} from 'utils/auth'
import {getAbilityFromToken} from 'server/ability'
import _get from 'lodash/get'
import slugify from 'slugify'
import {z} from 'zod'

import client from '@sanity/client'

type SanitySlug = {
  current: string
}

type SanityReference = {
  _type: 'reference'
  _ref: string
}

type SanityReferenceArray = Array<
  {
    _key: string
  } & SanityReference
>

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
  description?: string
  repoUrl?: string
  slug: SanitySlug
  resource: SanityReference
}

type SanitySoftwareLibrary = {
  _type: 'versioned-software-library'
  _key: string
  library: SanityReference
}

type SanityCourse = {
  _type: 'course'
  title: string
  slug: SanitySlug
  sharedId: string
  collaborators: SanityReferenceArray
  lessons: SanityReferenceArray
  softwareLibraries: SanitySoftwareLibrary[]
}

const sanityClient = client({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  token: process.env.SANITY_EDITOR_TOKEN,
})

const sanityIdForDocumentType = async (
  documentType: string,
): Promise<string> => {
  const id = await nanoid()
  return `${documentType}-${id}`
}

const courseSchema = z.object({
  title: z.string(),
  collaboratorId: z.string().optional(),
  topicIds: z.string().array(),
})
export type CourseData = z.infer<typeof courseSchema>

const lessonSchema = z.object({
  title: z.string(),
  fileMetadata: z.object({
    fileName: z.string(),
    signedUrl: z.string(),
  }),
})
type LessonData = z.infer<typeof lessonSchema>

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

  const {title, collaboratorId, topicIds} = course

  const courseSlug = slugify(title.toLowerCase(), {remove: /[*+~.()'"!:@]/g})

  let sanityCourse: SanityCourse = {
    _type: 'course',
    title,
    slug: {current: courseSlug},
    sharedId: nanoid(),
    lessons: [],
    collaborators: [],
    softwareLibraries: [],
  }

  const collaboratorKey = await nanoid()

  if (collaboratorId) {
    sanityCourse.collaborators = [
      {
        _key: collaboratorKey,
        _type: 'reference',
        _ref: collaboratorId,
      },
    ]
  }

  if (topicIds.length !== 0) {
    await Promise.all(
      topicIds.map(async (topicId) => {
        const topicKey = await nanoid()
        sanityCourse.softwareLibraries.push({
          _type: 'versioned-software-library',
          _key: topicKey,
          library: {
            _type: 'reference',
            _ref: topicId,
          },
        })
      }),
    )
  }

  // TODO: Add softwareLibrary to lessons
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
      const topics = _get(lesson, 'topics', ['egghead'])
      const lessonSlug = slugify(
        `${topics[0] || ''} ${lesson.title}`.toLowerCase(),
        {remove: /[*+~.()'"!:@]/g},
      )
      const {description = '', repoUrl = ''} = lesson

      sanityLessons.push({
        _id: lessonId,
        _type: 'lesson',
        title: lesson.title,
        description,
        repoUrl,
        slug: {current: lessonSlug},
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

      const course = courseSchema.parse(req.body.course)
      const lessons = z.array(lessonSchema).parse(req.body.lessons)

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
        .catch((err) => {
          console.log('ERROR', err)
          res.status(400).end()
        })
    }
  } else {
    res.statusCode = 404
    res.end()
  }
}

export default createSanityLessons
