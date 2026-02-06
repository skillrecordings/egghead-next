import {NextRequest, NextResponse} from 'next/server'
import {headers} from 'next/headers'
import Mux from '@mux/mux-node'
import client from '@sanity/client'
import _get from 'lodash/get'
import groq from 'groq'
import {withAppApiLogging} from '@/lib/logging'

const secret = process.env.MUX_WEBHOOK_SIGNING_SECRET || ''

const sanityClient = client({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  token: process.env.SANITY_EDITOR_TOKEN,
  apiVersion: '2021-10-21',
})

const videoResourceQuery = groq`
  *[_type == 'videoResource' && muxAsset.muxAssetId == $id][0] {
  _id
}`

async function _POST(req: NextRequest) {
  const headerStore = await headers()
  const signature = headerStore.get('mux-signature') as string
  const muxRequestBody = await req.json()
  const isValid = Mux.Webhooks.verifyHeader(
    JSON.stringify(muxRequestBody),
    signature,
    secret,
  )
  try {
    if (isValid) {
      console.info(
        'processing Mux webhook:',
        muxRequestBody.type,
        muxRequestBody.id,
      )

      if (muxRequestBody.type === 'video.asset.ready') {
        try {
          const params = {
            id: muxRequestBody.object.id,
          }

          const videoResource = await sanityClient.fetch(
            videoResourceQuery,
            params,
          )

          await sanityClient
            .patch(videoResource._id)
            .set({
              duration: muxRequestBody.data.duration,
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
          {
            error: `${muxRequestBody.type} currently not handled`,
            success: false,
          },
          {status: 422},
        )
      }
    }
    return NextResponse.json({error: 'Invalid signature'}, {status: 401})
  } catch (e) {
    // Sentry.captureException(e)
    return NextResponse.json({success: true}, {status: 200})
  }
}
export const POST = withAppApiLogging(_POST)
