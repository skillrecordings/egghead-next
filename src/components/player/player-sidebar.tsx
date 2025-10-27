import * as React from 'react'
import {useEggheadPlayerPrefs} from '../EggheadPlayer/use-egghead-player'
import {Tab, TabList, TabPanel, TabPanels, Tabs} from '@reach/tabs'
import {isEmpty} from 'lodash'
import CollectionLessonsList from '@/components/pages/lessons/collection-lessons-list'
import {VideoResource} from '@/types'
import {track} from '@/utils/analytics'
import Link from '@/components/link'
import Image from 'next/legacy/image'
import {GenericErrorBoundary} from '../generic-error-boundary'
import {trpc} from '@/app/_trpc/client'

const notesEnabled = process.env.NEXT_PUBLIC_NOTES_ENABLED === 'true'

const PlayerSidebar: React.FC<
  React.PropsWithChildren<{
    videoResource: VideoResource
    lessonView?: any
    onAddNote?: any
    relatedResources?: any
  }>
> = ({videoResource, lessonView, relatedResources}) => {
  const {setPlayerPrefs, getPlayerPrefs} = useEggheadPlayerPrefs()
  const {activeSidebarTab} = getPlayerPrefs()
  const videoResourceHasCollection = !isEmpty(videoResource.collection)
  const hasRelatedResources = !isEmpty(relatedResources)
  return (
    <GenericErrorBoundary>
      <div className="relative h-full">
        <Tabs
          index={activeSidebarTab || 0}
          onChange={(tabIndex) => setPlayerPrefs({activeSidebarTab: tabIndex})}
          className="top-0 left-0 flex flex-col w-full h-full text-gray-900 bg-gray-100 shadow-sm lg:absolute dark:bg-gray-1000 dark:text-white"
        >
          {notesEnabled && (
            <TabList className="relative z-[1] flex-shrink-0">
              {videoResourceHasCollection && <Tab>Lessons</Tab>}
            </TabList>
          )}
          <TabPanels className="relative flex-grow">
            <TabPanel className="inset-0 lg:absolute">
              <LessonListTab
                videoResource={videoResource}
                lessonView={lessonView}
                onActiveTab={activeSidebarTab === 0}
              />
            </TabPanel>
            {hasRelatedResources && !videoResourceHasCollection && (
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
                      <div className="relative font-bold">{content.title}</div>
                    </Link>
                  )
                })}
              </div>
            )}
          </TabPanels>
        </Tabs>
      </div>
    </GenericErrorBoundary>
  )
}

const LessonListTab: React.FC<
  React.PropsWithChildren<{
    videoResource: VideoResource
    lessonView?: any
    onActiveTab: boolean
  }>
> = ({videoResource, lessonView, onActiveTab}) => {
  const collectionIsEmpty: boolean = isEmpty(videoResource.collection)
  const [filteredCourse, setFilteredCourse] = React.useState<any>(null)

  // accounts for data coming from either GraphQL or Sanity. Sometimes there will be an array of tags instead of a single primary tag
  const primaryTag = videoResource.primary_tag
    ? videoResource.primary_tag
    : videoResource.tags
    ? videoResource.tags[0]
    : null

  const {data: lessonsFromTag} = collectionIsEmpty
    ? trpc.lesson.getAssociatedLessonsByTag.useQuery({
        tag: primaryTag?.name,
        currentLessonSlug: videoResource.slug,
      })
    : {data: null}

  // Memoize the callback to prevent infinite loops
  const handleCourseLoaded = React.useCallback((fullCourse: any) => {
    setFilteredCourse(fullCourse)
  }, [])

  // Only use filtered course data once it's loaded to avoid showing unpublished lessons
  // For non-collection lessons (lessonsFromTag), use immediately
  const courseToDisplay = collectionIsEmpty
    ? videoResource.collection
    : filteredCourse

  return !collectionIsEmpty || lessonsFromTag ? (
    <div className="w-full h-full bg-gray-100 dark:bg-gray-1000">
      <div className="flex flex-col h-full">
        {!collectionIsEmpty && (
          <div className="flex-shrink-0 p-4 border-gray-100 sm:border-b dark:border-gray-800">
            <CourseHeader
              course={videoResource.collection}
              currentLessonSlug={videoResource.slug}
              onCourseLoaded={handleCourseLoaded}
            />
          </div>
        )}
        {collectionIsEmpty && primaryTag?.name && (
          <div className="flex-shrink-0 p-4 border-gray-100 sm:border-b dark:border-gray-800">
            <TagHeader
              tag={primaryTag}
              currentLessonSlug={videoResource.slug}
            />
          </div>
        )}
        <div className="flex-grow overflow-hidden">
          <CollectionLessonsList
            course={courseToDisplay}
            currentLessonSlug={videoResource.slug}
            progress={lessonView?.collection_progress}
            lessons={lessonsFromTag}
            onActiveTab={onActiveTab}
          />
        </div>
      </div>
    </div>
  ) : null
}

