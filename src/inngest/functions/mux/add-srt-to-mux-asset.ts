import {inngest} from '@/inngest/inngest.server'
import {MUX_SRT_READY_EVENT} from '@/inngest/events/mux-add-srt-to-asset'
import {VideoResourceSchema} from '@/inngest/functions/transcript-ready'
import {sanityQuery} from '@/utils/sanity.fetch.only.server'
import {
  addSrtTrackToAsset,
  deleteAssetTrack,
  getMuxAsset,
} from '../../../lib/mux'
import {sanityWriteClient} from '@/utils/sanity-server'

const COOLDOWN = 10000

export const addSrtToMuxAsset = inngest.createFunction(
  {
    id: 'add-srt-mux-asset',
    name: 'Add SRT to Mux Asset',
  },
  {event: MUX_SRT_READY_EVENT},
  async ({event, step}) => {
    const videoResource = await step.run(
      'get the video resource from Sanity',
      async () => {
        const resourceTemp = VideoResourceSchema.safeParse(
          await sanityWriteClient.fetch(
            `*[_type == "videoResource" && _id == "${event.data.videoResourceId}"][0]`,
          ),
        )
        return resourceTemp.success ? resourceTemp.data : null
      },
    )

    if (videoResource) {
      const muxAsset = await step.run('get the mux asset', async () => {
        const assetId = videoResource?.muxAsset?.muxAssetId

        if (!assetId) throw new Error('No Mux Asset ID')

        return await getMuxAsset(assetId)
      })

      if (muxAsset.status === 'ready') {
        await step.run('delete existing srt track from mux asset', async () => {
          const trackId = muxAsset.tracks.filter(
            (track: {type: string; status: string}) => track.type === 'text',
          )[0]?.id

          return await deleteAssetTrack({assetId: muxAsset.id, trackId})
        })

        await step.run('add srt track to mux asset', async () => {
          return await addSrtTrackToAsset({
            assetId: muxAsset.id,
            videoResourceId: videoResource._id,
          })
        })

        return {muxAsset, videoResource}
      } else {
        await step.sleep('wait for 10 seconds', COOLDOWN)
        await step.sendEvent('Re-run After Cool Down', {
          name: MUX_SRT_READY_EVENT,
          data: event.data,
        })
        return 'asset not ready yet'
      }
    }
  },
)
