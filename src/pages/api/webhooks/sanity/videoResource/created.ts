import {NextApiRequest, NextApiResponse} from 'next'
import {isValidSignature, SIGNATURE_HEADER_NAME} from '@sanity/webhook'
import Mux from '@mux/mux-node'
import client from '@sanity/client'

const sanityClient = client({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  token: process.env.SANITY_EDITOR_TOKEN,
})

const secret = process.env.SANITY_WEBHOOK_CREATED_SECRET || ''

interface MuxAsset {
  muxAssetId: string
  muxPlaybackId?: string
}

async function createMuxAsset({
  originalVideoUrl,
  muxAsset,
}: {
  originalVideoUrl: string
  muxAsset: MuxAsset
}) {
  if (!muxAsset?.muxAssetId) {
    const {Video} = new Mux(
      process.env.MUX_TOKEN_ID || '',
      process.env.MUX_SECRET_KEY || '',
    )
    const newMuxAsset = await Video.Assets.create({
      input: originalVideoUrl,
      playback_policy: ['public'],
    })
    return {
      muxAssetId: newMuxAsset.id,
      muxPlaybackId: newMuxAsset.playback_ids?.find((playback_id) => {
        return playback_id.policy === 'public'
      })?.id,
    }
  }

  return {...muxAsset}
}

const patchVideoResource = async (
  id: string,
  newMuxAsset: MuxAsset,
  duration?: number,
) => {
  const {muxPlaybackId, muxAssetId} = newMuxAsset

  return await sanityClient
    .patch(id)
    .set({
      muxAsset: {
        _type: 'muxAsset',
        muxPlaybackId: muxPlaybackId,
        muxAssetId: muxAssetId,
      },
      duration,
    })
    .commit()
    .then((sanityRes) => {
      console.log(`mux asset patched to ${id}`, sanityRes)
      return sanityRes
    })
    .catch((err) => {
      console.log(`ERROR when patching mux asset to ${id}`, err)
      return err
    })
}

// const patchLessonWithVideoResource = async (lessonId, videoResourceId) => {}

/**
 * link to webhook {@link} https://www.sanity.io/organizations/om9qNpcXE/project/z9io1e0u/api/webhooks/xV5ZY6656qclI76i
 *
 * @param req
 * @param res
 */
const sanityLessonCreatedWebhook = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const signature = req.headers[SIGNATURE_HEADER_NAME] as string
  const isValid = isValidSignature(JSON.stringify(req.body), signature, secret)

  try {
    if (isValid) {
      const {_id, originalVideoUrl, muxAsset, duration} = req.body
      console.info('processing Sanity webhook: Lesson created', _id)

      const {...newMuxAsset} = await createMuxAsset({
        originalVideoUrl,
        muxAsset,
      })

      // create a video resource
      // patch lesson resources array with ref using the video resource id
      try {
        const resource = await patchVideoResource(_id, newMuxAsset)
        // await patchLessonWithVideoResource(_id, resource._id)
      } catch (e) {
        console.error(e)
        res.status(500).json({success: false})
      }

      res.status(200).json({success: true})
    } else {
      res.status(500).json({success: false})
    }
  } catch (e) {
    // Sentry.captureException(e)
    res.status(200).json({success: true})
  }
}

export default sanityLessonCreatedWebhook

export const config = {
  api: {
    externalResolver: true,
  },
}
