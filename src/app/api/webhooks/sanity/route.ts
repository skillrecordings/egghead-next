import {NextRequest, NextResponse} from 'next/server'
import {parseBody} from 'next-sanity/webhook'
import {inngest} from '@/inngest/inngest.server'
import {SANITY_WEBHOOK_LESSON_CREATED} from '@/inngest/events/sanity/webhooks/lesson/created'
import {SANITY_COURSE_DOCUMENT_CREATED} from '@/inngest/events/sanity-course-document-created'
import {withAppApiLogging} from '@/lib/logging'

const secret = process.env.SANITY_WEBHOOK_SIGNATURE_SECRET || ''

async function _POST(req: NextRequest) {
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
export const POST = withAppApiLogging(_POST)
