import {NextRequest} from 'next/server'
import {sanityQuery} from '@/utils/sanity.fetch.only.server'
import {withAppApiLogging} from '@/lib/logging'

async function _GET(
  _: NextRequest,
  context: {params: Promise<{videoResourceId: string}>},
) {
  const {videoResourceId} = await context.params
  const videoResource =
    await sanityQuery(`*[_type == "videoResource" && _id == "${videoResourceId}"][0]{
    srt
   }`)
  return new Response(videoResource.srt || '', {
    status: 200,
  })
}
export const GET = withAppApiLogging(_GET)
