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
  CueBar,
  usePlayer,
} from 'cueplayer-react'
import HLSSource from '../components/player/hls-source'
import classNames from 'classnames'
import {Tabs, TabList, Tab, TabPanels, TabPanel} from '@reach/tabs'
import {convertTime} from 'utils/time-utils'
import ReactMarkdown from 'react-markdown'

type VideoResource = {hls_url: string; subtitlesUrl: string; poster: string}

const EggheadPlayer: React.FC<{videoResource: VideoResource}> = ({
  videoResource,
}) => {
  const playerContainer = React.useRef<any>()
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
    <div className="-mx-5 -mt-5">
      {videoResource.hls_url && (
        <div
          ref={playerContainer}
          className="relative grid grid-cols-1 lg:grid-cols-12 "
        >
          <div className="relative z-10 lg:col-span-9">
            <Player
              muted
              autoplay
              crossOrigin="anonymous"
              className="font-sans"
              poster={videoResource.poster}
            >
              <BigPlayButton position="center" />
              <HLSSource isVideoChild src={videoResource.hls_url} />
              <track
                src={videoResource.subtitlesUrl}
                kind="subtitles"
                srcLang="en"
                label="English"
                default
              />
              <track
                id="notes"
                src="https://gist.githubusercontent.com/joelhooks/bd3c1d68cb5a67adfcd6c035200d1fde/raw/aa7060f584e04db26c5fa6b464bf2058ed6f6e93/notes.vtt"
                kind="metadata"
                label="notes"
              />
              <CueBar order={6.0} />
              <ControlBar disableDefaultControls>
                <PlayToggle key="play-toggle" order={1} />
                <ReplayControl key="replay-control" order={2} />
                <ForwardControl key="forward-control" order={3} />
                <VolumeMenuButton key="volume-menu-button" order={4} />
                <CurrentTimeDisplay key="current-time-display" order={5} />
                <TimeDivider key="time-divider" order={6} />
                <DurationDisplay key="duration-display" order={7} />
                <ProgressControl key="progress-control" order={8} />
                <RemainingTimeDisplay key="remaining-time-display" order={9} />
                <PlaybackRateMenuButton
                  rates={[1, 1.25, 1.5, 2]}
                  key="playback-rate"
                  order={10}
                />
                <ClosedCaptionButton order={11} />
                <FullscreenToggle
                  key="fullscreen-toggle"
                  fullscreenElement={playerContainer.current}
                  order={12}
                />
              </ControlBar>
            </Player>
          </div>
          <div className="lg:col-span-3">
            <div className="relative h-full sidepanel">
              <Tabs className="max-h-[500px] lg:max-h-[none] lg:absolute left-0 top-0 w-full h-full flex flex-col">
                <TabList className="relative z-[1] flex-shrink-0">
                  {!isEmpty(cues) && <Tab>Notes</Tab>}
                  <Tab>Lessons</Tab>
                </TabList>
                <TabPanels className="flex-grow overflow-y-scroll">
                  <div>
                    {!isEmpty(cues) && (
                      <TabPanel className="p-4 bg-gray-100 dark:bg-gray-1000">
                        <NotesTabContent cues={cues} />
                      </TabPanel>
                    )}
                    <TabPanel className="p-4 bg-gray-100 dark:bg-gray-1000">
                      <div className="p-4">This will be a list of lessons.</div>
                    </TabPanel>
                  </div>
                </TabPanels>
              </Tabs>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const NotesTabContent: React.FC<{cues: VTTCue[]}> = ({cues}) => {
  const {player} = usePlayer()
  const disabled: boolean = isEmpty(cues)

  return disabled ? null : (
    <div>
      {cues.map((cue: any) => {
        const note = JSON.parse(cue.text)
        const active = cue === player.activeMetadataTrackCue
        return (
          <div
            key={note.title}
            className={classNames(
              'text-sm p-4 bg-white dark:bg-gray-900 rounded-md mb-3 shadow-sm border-2 border-transparent',
              {
                'border-indigo-500': active,
                '': !active,
              },
            )}
          >
            {note.title && (
              <div className="text-base font-semibold text-black dark:text-white pb-3">
                {note.title}
              </div>
            )}
            {note.description && (
              <ReactMarkdown className="leading-normal prose-sm prose dark:prose-dark">
                {note.description}
              </ReactMarkdown>
            )}
            {cue.startTime && (
              <div className="w-full flex items-baseline justify-end pt-3">
                <time className="text-xs opacity-60 font-medium">
                  {convertTime(cue.startTime)}
                </time>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

const VideoTest: React.FC<{videoResource: VideoResource}> = ({
  videoResource,
}) => {
  return (
    <PlayerProvider>
      <EggheadPlayer videoResource={videoResource} />
    </PlayerProvider>
  )
}

export default VideoTest

export const getServerSideProps: GetServerSideProps = async function ({query}) {
  const videoResource = {
    id: 'video',
    name: 'get started with react',
    title: 'Create a User Interface with Vanilla JavaScript and DOM',
    poster:
      'https://dcv19h61vib2d.cloudfront.net/thumbs/react-v2-01-create-a-user-interface-with-vanilla-javascript-and-dom-rJShvuIrI/react-v2-01-create-a-user-interface-with-vanilla-javascript-and-dom-rJShvuIrI.jpg',
    hls_url:
      'https://d2c5owlt6rorc3.cloudfront.net/react-v2-01-create-a-user-interface-with-vanilla-javascript-and-dom-rJShvuIrI/hls/react-v2-01-create-a-user-interface-with-vanilla-javascript-and-dom-rJShvuIrI.m3u8',
    subtitlesUrl:
      'https://app.egghead.io/api/v1/lessons/react-create-a-user-interface-with-vanilla-javascript-and-dom/subtitles',
  }

  return {
    props: {
      videoResource,
    },
  }
}
