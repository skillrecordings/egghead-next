import * as React from 'react'
import {useEggheadPlayerPrefs} from '../EggheadPlayer/use-egghead-player'
import {Tab, TabList, TabPanel, TabPanels, Tabs} from '@reach/tabs'
import {isEmpty, isFunction} from 'lodash'
import CollectionLessonsList from 'components/pages/lessons/collection-lessons-list'
import {hasNotes, useNotesCues} from './index'
import {VideoResource} from 'types'
import {usePlayer} from 'cueplayer-react'
import SimpleBar from 'simplebar-react'
import {Element} from 'react-scroll'
import classNames from 'classnames'
import ReactMarkdown from 'react-markdown'
import {convertTime} from 'utils/time-utils'
import {track} from 'utils/analytics'
import Link from 'components/link'
import Image from 'next/image'
import CodeBlock from 'components/code-block'
import {useViewer} from '../../context/viewer-context'

const notesCreationAvailable =
  process.env.NEXT_PUBLIC_NOTES_CREATION_AVAILABLE === 'true'

const PlayerSidebar: React.FC<{
  videoResource: VideoResource
  lessonView?: any
  onAddNote?: any
  relatedResources?: any
}> = ({videoResource, lessonView, onAddNote, relatedResources}) => {
  const {setPlayerPrefs, getPlayerPrefs} = useEggheadPlayerPrefs()
  const {activeSidebarTab} = getPlayerPrefs()

  const videoResourceHasNotes = hasNotes(videoResource)
  const videoResourceHasCollection = !isEmpty(videoResource.collection)
  const hasRelatedResources = !isEmpty(relatedResources)
  return (
    <div className="relative h-full">
      <Tabs
        index={(videoResourceHasNotes && activeSidebarTab) || 0}
        onChange={(tabIndex) => setPlayerPrefs({activeSidebarTab: tabIndex})}
        className="top-0 left-0 flex flex-col w-full h-full text-gray-900 bg-gray-100 shadow-sm lg:absolute dark:bg-gray-1000 dark:text-white"
      >
        <TabList className="relative z-[1] flex-shrink-0">
          {videoResourceHasCollection && (
            <Tab onClick={(e) => console.log('e')}>Lessons</Tab>
          )}
          {videoResourceHasNotes && (
            <Tab onClick={(e) => console.log('e')}>Notes</Tab>
          )}
        </TabList>
        <TabPanels className="relative flex-grow">
          <TabPanel className="inset-0 lg:absolute">
            <LessonListTab
              videoResource={videoResource}
              lessonView={lessonView}
              onActiveTab={activeSidebarTab === 0}
            />
          </TabPanel>
          <TabPanel className="inset-0 lg:absolute">
            <NotesTab onAddNote={onAddNote} />
          </TabPanel>
          {hasRelatedResources &&
            !videoResourceHasCollection &&
            !videoResourceHasNotes && (
              <div className="flex flex-col w-full space-y-3">
                <h3 className="mt-4 font-semibold text-center text-md md:text-lg">
                  {relatedResources.headline}
                </h3>
                {relatedResources.linksTo.map((content: any) => {
                  return (
                    <Link
                      href={
                        content.slug ? `/${content.type}s/${content.slug}` : '#'
                      }
                    >
                      <a
                        onClick={() => {
                          track('clicked cta content', {
                            from: videoResource.slug,
                            [content.type]: content.slug,
                            location: 'sidebar',
                          })
                        }}
                        className="flex items-center px-3 py-2 ml-4 space-x-2 transition-colors duration-200 ease-in-out hover:underline"
                      >
                        <div className="relative flex-shrink-0 w-12 h-12 ">
                          <Image
                            src={content.imageUrl}
                            alt={`illustration of ${content.title} course`}
                            width="64"
                            height="64"
                            layout="fill"
                          />
                        </div>
                        <div className="relative font-bold">
                          {content.title}
                        </div>
                      </a>
                    </Link>
                  )
                })}
              </div>
            )}
        </TabPanels>
      </Tabs>
    </div>
  )
}

const LessonListTab: React.FC<{
  videoResource: VideoResource
  lessonView?: any
  onActiveTab: boolean
}> = ({videoResource, lessonView, onActiveTab}) => {
  const hidden: boolean = isEmpty(videoResource.collection)

  return hidden ? null : (
    <div className="w-full h-full bg-gray-100 dark:bg-gray-1000">
      <div className="flex flex-col h-full">
        <div className="flex-shrink-0 p-4 border-gray-100 sm:border-b dark:border-gray-800">
          <CourseHeader
            course={videoResource.collection}
            currentLessonSlug={videoResource.slug}
          />
        </div>
        <div className="flex-grow overflow-hidden">
          <CollectionLessonsList
            course={videoResource.collection}
            currentLessonSlug={videoResource.slug}
            progress={lessonView?.collection_progress}
            onActiveTab={onActiveTab}
          />
        </div>
      </div>
    </div>
  )
}

