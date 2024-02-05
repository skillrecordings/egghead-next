export const TIP_VIDEO_UPLOADED_EVENT = 'tip/video.uploaded'

export type NewTipVideo = {
  name: typeof TIP_VIDEO_UPLOADED_EVENT
  data: {
    tipId: string
    videoResourceId: string
  }
}
