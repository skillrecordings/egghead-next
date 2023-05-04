import {NextApiRequest, NextApiResponse} from 'next'
import {isValidSignature, SIGNATURE_HEADER_NAME} from '@sanity/webhook'
import Mux from '@mux/mux-node'
import client from '@sanity/client'
import {nanoid} from 'nanoid'

const sanityClient = client({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  token: process.env.SANITY_EDITOR_TOKEN,
})

const secret = process.env.SANITY_WEBHOOK_SECRET || ''

async function createMuxAsset({
  awsFilename,
  muxAsset,
  duration,
}: {
  awsFilename: string
  muxAsset: {muxAssetId: string; muxPlaybackId: string}
  duration: number
}) {
  if (!muxAsset?.muxAssetId) {
    const {Video} = new Mux()
    const newMuxAsset = await Video.Assets.create({
      input: awsFilename,
      playback_policy: ['public'],
    })

    return {
      duration: newMuxAsset.duration,
      muxAssetId: newMuxAsset.id,
      muxPlaybackId: newMuxAsset.playback_ids?.find((playback_id) => {
        return playback_id.policy === 'public'
      })?.id,
    }
  }

  return {...muxAsset, duration}
}

const createVideoResource = async (newMuxAsset, duration) => {
  sanityClient.create({
    _id: nanoid(),
    _type: 'videoResource',
    _updatedAt: '2022-09-06T16:06:49Z',
    duration: 123,
    filename: 'big_buck_bunny_720p_2mb copy.mp4',
    hlsUrl:
      'https://egghead-video-uploads.s3.amazonaws.com/development/6e976e36-c18d-46d0-ade9-eb13d023b6cf/big_buck_bunny_720p_2mbcopy-z9byoghqa.mp4',
    originalVideoUrl:
      'https://egghead-video-uploads.s3.amazonaws.com/development/6e976e36-c18d-46d0-ade9-eb13d023b6cf/big_buck_bunny_720p_2mbcopy-z9byoghqa.mp4',
  })
}

const patchLessonWithVideoResource = async (lessonId, videoResourceId) => {}

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
      const {_id, awsFilename, muxAsset, duration} = req.body
      console.info('processing Sanity webhook: Lesson created', _id)

      const {duration: assetDuration, ...newMuxAsset} = await createMuxAsset({
        awsFilename,
        muxAsset,
        duration,
      })

      // create a video resource
      // patch lesson resources array with ref using the video resource id
      try {
        const resource = await createVideoResource(newMuxAsset, duration)
        await patchLessonWithVideoResource(_id, resource._id)
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
