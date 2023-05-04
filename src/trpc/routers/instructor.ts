/**
 *
 * This is an example router, you can delete this file and then update `../pages/api/trpc/[trpc].tsx`
 */
import {router, baseProcedure} from '../trpc.server'
import {z} from 'zod'
import {nanoid} from 'nanoid'
import slugify from 'slugify'
import {loadSanityInstructorByEggheadId} from '../../lib/instructors'
import {loadDraftSanityCourseById} from '../../lib/courses'
import {TRPCError} from '@trpc/server'
import client from '@sanity/client'
import groq from 'groq'

const sanityClient = client({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  token: process.env.SANITY_EDITOR_TOKEN,
})

// migrate to zod
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

type SanitySoftwareLibrary = {
  _type: 'versioned-software-library'
  _key: string
  library: SanityReference
}

type SanityCourse = {
  _type: 'course'
  title: string
  description: string
  slug: SanitySlug
  sharedId: string
  productionProcessState: 'new' // there are other values this could be, but in this context, it is only 'new'
  collaborators: SanityReferenceArray
  lessons: SanityReferenceArray
  softwareLibraries: SanitySoftwareLibrary[]
  accessLevel: string
  searchIndexingState: string
}

const createSanityCourse = async (sanityCourse: SanityCourse) => {
  let transaction = sanityClient.transaction()

  transaction.create(sanityCourse)

  return transaction
    .commit()
    .then((sanityRes) => {
      console.log('Transaction', sanityRes)
      return sanityRes
    })
    .catch((err) => {
      console.log('ERROR', err)
      return err
    })
}

const updateSanityCourseMeta = async ({
  id,
  title,
  description,
}: {
  id: string
  title?: string
  description?: string
}) => {
  if (title) return await sanityClient.patch(id).set({title}).commit()
  if (description)
    return await sanityClient.patch(id).set({description}).commit()
}

export const instructorRouter = router({
  draftCourses: baseProcedure
    .input(
      z.object({
        instructorId: z.number(),
      }),
    )
    .query(async ({input, ctx}) => {
      const {instructorId} = input

      const query = groq`*[_type == 'course' && $eggheadInstructorId in collaborators[]->eggheadInstructorId][]{
        title,
        "slug": slug.current,
        description,
     }`

      let draftCourses = await sanityClient.fetch(query, {
        eggheadInstructorId: String(instructorId),
      })

      return {draftCourses}
    }),
  updateDraftCourseTitle: baseProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
      }),
    )
    .mutation(async ({input, ctx}) => {
      const {id, title} = input

      const result = await updateSanityCourseMeta({id, title})

      return {titleMutation: result}
    }),
  updateDraftCourseDescription: baseProcedure
    .input(
      z.object({
        id: z.string(),
        description: z.string(),
      }),
    )
    .mutation(async ({input, ctx}) => {
      const {id, description} = input

      const result = await updateSanityCourseMeta({id, description})

      return {descriptionMutation: result}
    }),
  draftCourseLessonList: baseProcedure
    .input(
      z.object({
        courseId: z.string(),
      }),
    )
    .query(async ({input, ctx}) => {
      const {courseId} = input

      const query = groq`*[_type == 'course' && _id == $id][0]{
        lessons[]-> {
          title,
          "type": _type,
          "thumb_url": thumbnailUrl,
          "http_url": awsFilename,
          "icon_url": softwareLibraries[0].library->image.url,
          "duration": resource->duration,
          "path": "/lessons/" + slug.current
        },
     }`

      let {lessons} = await sanityClient.fetch(query, {
        id: courseId,
      })

      let lessonsWithDefaultImage = lessons.map((lesson: any) => {
        if (!lesson.icon_url) {
          lesson.icon_url =
            'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1569292667/eggo/eggo_flair.png'
        }
        if (!lesson.duration) {
          lesson.duration = 0
        }
        return lesson
      })

      return lessons
    }),
  createLesson: baseProcedure
    .input(
      z.object({
        title: z.string().optional(),
        description: z.string().optional(),
        sanityCourseId: z.string(),
        awsFilename: z.string(),
      }),
    )
    .mutation(async ({input, ctx}) => {
      const {title, description, sanityCourseId, awsFilename} = input

      const {instructor} = await loadDraftSanityCourseById(sanityCourseId)
      const {id: instructorId} = instructor
      const lessonSlug = slugify(`${title}`.toLowerCase(), {
        remove: /[*+~.()'"!:@]/g,
      })

      console.log({instructorId})

      let lesson = {
        _id: nanoid(),
        _type: 'lesson',
        title,
        description,
        accessLevel: 'pro',
        slug: {current: lessonSlug},
        status: 'needs-review',
        awsFilename,
        collaborators: [
          {
            _key: nanoid(),
            _type: 'reference',
            _ref: instructorId,
          },
        ],
      }

      await sanityClient.create(lesson)

      return await sanityClient
        .patch(sanityCourseId)
        .append('lessons', [
          {_key: nanoid(), _ref: lesson._id, _type: 'reference'},
        ])
        .commit()
    }),
})
