import * as React from 'react'
import classNames from 'classnames'
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
import {Tab, TabList, TabPanel, TabPanels, Tabs} from '@reach/tabs'
import CollectionLessonsList from 'components/pages/lessons/collection-lessons-list'
import {useEggheadPlayerPrefs} from 'components/EggheadPlayer/use-egghead-player'
import SimpleBar from 'simplebar-react'
import {Element} from 'react-scroll'
import ReactMarkdown from 'react-markdown'
import {convertTime} from 'utils/time-utils'
import {VideoResource} from 'types'

const VideoResourcePlayer: React.FC<{videoResource: VideoResource}> = ({
  videoResource,
}) => {
  const playerContainer = React.useRef<any>()
  const {setPlayerPrefs, getPlayerPrefs} = useEggheadPlayerPrefs()
  const {activeSidebarTab} = getPlayerPrefs()
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

  return (
    <PlayerContainer
      ref={playerContainer}
      player={player}
      className="relative grid grid-cols-1 lg:grid-cols-12 font-sans text-base"
    >
      <div
        className={`relative z-10 ${isEmpty(cues) ? 'pb-14' : 'pb-[4.5rem]'} ${
          player.isFullscreen ? 'lg:col-span-12' : 'lg:col-span-9'
        }`}
      >
        <Player
          muted
          autoplay
          crossOrigin="anonymous"
          className="font-sans"
          poster={videoResource.thumb_url}
        >
          <BigPlayButton position="center" />
          <HLSSource isVideoChild src={videoResource.hls_url} />
          <track
            src={videoResource.subtitles_url}
            kind="subtitles"
            srcLang="en"
            label="English"
            default
          />
          {!isEmpty(videoResource?.staff_notes_url) && (
            <track
              id="notes"
              src={`/api/github-load-notes?url=${videoResource.staff_notes_url}`}
              kind="metadata"
              label="notes"
            />
          )}

          <CueBar key="cue-bar" order={6.0} />
          <ControlBar
            disableDefaultControls
            autoHide={false}
            className={`transform ${
              isEmpty(cues) ? 'translate-y-14' : 'translate-y-[4.5rem]'
            }`}
          >
            <PlayToggle key="play-toggle" order={1} />
            <ReplayControl key="replay-control" order={2} />
            <ForwardControl key="forward-control" order={3} />
            <VolumeMenuButton key="volume-menu-button" order={4} />
            <CurrentTimeDisplay key="current-time-display" order={5} />
            <TimeDivider key="time-divider" order={6} />
            <DurationDisplay key="duration-display" order={7} />
            <ControlBarDivider key="divider" order={9} className="flex-grow" />
            <RemainingTimeDisplay key="remaining-time-display" order={10} />
            <PlaybackRateMenuButton
              rates={[1, 1.25, 1.5, 2]}
              key="playback-rate"
              order={11}
            />
            <ClosedCaptionButton order={12}>1123</ClosedCaptionButton>
            <FullscreenToggle
              key="fullscreen-toggle"
              fullscreenElement={playerContainer.current}
              order={13}
            />
          </ControlBar>
          <ProgressControl key="progress-control" order={8} />
        </Player>
      </div>
      <div className="lg:col-span-3 side-bar">
        <div className="relative h-full">
          {/* TODO: remove weird logic that assumes 2 tabs */}
          <Tabs
            index={(!isEmpty(cues) && activeSidebarTab) || 0}
            onChange={(tabIndex) =>
              setPlayerPrefs({activeSidebarTab: tabIndex})
            }
            className="max-h-[500px] shadow-sm lg:max-h-[none] lg:absolute left-0 top-0 w-full h-full flex flex-col bg-gray-100 dark:bg-gray-1000 text-gray-900 dark:text-white"
          >
            <TabList className="relative z-[1] flex-shrink-0">
              {!isEmpty(videoResource.collection) && <Tab>Lessons</Tab>}
              {!isEmpty(cues) && <Tab>Notes</Tab>}
            </TabList>
            <TabPanels className="flex-grow relative">
              <div className="lg:absolute" css={{inset: 0}}>
                {!isEmpty(videoResource.collection) && (
                  <TabPanel className="bg-gray-100 dark:bg-gray-1000 w-full h-full">
                    <CollectionLessonsList
                      course={videoResource.collection}
                      currentLessonSlug={videoResource.slug}
                      progress={[]}
                    />
                  </TabPanel>
                )}
                {!isEmpty(cues) && (
                  <TabPanel className="bg-gray-100 dark:bg-gray-1000 w-full h-full">
                    <NotesTabContent cues={cues} />
                  </TabPanel>
                )}
              </div>
            </TabPanels>
          </Tabs>
        </div>
      </div>
    </PlayerContainer>
  )
}

const PlayerContainer: React.ForwardRefExoticComponent<any> = React.forwardRef<
  HTMLDivElement,
  any
>((props, ref) => {
  const {player, className, children, ...rest} = props
  const {paused, hasStarted, waiting, seeking, isFullscreen, userActivity} =
    player

  return (
    <div
      {...rest}
      ref={ref}
      className={classNames(
        {
          'cueplayer-react-has-started': hasStarted,
          'cueplayer-react-paused': paused,
          'cueplayer-react-playing': !paused,
          'cueplayer-react-waiting': waiting,
          'cueplayer-react-seeking': seeking,
          'cueplayer-react-fullscreen': isFullscreen,
          'cueplayer-react-user-inactive': !userActivity,
          'cueplayer-react-user-active': userActivity,
        },
        'cueplayer-react',
        className,
      )}
    >
      {children}
    </div>
  )
})

const NotesTabContent: React.FC<{cues: VTTCue[]}> = ({cues}) => {
  const {player, manager} = usePlayer()
  const actions = manager.getActions()
  const disabled: boolean = isEmpty(cues)
  const scrollableNodeRef: any = React.createRef()

  return disabled ? null : (
    <SimpleBar
      forceVisible="y"
      autoHide={false}
      scrollableNodeProps={{
        ref: scrollableNodeRef,
        id: 'notes-tab-scroll-container',
      }}
      className="h-full overscroll-contain p-4"
    >
      <div className="space-y-3">
        {cues.map((cue: VTTCue) => {
          const note = cue.text
          const active = player.activeMetadataTrackCues.includes(cue)
          return (
            <div key={cue.startTime}>
              {active && <Element name="active-note" />}
              <div
                className={classNames(
                  'text-sm p-4 bg-white dark:bg-gray-900 rounded-md shadow-sm border-2 border-transparent',
                  {
                    'border-indigo-500': active,
                    '': !active,
                  },
                )}
              >
                {note && (
                  <ReactMarkdown className="leading-normal prose-sm prose dark:prose-dark">
                    {note}
                  </ReactMarkdown>
                )}
                {cue.startTime && (
                  <div
                    onClick={() => {
                      actions.seek(cue.startTime)
                    }}
                    className="w-full cursor-pointer underline flex items-baseline justify-end pt-3 text-gray-900 dark:text-white"
                  >
                    <time className="text-xs opacity-60 font-medium">
                      {convertTime(cue.startTime)}
                    </time>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </SimpleBar>
  )
}

export default VideoResourcePlayer
