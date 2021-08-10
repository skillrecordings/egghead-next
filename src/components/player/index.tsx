import * as React from 'react'
import {isEmpty} from 'lodash'
import {
  Player,
  BigPlayButton,
  ClosedCaptionButton,
  ControlBar,
  CurrentTimeDisplay,
  DurationDisplay,
  ForwardControl,
  FullscreenToggle,
  PlaybackRateMenuButton,
  PlayToggle,
  ProgressControl,
  ReplayControl,
  TimeDivider,
  usePlayer,
  VolumeMenuButton,
} from 'cueplayer-react'
import HLSSource from './hls-source'
import CueBar from './cue-bar'
import ControlBarDivider from './control-bar-divider'
import DownloadControl from './download-control'
import AutoplayControl from './autoplay-control'
import {
  defaultSubtitlePreference,
  useEggheadPlayerPrefs,
} from 'components/EggheadPlayer/use-egghead-player'
import {VideoResource} from 'types'
import {MutableRefObject, SyntheticEvent} from 'react'

export type VideoResourcePlayerProps = {
  videoResource: VideoResource
  containerRef?: MutableRefObject<any>
  actualPlayerRef?: MutableRefObject<any>
  onCanPlay?: (event: any) => void
  onLoadStart?: (event: any) => void
  onPause?: () => void
  onPlay?: () => void
  onTimeUpdate?: (event: any) => void
  onFullscreenChange?: (isFullscreen: boolean) => void
  onEnded?: () => void
  onVolumeChange?: (event: any) => void
  hidden?: boolean
  className?: string
  volume?: number
}

const VideoResourcePlayer: React.FC<VideoResourcePlayerProps> = ({
  videoResource,
  containerRef,
  actualPlayerRef,
  hidden = false,
  className = '',
  children,
  onFullscreenChange,
  onLoadStart,
  ...props
}) => {
  const {setPlayerPrefs, getPlayerPrefs} = useEggheadPlayerPrefs()

  const {subtitle, playbackRate, volumeRate} = getPlayerPrefs()

  return (
    <div
      className={`relative z-10 h-full ${className} 
          ${hidden ? 'hidden' : 'block'} 
          ${hasNotes(videoResource) ? 'pb-[5rem]' : 'pb-14'}`}
    >
      <Player
        crossOrigin="anonymous"
        className="font-sans"
        volume={0.2}
        poster={videoResource.thumb_url}
        onLoadStart={(event: any) => {
          const videoElement: HTMLVideoElement =
            event.target as HTMLVideoElement
          videoElement.volume = volumeRate / 100
          videoElement.playbackRate = playbackRate
          if (onLoadStart) {
            onLoadStart(event)
          }
        }}
        onVolumeChange={(event: SyntheticEvent) => {
          const player: HTMLVideoElement = event.target as HTMLVideoElement
          setPlayerPrefs({volumeRate: player.volume * 100})
        }}
        {...props}
      >
        <BigPlayButton position="center" />
        {videoResource.hls_url && (
          <HLSSource
            key={videoResource.hls_url}
            isVideoChild
            src={videoResource.hls_url}
          />
        )}
        {videoResource.subtitles_url && (
          <track
            key={videoResource.subtitles_url}
            src={videoResource.subtitles_url}
            kind="subtitles"
            srcLang="en"
            label="English"
            default={subtitle?.language === 'en'}
          />
        )}
        {hasNotes(videoResource) && (
          <track
            key={videoResource.slug}
            id="notes"
            src={`/api/github-load-notes?url=${videoResource.staff_notes_url}`}
            kind="metadata"
            label="notes"
          />
        )}
        {hasNotes(videoResource) && (
          <CueBar key={videoResource.slug} order={6.0} />
        )}
        <ProgressControl key="progress-control" order={7.0} />
        <ControlBar
          disableDefaultControls
          autoHide={false}
          className={`flex ${
            hasNotes(videoResource) ? 'translate-y-[5rem]' : 'translate-y-14'
          }`}
          order={8.0}
        >
          <PlayToggle key="play-toggle" order={1} />
          <ReplayControl key="replay-control" order={2} />
          <ForwardControl key="forward-control" order={3} />
          <VolumeMenuButton key="volume-menu-button" order={4} />
          <CurrentTimeDisplay key="current-time-display" order={5} />
          <TimeDivider key="time-divider" order={6} />
          <DurationDisplay key="duration-display" order={7} />
          <ControlBarDivider key="divider" order={8} className="flex-grow" />
          {/*<AutoplayControl*/}
          {/*  enabled={true}*/}
          {/*  onDark={true}*/}
          {/*  player={actualPlayerRef}*/}
          {/*  key="autoplay-control"*/}
          {/*  order={9}*/}
          {/*/>*/}
          <PlaybackRateMenuButton
            rates={[2, 1.75, 1.5, 1.25, 1, 0.85, 0.75]}
            key="playback-rate"
            order={10}
            selected={playbackRate}
            onChange={(playbackRate: number) => {
              setPlayerPrefs({playbackRate})
            }}
          />
          <DownloadControl
            key="download-control"
            order={11}
            lesson={videoResource}
          />
          {videoResource.subtitles_url && (
            <ClosedCaptionButton
              key={videoResource.subtitles_url}
              order={12}
              selected={subtitle}
              onChange={(track?: TextTrack) => {
                const updatedSubtitlePref = track
                  ? {
                      id: track.id,
                      kind: track.kind,
                      label: track.label,
                      language: track.language,
                    }
                  : defaultSubtitlePreference

                setPlayerPrefs({
                  subtitle: updatedSubtitlePref,
                })
              }}
            >
              1123
            </ClosedCaptionButton>
          )}
          <FullscreenToggle
            key="fullscreen-toggle"
            fullscreenElement={containerRef?.current}
            order={13}
            onFullscreenChange={onFullscreenChange}
          />
        </ControlBar>
      </Player>
      {children}
    </div>
  )
}

export const hasNotes = (resource: VideoResource) => {
  return (
    process.env.NEXT_PUBLIC_NOTES_ENABLED === 'true' &&
    !isEmpty(resource.staff_notes_url)
  )
}

export const useNotesCues = () => {
  const {player} = usePlayer()
  const {activeMetadataTracks = []} = player

  const noteTracks = activeMetadataTracks.filter((track: TextTrack) => {
    return track.label === 'notes'
  })

  const cues: VTTCue[] = noteTracks.reduce(
    (acc: VTTCue[], track: TextTrack) => {
      return [...acc, ...Array.from(track.cues || [])]
    },
    [],
  )

  return {
    cues,
  }
}

export default VideoResourcePlayer
