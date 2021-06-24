import * as React from 'react'
import {GetServerSideProps} from 'next'
import {isEmpty} from 'lodash'
import {
  Player,
  BigPlayButton,
  ControlBar,
  ReplayControl,
  ClosedCaptionButton,
  PlayToggle,
  ForwardControl,
  VolumeMenuButton,
  CurrentTimeDisplay,
  TimeDivider,
  DurationDisplay,
  ProgressControl,
  RemainingTimeDisplay,
  PlaybackRateMenuButton,
  FullscreenToggle,
  PlayerProvider,
  usePlayer,
} from 'cueplayer-react'
import SimpleBar from 'simplebar-react'
import HLSSource from 'components/player/hls-source'
import classNames from 'classnames'
import {Tabs, TabList, Tab, TabPanels, TabPanel} from '@reach/tabs'
import {convertTime} from 'utils/time-utils'
import ReactMarkdown from 'react-markdown'
import CueBar from 'components/player/cue-bar'
import ControlBarDivider from 'components/player/control-bar-divider'
import CollectionLessonsList from 'components/pages/lessons/collection-lessons-list'
import {useEggheadPlayerPrefs} from 'components/EggheadPlayer/use-egghead-player'
import {Element} from 'react-scroll'
import {VideoResource} from '../types'
import {loadBasicLesson} from '../lib/lessons'
import {loadNotesFromUrl} from './api/github-load-notes'

const EggheadPlayer: React.FC<{
  videoResource: VideoResource
  notesUrl: string
}> = ({videoResource, notesUrl}) => {
  const playerContainer = React.useRef<any>()
  const {setPlayerPrefs, getPlayerPrefs} = useEggheadPlayerPrefs()
  const {player} = usePlayer()
  const {activeMetadataTracks = []} = player
  const {activeSidebarTab} = getPlayerPrefs()

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
    <div className="video-test -mx-5">
      {videoResource.hls_url && (
        <PlayerContainer
          ref={playerContainer}
          player={player}
          className="relative grid grid-cols-1 lg:grid-cols-12 font-sans text-base"
        >
          <div
            className={`relative z-10 ${
              isEmpty(cues) ? 'pb-14' : 'pb-[4.5rem]'
            } ${player.isFullscreen ? 'lg:col-span-12' : 'lg:col-span-9'}`}
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
              <track id="notes" src={notesUrl} kind="metadata" label="notes" />
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
                <ControlBarDivider
                  key="divider"
                  order={9}
                  className="flex-grow"
                />
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
              <Tabs
                index={activeSidebarTab || 0}
                onChange={(tabIndex) =>
                  setPlayerPrefs({activeSidebarTab: tabIndex})
                }
                className="max-h-[500px] shadow-sm lg:max-h-[none] lg:absolute left-0 top-0 w-full h-full flex flex-col bg-gray-100 dark:bg-gray-1000 text-gray-900 dark:text-white"
              >
                <TabList className="relative z-[1] flex-shrink-0">
                  <Tab>Lessons</Tab>
                  {!isEmpty(cues) && <Tab>Notes</Tab>}
                </TabList>
                <TabPanels className="flex-grow relative">
                  <div className="lg:absolute" css={{inset: 0}}>
                    {videoResource?.collection && (
                      <TabPanel className="bg-gray-100 dark:bg-gray-1000 w-full h-full">
                        <CollectionLessonsList
                          course={videoResource?.collection}
                          currentLessonSlug={videoResource?.slug}
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
      )}
    </div>
  )
}

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

const VideoTest: React.FC<{
  videoResource: VideoResource
  notesUrl: string
}> = ({videoResource, notesUrl}) => {
  return (
    <PlayerProvider>
      <EggheadPlayer videoResource={videoResource} notesUrl={notesUrl} />
    </PlayerProvider>
  )
}

export default VideoTest

const lessonNotes = {
  'react-a-beginners-guide-to-react-introduction':
    'https://cdn.jsdelivr.net/gh/eggheadio/eggheadio-course-notes/the-beginners-guide-to-react/notes/00-react-a-beginners-guide-to-react-introduction.md',
}

export const getServerSideProps: GetServerSideProps = async function ({
  req,
  res,
  params,
}) {
  const lesson = 'react-a-beginners-guide-to-react-introduction'
  const videoResource: VideoResource = (await loadBasicLesson(
    lesson,
  )) as VideoResource

  return {
    props: {
      videoResource,
      notesUrl: `/api/github-load-notes?url=${lessonNotes[lesson]}`,
    },
  }
}
