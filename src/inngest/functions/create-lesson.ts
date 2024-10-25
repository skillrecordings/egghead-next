import {inngest} from '@/inngest/inngest.server'
import {SANITY_WEBHOOK_LESSON_CREATED} from '@/inngest/events/sanity/webhooks/lesson/created'
import {VERIFIED_TRANSLOADIT_NOTIFICATION_EVENT} from '@/inngest/events/verified-transloadit-notification'
import axios from 'axios'
import AWS from 'aws-sdk'
import {v4 as uuidv4} from 'uuid'
import {createClient} from '@sanity/client'
import {orderDeepgramTranscript} from '@/lib/deepgram-order-transcript'

const EGGHEAD_AUTH_DOMAIN = process.env.NEXT_PUBLIC_AUTH_DOMAIN || ''
const railsToken = process.env.EGGHEAD_ADMIN_TOKEN || ''

let createSanityClient = () => {
  return createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? '',
    dataset: 'production',
    useCdn: false,
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
    token: process.env.SANITY_EDITOR_TOKEN,
  })
}

let createLessonObject = async (data: any) => {
  let {instructor, title, topicList, description} = data.body

  let eggAxios = axios.create({
    baseURL: EGGHEAD_AUTH_DOMAIN,
    headers: {
      Authorization: `Bearer ${railsToken}`,
    },
  })

  let lessonParams = {
    'lesson[instructor_id]': instructor.eggheadInstructorId ?? '',
    'lesson[title]': title ?? '',
    'lesson[topic_list]': topicList.toString() ?? '',
    'lesson[summary]': description ?? '',
  }

  let body = new URLSearchParams(lessonParams)

  let lessonObject = await eggAxios.post('/api/v1/lessons', body)
  return lessonObject.data
}

let putRailsIdToSanityLesson = async (lessonId: number, documentId: string) => {
  let sanityClient = createSanityClient()

  return await sanityClient
    .patch(documentId)
    .set({
      railsLessonId: lessonId,
    })
    .commit()
}

let uploadVideoToS3 = async ({data, videoUrl}: {data: any; videoUrl: any}) => {
  const AwsConfigOptions = {
    bucket: process.env.AWS_VIDEO_UPLOAD_BUCKET ?? '',
    region: process.env.AWS_VIDEO_UPLOAD_REGION ?? '',
    signatureVersion: 'v4',
    ACL: 'public-read',
  }

  AWS.config.credentials = {
    accessKeyId: process.env.AWS_VIDEO_UPLOAD_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_VIDEO_UPLOAD_SECRET_ACCESS_KEY || '',
  }

  let s3 = new AWS.S3(AwsConfigOptions)

  const FILE_NAME = `${uuidv4()}/${
    data.body.videoResource.videoFile.originalFilename
  }`

  let video = await fetch(`${videoUrl}?dl=`)

  let arrayBuffer = await video.arrayBuffer()
  let buffer = Buffer.from(arrayBuffer)

  try {
    await s3
      .upload({
        Bucket: AwsConfigOptions.bucket,
        Key: `production/${FILE_NAME}`,
        Body: buffer ?? '',
      })
      .promise()
    return await s3.getSignedUrlPromise('getObject', {
      Bucket: AwsConfigOptions.bucket,
      Key: `production/${FILE_NAME}`,
    })
  } catch (e) {
    console.error(e)
  }
}

let postSignedUrlToLesson = async ({
  lesson,
  signedUrl,
}: {
  lesson: any
  signedUrl: any
}) => {
  let titleUrl = `${lesson.slug}-${uuidv4()}`.replace(/[^\w\d_\-.]+/gi, '')

  return await fetch(lesson.process_lesson_video_url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${railsToken}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      fileUrl: signedUrl,
      'lesson[title_url]': titleUrl,
    }),
  })
}

let postVideoDataToSanity = async ({data, video}: {data: any; video: any}) => {
  const ABR_CLOUDFRONT_ID = process.env.ABR_CLOUDFRONT_ID ?? ''

  let sanityClient = createSanityClient()

  let transloadit = JSON.parse(video.transloadit)
  let titleSlug = transloadit.fields.title_url

  return await sanityClient
    .patch(data.body.videoResource._id)
    .set({
      mediaUrls: {
        dashUrl: transloadit.results?.dash_adaptive
          ? `https://${ABR_CLOUDFRONT_ID}.cloudfront.net/${titleSlug}/dash/${titleSlug}.mpd`
          : '',
        hlsUrl: transloadit.results?.dash_adaptive
          ? `https://${ABR_CLOUDFRONT_ID}.cloudfront.net/${titleSlug}/hls/${titleSlug}.m3u8`
          : '',
      },
    })
    .commit()
}

export let createLesson = inngest.createFunction(
  {id: 'create-lesson', name: 'Create Lesson'},
  {event: SANITY_WEBHOOK_LESSON_CREATED},
  async ({event, step}) => {
    let lessonObject = await step.run('create-lesson-in-rails', async () => {
      return await createLessonObject(event.data)
    })

    await step.run(
      'add-rails-lesson-id-to-sanity-lesson-document',
      async () => {
        return await putRailsIdToSanityLesson(
          lessonObject.id,
          event.data.body._id,
        )
      },
    )

    let signedUrl = await step.run('upload-video-to-s3', async () => {
      return await uploadVideoToS3({
        data: event.data,
        videoUrl: event.data.body.videoResource.videoFile.url,
      })
    })

    const {deepgram} = await step.run(
      'Order Transcript [Deepgram]',
      async () => {
        return await orderDeepgramTranscript({
          moduleSlug: event.data.body._id,
          mediaUrl: event.data.body.videoResource.videoFile.url,
          videoResourceId: event.data.body.videoResource._id,
          eggheadLessonId: lessonObject.id,
        })
      },
    )

    await step.run('post-signed-url-to-lesson', async () => {
      return await postSignedUrlToLesson({lesson: lessonObject, signedUrl})
    })

    let videoData = await step.waitForEvent(
      'wait-for-verified-transloadit-notification-event',
      {
        event: VERIFIED_TRANSLOADIT_NOTIFICATION_EVENT,
        timeout: '10m',
      },
    )

    let sanityVideoDocumentResponse = await step.run(
      'post-video-data-to-sanity',
      async () => {
        if (videoData) {
          return postVideoDataToSanity({
            data: event.data,
            video: videoData.data,
          })
        }
      },
    )

    return {sanityVideoDocumentResponse}
  },
)
