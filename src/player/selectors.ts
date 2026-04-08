import {VideoState} from './context'

export const selectWithSidePanel = (state: VideoState) => state.withSidePanel
export const selectMetadataTracks = (state: VideoState) => state.metadataTracks
export const selectIsPaused = (state: VideoState) => state.isPaused
export const selectVideo = (state: VideoState) => state.video
export const selectIsWaiting = (state: VideoState) => state.isWaiting
export const selectHasEnded = (state: VideoState) => state.hasEnded
export const selectIsFullscreen = (state: VideoState) => state.isFullscreen
export const selectViewer = (state: VideoState) => state.viewer