const CourseHeader: React.FunctionComponent<
  React.PropsWithChildren<{
    course: {
      title: string
      square_cover_480_url: string
      slug: string
      path: string
    }
    currentLessonSlug: string
    onCourseLoaded?: (fullCourse: any) => void
  }>
> = ({course, currentLessonSlug, onCourseLoaded}) => {
  const {data: fullCourse} = trpc.course.getCourse.useQuery({
    slug: course.slug,
  })

  React.useEffect(() => {
    if (fullCourse && onCourseLoaded) {
      // Don't transform if course has sections - sections contain their own lessons
      if (fullCourse.sections && fullCourse.sections.length > 0) {
        onCourseLoaded(fullCourse)
        return
      }

      // For non-sectioned courses, prefer courseBuilderLessons (filtered), then lessons, then filter items
      const transformedCourse = {
        ...fullCourse,
        lessons:
          fullCourse.courseBuilderLessons &&
          fullCourse.courseBuilderLessons.length > 0
            ? fullCourse.courseBuilderLessons
            : fullCourse.lessons && fullCourse.lessons.length > 0
            ? fullCourse.lessons
            : fullCourse.items?.filter((item: any) =>
                ['lesson', 'talk'].includes(item.type),
              ) || [],
      }
      onCourseLoaded(transformedCourse)
    }
    // Only depend on fullCourse, not onCourseLoaded (which is memoized)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullCourse])

  console.log('course', fullCourse)
  return course ? (
    <div className="flex items-center">
      <div className="relative flex-shrink-0 block w-12 h-12 lg:w-16 lg:h-16 xl:w-20 xl:h-20">
        <Image
          src={fullCourse?.square_cover_480_url || course.square_cover_480_url}
          alt={`illustration for ${course.title}`}
          layout="fill"
        />
      </div>
      <div className="ml-2 lg:ml-4">
        <span className="mb-px text-xs font-semibold text-gray-700 uppercase dark:text-gray-100">
          Course
        </span>
        <Link
          href={course.path}
          onClick={() => {
            track(`clicked open course`, {
              lesson: currentLessonSlug,
            })
          }}
          className="hover:underline"
        >
          <h2 className="font-bold leading-tighter 2xl:text-lg">
            {course.title}
          </h2>
        </Link>
      </div>
    </div>
  ) : null
}

const TagHeader: React.FunctionComponent<
  React.PropsWithChildren<{
    tag: {
      name: string
      label: string
      http_url: string
      image_url: string
    }
    currentLessonSlug: string
  }>
> = ({tag, currentLessonSlug}) => {
  return tag ? (
    <div className="flex items-center">
      <div className="relative flex-shrink-0 block w-12 h-12 lg:w-16 lg:h-16 xl:w-20 xl:h-20">
        <Image
          src={tag.image_url}
          alt={`illustration for ${tag.name}`}
          layout="fill"
        />
      </div>
      <div className="ml-2 lg:ml-4">
        <span className="mb-px text-xs font-semibold text-gray-700 uppercase dark:text-gray-100">
          Tag
        </span>
        <Link
          href={`/q/${tag.name}`}
          onClick={() => {
            track(`clicked open tag`, {
              lesson: currentLessonSlug,
            })
          }}
          className="hover:underline"
        >
          <h2 className="font-bold leading-tighter 2xl:text-lg">
            Lessons Related to {tag.label}
          </h2>
        </Link>
      </div>
    </div>
  ) : null
}

export default PlayerSidebar
