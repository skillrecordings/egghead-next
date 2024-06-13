import {inngest} from '@/inngest/inngest.server'
import {SANITY_WEBHOOK_LESSON_CREATED} from '@/inngest/events/sanity/webhooks/lesson/created'
import axios from 'axios'

const EGGHEAD_AUTH_DOMAIN = process.env.NEXT_PUBLIC_AUTH_DOMAIN || ''
const railsToken = process.env.EGGHEAD_ADMIN_TOKEN || ''

const createLessonObject = async (data: any) => {
  console.log({data})
  let {instructor, title, topicList} = data.body

  let eggAxios = axios.create({
    baseURL: EGGHEAD_AUTH_DOMAIN,
    headers: {
      Authorization: `Bearer ${railsToken}`,
    },
  })

  let lessonParams = {
    'lesson[instructor_id]': instructor.eggheadInstructorId,
    'lesson[title]': title,
    'lesson[topic_list]': topicList,
  }

  let body = new URLSearchParams(lessonParams)

  return eggAxios.post('/api/v1/lessons', body)
}

const uploadVideo = async ({data, lesson}: {data: any; lesson: any}) => {
  return {data, lesson}
}

const postVideoDataToSanity = async ({
  data,
  video,
}: {
  data: any
  video: any
}) => {
  return {data, video}
}

export let createLesson = inngest.createFunction(
  {id: 'create-lesson', name: 'Create Lesson'},
  {event: SANITY_WEBHOOK_LESSON_CREATED},
  async ({event, step}) => {
    let lessonObject = await step.run('create-lesson-in-rails', async () => {
      return await createLessonObject(event.data)
    })

    let videoData = await step.run('upload-video-to-lesson', async () => {
      return await uploadVideo({data: event.data, lesson: lessonObject})
    })

    let sanityVideoDocumentResponse = await step.run(
      'post-video-data-to-sanity',
      async () => {
        return postVideoDataToSanity({data: event.data, video: videoData})
      },
    )

    return {event, videoData, sanityVideoDocumentResponse}
  },
)
