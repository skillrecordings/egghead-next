import {NextRequest, NextResponse} from 'next/server'
import {headers} from 'next/headers'
import {isValidSignature, SIGNATURE_HEADER_NAME} from '@sanity/webhook'
import client from '@sanity/client'
import axios from 'axios'
import _get from 'lodash/get'
import {inngest} from '@/inngest/inngest.server'
import {SEND_SLACK_MESSAGE_EVENT} from '@/inngest/events/send-slack-message'

const secret = process.env.SANITY_WEBHOOK_CREATED_SECRET || ''
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
  const signature = headers().get(SIGNATURE_HEADER_NAME) as string
  const sanityRequestBody = await req.json()
  const isValid = isValidSignature(
    JSON.stringify(sanityRequestBody),
    signature,
    secret,
  )

  try {
    if (isValid) {
      const {_id, title, slug, instructorId, body, collaborators} =
        sanityRequestBody.data
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
          {status: 500},
        )
      }
    } else {
      return NextResponse.json(
        {error: 'Internal Server Error', success: false},
        {status: 500},
      )
    }
  } catch (e) {
    // Sentry.captureException(e)
    return NextResponse.json({success: true}, {status: 200})
  }
}
