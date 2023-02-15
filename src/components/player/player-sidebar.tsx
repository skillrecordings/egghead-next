import * as React from 'react'
import {useEggheadPlayerPrefs} from '../EggheadPlayer/use-egghead-player'
import {Tab, TabList, TabPanel, TabPanels, Tabs} from '@reach/tabs'
import {isEmpty} from 'lodash'
import CollectionLessonsList from 'components/pages/lessons/collection-lessons-list'
import {hasNotes} from './index'
import {VideoResource} from 'types'
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
import Tippy from '@tippyjs/react'
import {
  useVideo,
  useMetadataCues,
  selectActiveCues,
} from '@skillrecordings/player'
import {useSelector} from '@xstate/react'
import {
  AlertDialog,
  AlertDialogLabel,
  AlertDialogDescription,
  AlertDialogContent,
} from '@reach/alert-dialog'

const notesCreationAvailable =
  process.env.NEXT_PUBLIC_NOTES_CREATION_AVAILABLE === 'true'

const PlayerSidebar: React.FC<{
  videoResource: VideoResource
  lessonView?: any
  onAddNote?: any
  relatedResources?: any
}> = ({videoResource, lessonView, onAddNote, relatedResources}) => {
  const {viewer} = useViewer()
  const {setPlayerPrefs, getPlayerPrefs} = useEggheadPlayerPrefs()
  const {activeSidebarTab} = getPlayerPrefs()
  const videoResourceHasNotes = viewer?.can_comment ?? hasNotes(videoResource)
  const videoResourceHasCollection = !isEmpty(videoResource.collection)
  const hasRelatedResources = !isEmpty(relatedResources)
  return (
    <div className="relative h-full">
      <Tabs
        index={0}
        onChange={(tabIndex) => setPlayerPrefs({activeSidebarTab: tabIndex})}
        className="top-0 left-0 flex flex-col w-full h-full text-gray-900 bg-gray-100 shadow-sm lg:absolute dark:bg-gray-1000 dark:text-white"
      >
        <TabList className="relative z-[1] flex-shrink-0">
          {videoResourceHasCollection && (
            <Tab onClick={(e) => console.log('e')}>Lessons</Tab>
          )}
          {notesCreationAvailable && videoResourceHasNotes && (
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
          {notesCreationAvailable && (
            <TabPanel className="inset-0 lg:absolute">
              <NotesTab videoResourceHasNotes={videoResourceHasNotes} />
            </TabPanel>
          )}
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

const NotesTab: React.FC<any> = ({videoResourceHasNotes}) => {
  const cues = useMetadataCues()
  const hidden: boolean = !videoResourceHasNotes
  const scrollableNodeRef: any = React.createRef()

  const videoService = useVideo()
  const clickOpen = (cue: any) => {
    videoService.send({
      type: 'SEEKING',
      seekingTime: Number(cue.startTime),
      source: 'cue',
    })
    videoService.send('END_SEEKING')

    track('opened cue', {cue: cue.text})
  }
  const activeCues = useSelector(videoService, selectActiveCues)

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
                let note: {text: string; type?: string; id?: string}
                try {
                  note = JSON.parse(cue.text)
                } catch (e) {
                  note = {text: cue.text, id: cue.id}
                }
                const active = activeCues.includes(cue)
                const cueStartTime = convertTime(Math.round(cue.startTime))

                return (
                  <div key={cue.text}>
                    {active && <Element name="active-note" />}
                    <div
                      className={classNames(
                        'group text-sm p-4 bg-white dark:bg-gray-900 rounded-md shadow-sm border-2 border-transparent relative',
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
                      <div className="flex items-center justify-between relative pt-3">
                        {cueStartTime && (
                          <button
                            type="button"
                            onClick={() => {
                              clickOpen(cue)
                              track('clicked cue in sidebar', {cue: note.text})
                            }}
                            className="text-xs opacity-80 hover:opacity-100 transition flex items-baseline text-gray-900 hover:underline cursor-pointer dark:text-white"
                          >
                            <span className="sr-only">Go to</span>{' '}
                            <time>{cueStartTime}</time>
                          </button>
                        )}
                        {/* only user's own notes have an id */}
                        {note.id && <DeleteCue cue={cue} />}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </SimpleBar>
        </div>
      </div>
    </div>
  )
}

const DeleteCue: React.FC<{cue: VTTCue}> = ({cue}) => {
  const videoService = useVideo()
  const [showDialog, setShowDialog] = React.useState(false)
  const cancelRef: any = React.useRef()
  const open = () => setShowDialog(true)
  const close = () => setShowDialog(false)
  const deleteCue = () => {
    videoService.send({
      type: 'ACTIVATE_CUE',
      cue: cue,
    })
    videoService.send({
      type: 'DELETE_CUE',
      cue: cue,
    })
  }
  return (
    <>
      <Tippy
        placement="top"
        offset={[0, 5]}
        delay={0}
        duration={10}
        content={
          <div className="dark:bg-black bg-gray-100 rounded-md px-2 py-1 text-sm">
            delete note
          </div>
        }
      >
        <button
          type="button"
          className="absolute -right-1 dark:text-white opacity-80 hover:opacity-100 transition p-1"
          onClick={open}
        >
          <span className="sr-only">delete note</span>
          <i aria-hidden className="gg-trash-empty scale-75" />
        </button>
      </Tippy>
      {showDialog && (
        <AlertDialog
          onDismiss={close}
          leastDestructiveRef={cancelRef}
          className="dark:bg-gray-900 dark:text-white shadow-xl rounded-lg max-w-md text-center w-full"
        >
          <AlertDialogLabel className="opacity-80 pb-4 md:text-base text-sm">
            Please confirm
          </AlertDialogLabel>
          <AlertDialogDescription className="md:text-lg">
            Are you sure you want to delete this note?
          </AlertDialogDescription>
          <AlertDialogContent className="bg-transparent m-0 p-0 pt-8 w-auto flex items-center gap-3 justify-center">
            <button
              type="button"
              className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-3 rounded-md transition"
              onClick={deleteCue}
            >
              Yes, delete
            </button>{' '}
            <button
              type="button"
              className="dark:bg-gray-700 dark:text-white text-black bg-gray-200 px-4 py-3 rounded-md dark:hover:bg-gray-600 hover:bg-gray-300 transition"
              ref={cancelRef}
              onClick={close}
            >
              Nevermind, don't delete.
            </button>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
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
    <div className="flex items-center">
      <div className="relative flex-shrink-0 block w-12 h-12 lg:w-16 lg:h-16 xl:w-20 xl:h-20">
        <Image
          src={course.square_cover_480_url}
          alt={`illustration for ${course.title}`}
          layout="fill"
        />
      </div>
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
  ) : null
}

export default PlayerSidebar
