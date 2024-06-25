import {NextRequest, NextResponse} from 'next/server'
import {parseBody} from 'next-sanity/webhook'
import client from '@sanity/client'
import axios from 'axios'
import {inngest} from '@/inngest/inngest.server'
import {SEND_SLACK_MESSAGE_EVENT} from '@/inngest/events/send-slack-message'
import {SANITY_WEBHOOK_LESSON_CREATED} from '@/inngest/events/sanity/webhooks/lesson/created'
import {SANITY_COURSE_DOCUMENT_CREATED} from '@/inngest/events/sanity-course-document-created'

const secret = process.env.SANITY_WEBHOOK_SIGNATURE_SECRET || ''
const railsToken = process.env.EGGHEAD_ADMIN_TOKEN || ''
const EGGHEAD_AUTH_DOMAIN = process.env.NEXT_PUBLIC_AUTH_DOMAIN || ''

const sanityClient = client({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  token: process.env.SANITY_EDITOR_TOKEN,
  apiVersion: '2021-10-21',
})

const eggAxios = axios.create({
  baseURL: EGGHEAD_AUTH_DOMAIN,
  headers: {
    Authorization: `Bearer ${railsToken}`,
  },
})

export async function POST(req: NextRequest) {
  try {
    const {isValidSignature, body: parsedBody} = await parseBody<any>(
      req,
      secret,
    )

    if (!isValidSignature) {
      const message = 'Invalid signature'
      return new Response(
        JSON.stringify({message, isValidSignature, parsedBody}),
        {status: 401},
      )
    }

    if (!parsedBody?.data?._type) {
      const message = 'Bad request'
      return new Response(
        JSON.stringify({message, isValidSignature, parsedBody}),
        {status: 401},
      )
    }

    switch (parsedBody.data._type) {
      case 'course':
        try {
          await inngest.send({
            name: SANITY_COURSE_DOCUMENT_CREATED,
            data: {
              body: parsedBody.data,
            },
          })
          return NextResponse.json({success: true}, {status: 200})
        } catch (e) {
          return NextResponse.json(
            {
              error:
                'inngest - failed to send event SANITY_COURSE_DOCUMENT_CREATED',
              success: false,
            },
            {status: 500},
          )
        }
      case 'lesson':
        try {
          await inngest.send({
            name: SANITY_WEBHOOK_LESSON_CREATED,
            data: {
              body: parsedBody.data,
            },
          })
          return NextResponse.json({success: true}, {status: 200})
        } catch (e) {
          console.error(e)
          return NextResponse.json(
            {
              error: `inngest - failed to send event SANITY_WEBHOOK_LESSON_CREATED`,
              success: false,
            },
            {status: 400},
          )
        }
      case 'tip':
        const {_id, title, slug, instructorId, body, collaborators} =
          parsedBody.data
        console.info('processing Sanity webhook: Lesson created', _id)

        const instructor = collaborators[0]

        await inngest.send({
          name: SEND_SLACK_MESSAGE_EVENT,
          data: {
            messageType: 'instructor-comms',
            instructorId,
            message: `_egghead tip created_`,
            attachments: [
              {
                author_name: instructor.person.name,
                author_icon: instructor.person.image,
                mrkdwn_in: ['text'],
                title,
                title_link: `${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}/tips/${slug.current}`,
                text: body,
                color: '#f17f08',
              },
            ],
          },
        })

        // create a lesson in rails
        // patch lesson resources array with ref using the video resource id
        try {
          const body = new URLSearchParams({
            'lesson[instructor_id]': instructorId,
            'lesson[title]': title,
          })

          const lesson = await eggAxios.post('/api/v1/lessons', body)

          await sanityClient
            .patch(_id)
            .set({
              eggheadRailsLessonId: lesson.data.id,
              eggheadRailsCreatedAt: new Date().toISOString(),
            })
            .commit()

          return NextResponse.json({success: true}, {status: 200})
        } catch (e) {
          console.error(e)
          return NextResponse.json(
            {error: 'Internal Server Error', success: false},
            {status: 400},
          )
        }
      default:
        return NextResponse.json(
          {error: 'Internal Server Error - invalid documents', success: false},
          {status: 400},
        )
    }
  } catch (e) {
    // Sentry.captureException(e)
    return NextResponse.json({success: true}, {status: 200})
  }
}
