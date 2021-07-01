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
  RemainingTimeDisplay,
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
import noop from 'utils/noop'
import useBreakpoint from 'utils/breakpoints'

export type VideoResourcePlayerProps = {
  videoResource: VideoResource
  containerRef?: MutableRefObject<any>
  actualPlayerRef?: MutableRefObject<any>
  onCanPlay?: (event: any) => void
  onPause?: () => void
  onPlay?: () => void
  onTimeUpdate?: (event: any) => void
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
  ...props
}) => {
  const {setPlayerPrefs, getPlayerPrefs} = useEggheadPlayerPrefs()
  const {hasNotes} = useNotesCues(videoResource)
  const {subtitle, playbackRate} = getPlayerPrefs()
  const {sm} = useBreakpoint()

  return (
    <div
      className={`relative z-10 h-full sm:pb-14 ${className} 
          ${hidden ? 'hidden' : 'block'} 
          ${hasNotes ? 'lg:pb-[4.5rem]' : ''}`}
    >
      <Player
        crossOrigin="anonymous"
        className="font-sans"
        volume={0.2}
        poster={videoResource.thumb_url}
        {...props}
      >
        <BigPlayButton position="center" />
        {videoResource.hls_url && (
          <HLSSource isVideoChild src={videoResource.hls_url} />
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
        {hasNotes && (
          <track
            id="notes"
            // src="/api/github-load-notes?url=https://cdn.jsdelivr.net/gh/eggheadio/eggheadio-course-notes/the-beginners-guide-to-react/notes/00-react-a-beginners-guide-to-react-introduction.md"
            src={`/api/github-load-notes?url=${videoResource.staff_notes_url}`}
            kind="metadata"
            label="notes"
          />
        )}
        <CueBar key="cue-bar" order={6.0} />
        <ProgressControl key="progress-control" order={7.0} />
        <ControlBar
          disableDefaultControls
          autoHide={false}
          className={`hidden lg:flex transform translate-y-14 ${
            hasNotes ? 'lg:translate-y-[4.5rem]' : ''
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
          <AutoplayControl
            enabled={true}
            onDark={true}
            player={actualPlayerRef}
            key="autoplay-control"
            order={9}
          />
          <PlaybackRateMenuButton
            rates={[1, 1.25, 1.5, 2]}
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
          />
        </ControlBar>
      </Player>
      {children}
    </div>
  )
}

export const useNotesCues = (videoResource: VideoResource) => {
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

  // TODO: we rely on `staff_notes_url` property to display the notes tab
  //  but notes can come from other sources as well so we will want to fix
  //  for that in the future

  const hasNotes = !isEmpty(videoResource?.staff_notes_url)
  // const hasNotes = true

  return {
    hasNotes,
    cues,
  }
}

export default VideoResourcePlayer
