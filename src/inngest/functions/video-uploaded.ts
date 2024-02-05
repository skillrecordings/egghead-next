import {inngest} from '@/inngest/inngest.server'
import {VIDEO_UPLOADED_EVENT} from '@/inngest/events/video-uploaded'
import {sanityMutation, sanityQuery} from '@/utils/sanity.fetch.only.server'
import {getMuxOptions} from '@/lib/get-mux-options'
import {v4} from 'uuid'
import {orderDeepgramTranscript} from '@/lib/deepgram-order-transcript'
import {createMuxAsset} from '../../lib/mux'

export const videoUploaded = inngest.createFunction(
  {id: `video-uploaded`, name: 'Video Uploaded'},
  {event: VIDEO_UPLOADED_EVENT},
  async ({event, step}) => {
    let sanityModule: any = null

    if (event.data.moduleSlug) {
      sanityModule = await step.run('get the module from Sanity', async () => {
        return await sanityQuery(
          `*[_type == "module" && slug.current == "${event.data.moduleSlug}"][0]`,
          false,
        )
      })
    }

    const muxAsset = await step.run('create the mux asset', async () => {
      const muxOptions = getMuxOptions({
        url: event.data.originalMediaUrl,
        passthrough: event.data.fileName,
      })
      return await createMuxAsset(muxOptions.new_asset_settings)
    })

    const videoResource = await step.run(
      'create the video resource in Sanity',
      async () => {
        const playbackId = muxAsset.playback_ids.filter(
          (playbackId: any) => playbackId.policy === 'public',
        )[0]?.id
        await sanityMutation([
          {
            createOrReplace: {
              _id: event.data.fileName,
              _type: 'videoResource',
              originalMediaUrl: event.data.originalMediaUrl,
              title: event.data.fileName,
              muxAssetId: muxAsset.id,
              muxPlaybackId: playbackId,
              state: `processing`,
            },
          },
        ])

        return await sanityQuery(
          `*[_type == "videoResource" && _id == "${event.data.fileName}"][0]`,
          false,
        )
      },
    )

    if (sanityModule) {
      await step.run('update the module in Sanity', async () => {
        return await sanityMutation([
          {
            patch: {
              id: sanityModule._id,
              setIfMissing: {resources: []},
              insert: {
                after: 'resources[-1]',
                items: [
                  {_key: v4(), _ref: videoResource._id, _type: 'reference'},
                ],
              },
            },
          },
        ])
      })
    }

    // TODO add partykit later
    // await step.run('announce video resource created', async () => {
    //   await fetch(
    //     `${process.env.NEXT_PUBLIC_PARTY_KIT_URL}/party/${process.env.NEXT_PUBLIC_PARTYKIT_ROOM_NAME}`,
    //     {
    //       method: 'POST',
    //       body: JSON.stringify({
    //         body: `Video Resource Created: ${event.data.fileName}`,
    //         requestId: event.data.fileName,
    //         name: 'videoResource.created',
    //       }),
    //     },
    //   ).catch((e) => {
    //     console.error(e)
    //   })
    // })

    const deepgram = await step.run('Order Transcript [Deepgram]', async () => {
      return await orderDeepgramTranscript({
        moduleSlug: event.data.moduleSlug,
        mediaUrl: event.data.originalMediaUrl,
        videoResourceId: event.data.fileName,
      })
    })

    return {data: event.data, videoResource, muxAsset, deepgram}
  },
)
