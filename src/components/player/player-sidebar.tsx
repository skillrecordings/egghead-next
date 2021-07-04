import * as React from 'react'
import {useEggheadPlayerPrefs} from '../EggheadPlayer/use-egghead-player'
import {Tab, TabList, TabPanel, TabPanels, Tabs} from '@reach/tabs'
import {isEmpty} from 'lodash'
import CollectionLessonsList from 'components/pages/lessons/collection-lessons-list'
import {useNotesCues} from './index'
import {VideoResource} from 'types'
import {usePlayer} from 'cueplayer-react'
import SimpleBar from 'simplebar-react'
import {Element} from 'react-scroll'
import classNames from 'classnames'
import ReactMarkdown from 'react-markdown'
import {convertTime} from 'utils/time-utils'
import {track} from '../../utils/analytics'

const PlayerSidebar: React.FC<{
  videoResource: VideoResource
  lessonView?: any
}> = ({videoResource, lessonView}) => {
  const {hasNotes} = useNotesCues(videoResource)
  const {setPlayerPrefs, getPlayerPrefs} = useEggheadPlayerPrefs()
  const {activeSidebarTab} = getPlayerPrefs()
  return (
    <div className="relative h-full">
      {/* TODO: remove weird logic that assumes 2 tabs */}
      <Tabs
        index={(hasNotes && activeSidebarTab) || 0}
        onChange={(tabIndex) => setPlayerPrefs({activeSidebarTab: tabIndex})}
        className="shadow-sm lg:absolute left-0 top-0 w-full h-full flex flex-col bg-gray-100 dark:bg-gray-1000 text-gray-900 dark:text-white"
      >
        <TabList className="relative z-[1] flex-shrink-0">
          {!isEmpty(videoResource.collection) && <Tab>Lessons</Tab>}
          {hasNotes && <Tab>Notes</Tab>}
        </TabList>
        <TabPanels className="flex-grow relative">
          <div className="lg:absolute inset-0">
            <LessonListTab
              videoResource={videoResource}
              lessonView={lessonView}
            />
            <NotesTab videoResource={videoResource} />
          </div>
        </TabPanels>
      </Tabs>
    </div>
  )
}

const LessonListTab: React.FC<{
  videoResource: VideoResource
  lessonView?: any
}> = ({videoResource, lessonView}) => {
  const hidden: boolean = isEmpty(videoResource.collection)

  return hidden ? null : (
    <TabPanel className="bg-gray-100 dark:bg-gray-1000 w-full h-full">
      <CollectionLessonsList
        course={videoResource.collection}
        currentLessonSlug={videoResource.slug}
        progress={lessonView?.collection_progress}
      />
    </TabPanel>
  )
}

const NotesTab: React.FC<{videoResource: VideoResource}> = ({
  videoResource,
}) => {
  const {cues} = useNotesCues(videoResource)
  const {player, manager} = usePlayer()
  const actions = manager?.getActions()
  const hidden: boolean = isEmpty(cues)
  const scrollableNodeRef: any = React.createRef()

  return hidden ? null : (
    <TabPanel className="bg-gray-100 dark:bg-gray-1000 w-full h-96 lg:h-full">
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
                        actions?.seek(cue.startTime)
                        track('clicked cue in sidebar', {cue: cue.text})
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
    </TabPanel>
  )
}

export default PlayerSidebar
