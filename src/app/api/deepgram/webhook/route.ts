import {NextRequest, NextResponse} from 'next/server'
import {inngest} from '@/inngest/inngest.server'
import {
  srtFromTranscriptResult,
  transcriptAsParagraphsWithTimestamps,
} from '@/lib/deepgram-results-processor'
import {TRANSCRIPT_READY_EVENT} from '@/inngest/events/transcript-requested'

export async function POST(req: NextRequest, res: NextResponse) {
  // todo: check MUX_WEBHOOK_SIGNING_SECRET to verify the request

  const url = new URL(req.url)
  const videoResourceId = url.searchParams.get('videoResourceId')
  const moduleSlug = url.searchParams.get('moduleSlug')
  const eggheadLessonId = url.searchParams.get('eggheadLessonId')
  const {results}: {results: any} = await req.json()

  if (!results) {
    return new Response(`Bad request`, {status: 400})
  }

  const srt = srtFromTranscriptResult(results)
  const transcript = transcriptAsParagraphsWithTimestamps(results)

  await inngest.send({
    name: TRANSCRIPT_READY_EVENT,
    data: {
      videoResourceId,
      moduleSlug,
      srt,
      transcript,
      eggheadLessonId,
    },
  })

  return new Response('ok', {
    status: 200,
  })
}
