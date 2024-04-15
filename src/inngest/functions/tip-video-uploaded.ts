import {inngest} from '@/inngest/inngest.server'
import {TIP_VIDEO_UPLOADED_EVENT} from '@/inngest/events/tips'
import {sanityWriteClient} from '@/utils/sanity-server'
import {getMuxOptions} from '@/lib/get-mux-options'
import {v4} from 'uuid'
import {orderDeepgramTranscript} from '@/lib/deepgram-order-transcript'
import {createMuxAsset} from '../../lib/mux'
import {postToSlack} from '@/lib/slack'

export const tipVideoUploaded = inngest.createFunction(
  {id: `tip-video-uploaded`, name: 'Tip Video Uploaded'},
  {event: TIP_VIDEO_UPLOADED_EVENT},
  async ({event, step}) => {
    let tip: any = null
    let tipVideo: any = null

    if (event.data.tipId) {
      tip = await step.run('get the tip from Sanity', async () => {
        return await sanityWriteClient.fetch(
          `*[_type == "tip" && _id == "${event.data.tipId}"][0]{
              _id,
              eggheadRailsLessonId,
              title,
              body,
              "slug": slug.current,
              'tags': softwareLibraries[] {
                ...(library-> {
                  name,
                  'label': slug.current,
                  'http_url': url,
                  'image_url': image.url
                }),
              },
              'instructor': collaborators[@->.role == 'instructor'][0]->{
                _id,
                eggheadInstructorId
              },
          }`,
        )
      })
    }

    if (event.data.videoResourceId) {
      tipVideo = await step.run('get the tip video from Sanity', async () => {
        return await sanityWriteClient.fetch(
          `*[_type == "videoResource" && _id == "${event.data.videoResourceId}"][0]`,
        )
      })
    }

    const muxAsset = await step.run('create the mux asset', async () => {
      const muxOptions = getMuxOptions({
        url: tipVideo.originalVideoUrl,
        passthrough: tipVideo.fileName,
      })
      return await createMuxAsset(muxOptions.new_asset_settings)
    })

    const updatedVideoResource = await step.run(
      'patch the video resource with muxAsset in Sanity',
      async () => {
        const playbackId = muxAsset.playback_ids.filter(
          (playbackId: any) => playbackId.policy === 'public',
        )[0]?.id
        await sanityWriteClient
          .patch(tipVideo._id)
          .set({
            muxAsset: {
              muxAssetId: muxAsset.id,
              muxPlaybackId: playbackId,
            },
            state: `processing`,
          })
          .commit()

        return await sanityWriteClient.fetch(
          `*[_type == "videoResource" && _id == "${tipVideo._id}"][0]`,
        )
      },
    )

    if (tip) {
      const eggheadInstructor = await step.run('get instructor', async () => {
        return fetch(
          `${process.env.NEXT_PUBLIC_AUTH_DOMAIN}/api/v1/instructors/${tip.instructor.eggheadInstructorId}`,
          {
            headers: {
              Authorization: `Bearer ${process.env.EGGHEAD_SUPPORT_BOT_TOKEN}`,
            },
          },
        )
          .then((res) => res.json())
          .catch((e) => {
            console.error(e)
          })
      })

      await step.run('update the tip in Sanity', async () => {
        return await sanityWriteClient
          .patch(tip._id)
          .setIfMissing({
            resources: [
              {_key: v4(), _ref: updatedVideoResource._id, _type: 'reference'},
            ],
          })
          .commit()
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
        moduleSlug: event.data.tipId,
        mediaUrl: updatedVideoResource.originalVideoUrl,
        videoResourceId: updatedVideoResource._id,
      })
    })

    return {data: event.data, updatedVideoResource, muxAsset, deepgram}
  },
)
