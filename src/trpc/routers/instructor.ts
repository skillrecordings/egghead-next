/**
 *
 * This is an example router, you can delete this file and then update `../pages/api/trpc/[trpc].tsx`
 */
import {router, baseProcedure} from '../trpc.server'
import {z} from 'zod'
import {nanoid} from 'nanoid'
import slugify from 'slugify'
import {loadSanityInstructorByEggheadId} from '../../lib/instructors'
import {
  loadDraftSanityCourseById,
  loadSanityInstructorbyCourseId,
} from '../../lib/courses'
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

const SanityLesson = z.object({
  key: z.string(),
  id: z.string(),
  title: z.string(),
  description: z.string(),
  type: z.string(),
  icon_url: z.string(),
  duration: z.number(),
  path: z.string(),
  videoResourceId: z.string(),
})
type SanityLesson = z.infer<typeof SanityLesson>

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
    .output(z.array(SanityLesson))
    .query(async ({input, ctx}) => {
      const {courseId} = input

      const query = groq`*[_type == 'course' && _id == $id][0]{
        lessons[] {
          "key": _key,
          "id":_ref,
          "title": @->title,
          "description": @->description,
          "type": @-> _type,
          "icon_url": @-> softwareLibraries[0].library->image.url,
          "duration": @-> resource->duration,
          "path": "/lessons/" + @-> slug.current,
          "videoResourceId": @->resource->muxAsset.muxPlaybackId
        },
      }`

      let {lessons} = await sanityClient.fetch<{lessons: SanityLesson[]}>(
        query,
        {
          id: courseId,
        },
      )

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
      const {title = '', description, sanityCourseId, awsFilename} = input

      const instructor = await loadSanityInstructorbyCourseId(sanityCourseId)
      const {id: instructorId} = instructor
      const lessonSlug = slugify(`${title}`.toLowerCase(), {
        remove: /[*+~.()'"!:@]/g,
      })

      const videoResourceId = nanoid()

      const videoResource = {
        _id: videoResourceId,
        _type: 'videoResource',
        filename: `${slugify(title.toLowerCase())}-video-resource`,
        originalVideoUrl: awsFilename,
      }

      const lesson = {
        _id: nanoid(),
        _type: 'lesson',
        title,
        description,
        accessLevel: 'pro',
        slug: {current: lessonSlug},
        status: 'needs-review',
        collaborators: [
          {
            _key: nanoid(),
            _type: 'reference',
            _ref: instructorId,
          },
        ],
        resource: {
          _key: nanoid(),
          _ref: videoResourceId,
          _type: 'reference',
        },
      }

      const coursePatch = sanityClient
        .patch(sanityCourseId)
        .append('lessons', [
          {_key: nanoid(), _ref: lesson._id, _type: 'reference'},
        ])

      let transaction = sanityClient.transaction()

      transaction.create(videoResource)
      transaction.create(lesson)
      transaction.patch(coursePatch)

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
    }),
  updateLessonMetadata: baseProcedure
    .input(
      z.object({
        title: z.string().optional(),
        description: z.string().optional(),
        lessonId: z.string(),
      }),
    )
    .mutation(async ({input, ctx}) => {
      const {title, description, lessonId} = input

      const lessonPatch = sanityClient.patch(lessonId).set({title, description})

      return lessonPatch.commit()
    }),
  replaceLessonVideo: baseProcedure
    .input(
      z.object({
        lessonId: z.string(),
        originalVideoUrl: z.string(),
        title: z.string(),
      }),
    )
    .mutation(async ({input, ctx}) => {
      const {lessonId, originalVideoUrl, title} = input

      const videoResourceId = nanoid()

      const videoResource = {
        _id: videoResourceId,
        _type: 'videoResource',
        filename: `${slugify(
          title.toLowerCase(),
        )}-video-resource-${videoResourceId}`,
        originalVideoUrl,
      }

      const lessonPatch = sanityClient.patch(lessonId).set({
        resource: {
          _key: nanoid(),
          _ref: videoResourceId,
          _type: 'reference',
        },
      })

      let transaction = sanityClient.transaction()

      transaction.create(videoResource)
      transaction.patch(lessonPatch)

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
    }),
  updateLessonListOrder: baseProcedure
    .input(
      z.object({
        lessons: z.array(z.object({id: z.string(), key: z.string()})),
        courseId: z.string(),
      }),
    )
    .mutation(async ({input, ctx}) => {
      const {lessons, courseId} = input

      const coursePatch = sanityClient.patch(courseId).set({
        lessons: lessons.map((lesson) => ({
          _ref: lesson.id,
          _key: lesson.key,
          _type: 'reference',
        })),
      })

      return coursePatch.commit()
    }),
})
