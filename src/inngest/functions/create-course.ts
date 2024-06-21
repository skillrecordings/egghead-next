import {inngest} from '@/inngest/inngest.server'
import {SANITY_COURSE_DOCUMENT_CREATED} from '@/inngest/events/sanity-course-document-created'
import axios from 'axios'
import {createClient} from '@sanity/client'

const AXIOS_PARAMS = {
  baseURL: process.env.NEXT_PUBLIC_AUTH_DOMAIN || '',
  headers: {
    Authorization: `Bearer ${process.env.EGGHEAD_ADMIN_TOKEN || ''}`,
  },
}

const createEggAxios = () => {
  return axios.create(AXIOS_PARAMS)
}

let createCourseInRails = async (sanityBody: any) => {
  let {title, topicList, description} = sanityBody

  let eggAxios = createEggAxios()

  let courseParams = {
    'playlist[title]': title ?? '',
    'playlist[topic_list]': topicList.toString() ?? '',
    'playlist[description]': description ?? '',
    'playlist[published]': 'false' ?? '',
  }

  let body = new URLSearchParams(courseParams)

  return await eggAxios.post('/api/v1/playlists', body)
}

let addLessonsToCourse = async (lessonIds: number[], courseId: number) => {
  let eggAxios = createEggAxios()

  let createTracklistParams = async (lessonId: number) => {
    await eggAxios.put(
      `/api/v1/playlists/${courseId}/items/add`,
      new URLSearchParams({
        'tracklistable[tracklistable_type]': 'lesson',
        'tracklistable[tracklistable_id]': String(lessonId),
      }),
    )
  }

  for (let lessonId of lessonIds) {
    await createTracklistParams(lessonId)
  }
}

let updateOwnerToInstructor = async (
  instructorId: number,
  courseId: number,
) => {
  let eggAxios = createEggAxios()

  let params = new URLSearchParams({
    'playlist[instructor_id]': String(instructorId),
  })

  return await eggAxios.put(`/api/v1/playlists/${courseId}`, params)
}

let saveCourseDataToSanity = async (sanityCourse: any, railsCourse: any) => {
  let sanityClient = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? '',
    dataset: 'production',
    useCdn: false,
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
    token: process.env.SANITY_EDITOR_TOKEN,
  })

  return await sanityClient
    .patch(sanityCourse._id)
    .set({
      railsCourseId: railsCourse.id,
    })
    .commit()
}

export let createCourse = inngest.createFunction(
  {id: 'create-course', name: 'Create Course'},
  {event: SANITY_COURSE_DOCUMENT_CREATED},
  async ({event, step}) => {
    let sanityBody = event.data.body

    let courseObject = await step.run('create-course-in-rails', async () => {
      return await createCourseInRails(sanityBody)
    })

    await step.run('add-lessons-to-course', async () => {
      return await addLessonsToCourse(
        sanityBody.lessonIds,
        courseObject.data.id,
      )
    })

    await step.run('update-owner-to-instructor', async () => {
      return await updateOwnerToInstructor(
        sanityBody.instructor.eggheadInstructorId,
        courseObject.data.id,
      )
    })

    await step.run('add-rails-id-to-sanity', async () => {
      return await saveCourseDataToSanity(sanityBody, courseObject.data)
    })
  },
)