const NotesTab: React.FC<any> = ({onAddNote}) => {
  const {player, manager} = usePlayer()
  const {viewer} = useViewer()
  const {cues} = useNotesCues()
  const actions = manager?.getActions()
  const hidden: boolean = isEmpty(cues)
  const scrollableNodeRef: any = React.createRef()

  const canCreateNote = viewer?.can_comment && notesCreationAvailable

  return hidden ? null : (
    <div className="w-full bg-gray-100 dark:bg-gray-1000 h-96 lg:h-full">
      <div className="flex flex-col h-full">
        <div className="flex-grow overflow-hidden">
          <SimpleBar
            forceVisible="y"
            autoHide={false}
            scrollableNodeProps={{
              ref: scrollableNodeRef,
              id: 'notes-tab-scroll-container',
            }}
            className="h-full p-4 overscroll-contain"
          >
            <div className="space-y-3">
              {cues.map((cue: VTTCue) => {
                let note: {text: string; type?: string}
                try {
                  note = JSON.parse(cue.text)
                } catch (e) {
                  note = {text: cue.text}
                }
                const active = player.activeMetadataTrackCues.includes(cue)
                return (
                  <div key={cue.text}>
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
                      {note.text && (
                        <ReactMarkdown
                          className="leading-normal prose-sm prose dark:prose-dark dark:prose-a:text-blue-300 prose-a:text-blue-500"
                          renderers={{
                            code: (props) => {
                              return <CodeBlock {...props} />
                            },
                          }}
                        >
                          {note.text}
                        </ReactMarkdown>
                      )}
                      {cue.startTime && (
                        <div
                          onClick={() => {
                            actions?.seek(cue.startTime)
                            track('clicked cue in sidebar', {cue: note.text})
                          }}
                          className="flex items-baseline justify-end w-full pt-3 text-gray-900 underline cursor-pointer dark:text-white"
                        >
                          <time className="text-xs font-medium opacity-60">
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
        </div>
        {canCreateNote && (
          <div className="flex-shrink-0 p-4">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                if (isFunction(onAddNote)) {
                  onAddNote()
                  actions.pause()
                  track(`clicked add note`)
                }
              }}
              aria-expanded={true}
              aria-controls="add-note-overlay"
              className="flex items-center justify-center w-full p-3 text-xs font-semibold text-gray-500 uppercase duration-100 bg-gray-200 rounded-md hover:bg-gray-300 hover:text-gray-600"
            >
              <IconNote />
              <span className="ml-2">Add a note</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

const CourseHeader: React.FunctionComponent<{
  course: {
    title: string
    square_cover_480_url: string
    slug: string
    path: string
  }
  currentLessonSlug: string
}> = ({course, currentLessonSlug}) => {
  return course ? (
    <div>
      <div className="flex items-center">
        <Link href={course.path}>
          <a className="relative flex-shrink-0 block w-12 h-12 lg:w-16 lg:h-16 xl:w-20 xl:h-20">
            <Image
              src={course.square_cover_480_url}
              alt={`illustration for ${course.title}`}
              layout="fill"
            />
          </a>
        </Link>
        <div className="ml-2 lg:ml-4">
          <h4 className="mb-px text-xs font-semibold text-gray-700 uppercase dark:text-gray-100">
            Course
          </h4>
          <Link href={course.path}>
            <a
              onClick={() => {
                track(`clicked open course`, {
                  lesson: currentLessonSlug,
                })
              }}
              className="hover:underline"
            >
              <h3 className="font-bold leading-tighter 2xl:text-lg">
                {course.title}
              </h3>
            </a>
          </Link>
        </div>
      </div>
    </div>
  ) : null
}

export default PlayerSidebar

const IconNote: React.FC<any> = ({className}) => (
  <svg
    viewBox="0 0 23 22"
    xmlns="http://www.w3.org/2000/svg"
    className={`w-4 h-4 ${className ?? ''}`}
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M23 14.667V2.933C23 1.313 21.713 0 20.125 0H2.875C1.287 0 0 1.313 0 2.933v11.734c0 1.62 1.287 2.933 2.875 2.933h4.313L11.5 22l4.313-4.4h4.312c1.588 0 2.875-1.313 2.875-2.933zm-18.688-8.8c0-.81.644-1.467 1.438-1.467h11.5c.794 0 1.438.657 1.438 1.467s-.644 1.466-1.438 1.466H5.75c-.794 0-1.438-.656-1.438-1.466zm1.438 4.4c-.794 0-1.438.656-1.438 1.466 0 .81.644 1.467 1.438 1.467h4.313c.793 0 1.437-.657 1.437-1.467s-.644-1.466-1.438-1.466H5.75z"
      clipRule="evenodd"
    />
  </svg>
)
