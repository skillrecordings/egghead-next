import * as React from 'react'
import Link from 'next/link'
import Image from 'next/legacy/image'
import Markdown from 'react-markdown'
import toast from 'react-hot-toast'
import InstructorProfile from '@/components/pages/courses/instructor-profile'
import PlayIcon from '@/components/pages/courses/play-icon'
import getDependencies from '@/data/courseDependencies'
import {get, first, filter, isEmpty} from 'lodash'
import {NextSeo} from 'next-seo'
import removeMarkdown from 'remove-markdown'
import {track} from '@/utils/analytics'
import {convertTimeWithTitles} from '@/utils/time-utils'
import {LessonResource, SectionResource} from '@/types'
import BookmarkIcon from '../icons/bookmark'
import axios from '@/utils/configured-axios'
import friendlyTime from 'friendly-time'
import LearnerRatings from '../pages/courses/learner-ratings'
import ScrimbaResource from '@/components/scrimba-resource'
import TagList from './tag-list'
import DialogButton from '../pages/courses/dialog-button'
import * as Accordion from '@radix-ui/react-accordion'
import ClockIcon from '../icons/clock'
import Balancer from 'react-wrap-balancer'
import {CheckIcon, ChevronDownIcon, ChevronUpIcon} from '@heroicons/react/solid'

import {
  logCollectionResource,
  //   Duration,
  PeopleCompleted,
  StarsRating,
  PublishedAt,
  UpdatedAt,
} from './collection-page-layout'

import LoginForm from '@/pages/login'
import rehypeRaw from 'rehype-raw'

type CoursePageLayoutProps = {
  lessons: LessonResource[]
  course: any
  ogImageUrl: string
  sections: SectionResource[]
}

type ModuleResource = {
  resourceList: Resource[]
  sectionTitle: string
}

type Resource = ModuleResource | LessonResource

const ScrimbaPageLayout: React.FunctionComponent<
  React.PropsWithChildren<CoursePageLayoutProps>
> = ({lessons = [], course, ogImageUrl, sections = []}) => {
  const courseDependencies: any = getDependencies(course.slug)
  const [isFavorite, setIsFavorite] = React.useState(false)
  const [clickable, setIsClickable] = React.useState(true)

  const InstructorSection = () => {
    return (
      <section className="dark:bg-gray-800 bg-gray-100 flex flex-col items-center justify-center lg:p-10 p-5 rounded-md">
        <div className="flex flex-col justify-between">
          <div className="flex lg:flex-row flex-col items-center gap-5">
            <Image
              className="rounded-full"
              src={avatar_url}
              width={150}
              height={150}
              alt={`${name}'s avatar`}
            />
            <div className="lg:text-left text-center">
              <h2 className="text-lg dark:text-gray-300 text-gray-700">
                Meet the Instructor
              </h2>
              <h3 className="font-semibold sm:text-2xl text-lg">
                Hi, I'm {name}
              </h3>
            </div>
          </div>
          <div className="prose dark:prose-dark md:prose-lg pt-8">
            <p>
              I’m a tutor at Scrimba and I’ve been messing around with websites
              since 2004. I’m aiming to take the pain out of learning to code.
            </p>
          </div>
        </div>
      </section>
    )
  }

  const totalLessons = sections?.reduce(
    (count, section) => count + section.lessons.length,
    0,
  )

  const AccordionLessonList = () => {
    const [openLesson, setOpenLesson] = React.useState<string[]>(['resource_0'])

    const handleAccordionChange = (value: string[]): void => {
      setOpenLesson(value)
    }

    return (
      <>
        <section className="mt-8">
          <div className="flex flex-col mb-2 space-y-4">
            <h2 className="text-xl font-bold">Course Content</h2>
            <div className="text-sm font-normal text-gray-600 dark:text-gray-300">
              {durationCourse && `${durationCourse} • `}
              {totalLessons} lessons
            </div>
          </div>
          <Accordion.Root
            type="multiple"
            value={openLesson}
            onValueChange={handleAccordionChange}
          >
            {sections?.map((section: SectionResource, index: number) => (
              <Accordion.Item key={index} value={`resource_${index}`}>
                <Accordion.Header className="relative z-10 overflow-hidden rounded-lg  pt-4">
                  <Accordion.Trigger className="bg-gray-100 group relative z-10 flex w-full items-center justify-between rounded-lg border border-white/5 dark:bg-gray-800/20 px-3 py-2.5 text-left text-lg font-medium leading-tight shadow-lg transition dark:hover:bg-gray-800/40">
                    <Balancer>{section.title}</Balancer>
                    <div className="flex items-center">
                      {openLesson.includes(`resource_${index}`) ? (
                        <ChevronUpIcon
                          className="relative h-3 w-3 opacity-70 transition group-radix-state-open:rotate-180"
                          aria-hidden="true"
                        />
                      ) : (
                        <ChevronDownIcon
                          className="relative h-3 w-3 opacity-70 transition"
                          aria-hidden="true"
                        />
                      )}
                    </div>
                  </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content>
                  <ul>
                    {section.lessons.map(
                      (item: LessonResource, itemIndex: number) => {
                        if (item && 'sectionTitle' in item) {
                          // Handle ModuleResource
                          return null // Render nothing for ModuleResource
                        } else {
                          // Handle LessonResource
                          const lessonResource = item as LessonResource
                          const isComplete = lessonResource.completed

                          return (
                            <li key={lessonResource.slug}>
                              <div className="flex py-2 font-semibold leading-tight">
                                <div className="flex items-center mr-2 space-x-2">
                                  <div
                                    className={`${
                                      isComplete
                                        ? 'text-blue-600 dark:text-green-400'
                                        : 'text-gray-500 dark:text-gray-400'
                                    } pt-px font-xs scale-75 font-normal w-4`}
                                  >
                                    {isComplete ? (
                                      <CheckIcon className="w-6 h-6 -translate-x-2" />
                                    ) : (
                                      itemIndex + 1
                                    )}
                                  </div>
                                  {lessonResource.icon_url && (
                                    <div className="flex items-center flex-shrink-0 w-8">
                                      <Image
                                        src={lessonResource.icon_url}
                                        width={24}
                                        height={24}
                                      />
                                    </div>
                                  )}
                                </div>
                                {lessonResource.path && (
                                  <div className="flex flex-col">
                                    <div>
                                      <Link
                                        href={lessonResource.path}
                                        onClick={() => {
                                          track(
                                            `clicked video link on course page`,
                                            {
                                              course: course.slug,
                                              video: lessonResource.slug,
                                            },
                                          )
                                        }}
                                        className="text-lg font-semibold hover:underline hover:text-blue-600 dark:text-gray-100"
                                      >
                                        {lessonResource.title}
                                      </Link>
                                    </div>
                                    <div className="text-xs text-gray-700 dark:text-gray-500">
                                      {convertTimeWithTitles(
                                        lessonResource.duration,
                                        {
                                          showSeconds: true,
                                        },
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </li>
                          )
                        }
                      },
                    )}
                  </ul>
                </Accordion.Content>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        </section>
      </>
    )
  }

  const {
    title,
    image_thumb_url,
    square_cover_480_url,
    instructor,
    average_rating_out_of_5,
    watched_count,
    description,
    rss_url,
    toggle_favorite_url,
    duration,
    collection_progress,
    favorited,
    updated_at,
    created_at,
    access_state,
    customOgImage,
    illustrator: sanityIllustrator,
    dependencies: sanityTags = [],
    state,
    path,
    tags: railsTags = [],
  } = course

  const sanityTagsPresent = () => {
    return sanityTags.length > 0
  }

  const ogImage = customOgImage ? customOgImage.url : ogImageUrl

  const courseIllustrator = !isEmpty(sanityIllustrator)
    ? sanityIllustrator
    : courseDependencies?.illustrator

  logCollectionResource(course)

  React.useEffect(() => {
    setIsFavorite(favorited)
  }, [favorited])

  const completedLessonSlugs = get(
    collection_progress,
    'completed_lessons',
    [],
  ).map((lesson: LessonResource) => lesson.slug)

  const {
    full_name: name,
    avatar_url,
    slug,
    bio_short,
    twitter,
  } = instructor || {}

  const image_url = square_cover_480_url || image_thumb_url

  const imageIsTag = image_url.includes('tags/image')

  const courseListLessons: any[] = course.sections?.reduce(
    (acc: any[], cur: any) => {
      return [...acc, ...cur.lessons]
    },
    [],
  )

  // this is a pretty sloppy approach to fetching the next lesson
  // via playlist lessons, but those are for nested playlists in
  // playlists
  const nextLesson: any = isEmpty(courseListLessons)
    ? first(
        lessons.filter(
          (lesson: LessonResource) =>
            !completedLessonSlugs.includes(lesson.slug),
        ),
      )
    : first(
        courseListLessons.filter(
          (lesson: LessonResource) =>
            !completedLessonSlugs.includes(lesson.slug),
        ),
      )

  const PlayButton: React.FunctionComponent<
    React.PropsWithChildren<{lesson: LessonResource}>
  > = ({lesson}) => {
    const isContinuing =
      lesson && lesson !== first(lessons) && lesson !== first(courseListLessons)
    return lesson ? (
      <Link
        href={lesson.path}
        onClick={() => {
          track(
            `clicked ${isContinuing ? 'continue' : 'start'} watching course`,
            {
              course: course.slug,
            },
          )
        }}
        className="inline-flex items-center justify-center px-6 py-4 font-semibold text-white transition-all duration-200 ease-in-out bg-blue-600 rounded-md hover:bg-blue-700"
      >
        <PlayIcon className="mr-2 text-blue-100" />
        {isContinuing ? 'Continue' : 'Start'} Watching
      </Link>
    ) : null
  }

  const CourseArtwork: React.FunctionComponent<
    React.PropsWithChildren<{
      path: string
      size: number
      trackText: string
    }>
  > = ({path, size, trackText}) => {
    return path ? (
      <Link
        href={path}
        onClick={() =>
          track(trackText, {
            course: course.slug,
          })
        }
      >
        <Image
          src={image_url}
          alt={`illustration for ${title}`}
          height={size}
          width={size}
          quality={100}
        />
      </Link>
    ) : (
      <Image
        src={image_url}
        alt={`illustration for ${title}`}
        height={size}
        width={size}
        quality={100}
      />
    )
  }

  const trackEmailCapture = () => {
    track('submitted email', {
      course: course.slug,
      location: 'disabled bookmark button',
    })
  }

  const durationCourse = '4h 33m'

  return (
    <>
      <NextSeo
        description={removeMarkdown(description)}
        canonical={`${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}${path}`}
        title={title}
        titleTemplate={'%s | egghead.io'}
        twitter={{
          handle: instructor?.twitter ?? `@eggheadio`,
          site: `@eggheadio`,
          cardType: 'summary_large_image',
        }}
        openGraph={{
          title,
          url: `${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}${path}`,
          description: removeMarkdown(description),
          site_name: 'egghead',
          images: [
            {
              url: ogImage,
            },
          ],
        }}
      />
      <div className="container pb-8 sm:pb-16 dark:text-gray-100">
        {state === 'retired' && (
          <div className="w-full p-3 text-lg text-orange-800 bg-orange-100 border border-orange-900 rounded-md border-opacity-20">
            ⚠️ This course has been retired and might contain outdated
            information.
          </div>
        )}
        <div className="grid w-full grid-rows-1">
          <div className="flex-row left-0 grid w-full grid-cols-1 gap-5 mt-10 sm:mb-4 rounded-md md:grid-cols-5 md:gap-16">
            <div className="flex flex-col w-full h-full mx-auto md:col-span-3 md:row-start-auto max-w-screen-2xl">
              <header>
                {image_url && (
                  <div className="flex items-center justify-center md:hidden">
                    <CourseArtwork
                      path={nextLesson.path}
                      trackText="clicked course image on mobile"
                      size={imageIsTag ? 100 : 200}
                    />
                  </div>
                )}
                {access_state && (
                  <div
                    className={`${
                      access_state === 'free' ? 'bg-orange-500' : 'bg-blue-500'
                    } text-white w-12 items-center text-center py-1 rounded-full uppercase font-bold my-2 text-xs mx-auto md:m-0 md:mb-2`}
                  >
                    {access_state}
                  </div>
                )}
                <h1 className="mt-4 text-2xl font-bold leading-tight text-center sm:text-3xl md:text-4xl md:leading-tighter md:text-left md:mt-0">
                  {title}
                </h1>

                {/* Start of metadata block */}
                <div className="flex flex-col items-center my-6 space-y-3 md:space-y-4 md:items-start">
                  {instructor && (
                    <InstructorProfile
                      name={name}
                      avatar_url={avatar_url}
                      url={slug}
                      bio_short={bio_short}
                      twitter={twitter}
                    />
                  )}
                  <div className="flex flex-col flex-wrap items-center md:flex-row space-y-3 md:space-y-0">
                    <TagList
                      tags={sanityTagsPresent() ? sanityTags : railsTags}
                      courseSlug={course.slug}
                    />
                    <div className="flex items-center justify-center md:justify-start space-x-2">
                      {durationCourse && (
                        <div className="flex flex-row items-center">
                          <ClockIcon className="w-4 h-4 mr-1 opacity-60" />
                          <span>{durationCourse}</span>{' '}
                        </div>
                      )}
                      <span>&middot;</span>
                      <div>{totalLessons} lessons </div>
                    </div>
                  </div>

                  {(average_rating_out_of_5 > 0 || watched_count > 0) && (
                    <div className="flex flex-col items-center justify-center w-full space-y-4 md:flex-row md:justify-start md:space-y-0 md:space-x-6">
                      <div className="flex flex-col items-center space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4 sm:flex-nowrap">
                        {average_rating_out_of_5 > 0 && (
                          <StarsRating rating={average_rating_out_of_5} />
                        )}
                        {watched_count > 0 && (
                          <PeopleCompleted count={watched_count} />
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-row space-x-3 text-sm opacity-80 md:items-start">
                    {created_at && (
                      <PublishedAt date={friendlyTime(new Date(created_at))} />
                    )}{' '}
                    <span className="text-gray-400">|</span>
                    {updated_at && (
                      <UpdatedAt date={friendlyTime(new Date(updated_at))} />
                    )}
                  </div>
                </div>
                {/* End of metadata block */}

                {/* Start of action buttons block */}
                <div className="flex items-center justify-center mt-4 space-x-2 dark:text-gray-900 md:justify-start">
                  {/* Bookmark button */}
                  {toggle_favorite_url ? (
                    <button
                      onClick={() => {
                        if (clickable) {
                          setIsClickable(false)
                          track(
                            `clicked ${isFavorite ? 'remove' : 'add'} bookmark`,
                            {
                              course: course.slug,
                            },
                          )
                          setTimeout(() => {
                            setIsClickable(true)
                          }, 1000)
                          axios.post(toggle_favorite_url).then(() => {
                            setIsFavorite(!isFavorite)
                            toast(
                              `Course ${
                                isFavorite ? 'removed from' : 'added to'
                              } Bookmarks`,
                              {duration: 1000},
                            )
                          })
                        }
                      }}
                    >
                      <div
                        className={
                          ' flex flex-row items-center rounded  px-4 py-2 border transition-all text-sm xs:text-base ease-in-out duration-150 shadow-sm ' +
                          (isFavorite
                            ? 'hover:bg-blue-500 bg-blue-600 border-blue-700 text-white'
                            : 'bg-white text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700 border-gray-300  dark:bg-gray-800 dark:border-gray-600')
                        }
                      >
                        <BookmarkIcon
                          className="w-4 h-4 mr-2"
                          fill={isFavorite}
                        />{' '}
                        {isFavorite ? 'Bookmarked' : 'Bookmark'}
                      </div>
                    </button>
                  ) : (
                    <DialogButton
                      buttonText="Bookmark"
                      title="Sign in or create a free account to bookmark"
                      buttonStyles="text-gray-600 dark:text-gray-300 flex flex-row items-center rounded hover:bg-gray-100
                    dark:hover:bg-gray-700 border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-600 px-4 py-2 border transition-colors text-sm xs:text-base ease-in-out opacity-90 shadow-sm"
                    >
                      <LoginForm
                        image={<></>}
                        className="flex flex-col items-center justify-center w-full mx-auto"
                        label="Email address"
                        formClassName="max-w-xs md:max-w-sm mx-auto w-full"
                        button="Sign In or Create an Account"
                        track={trackEmailCapture}
                      >
                        <p className="px-3 text-center text-gray-700 max-w-10 dark:text-gray-400">
                          You need to be signed in to bookmark courses. Sign in
                          or create a free account to save this course.
                        </p>
                      </LoginForm>
                    </DialogButton>
                  )}
                </div>
                {/* End of action buttons block */}

                <div className="flex items-center justify-center w-full mt-5 md:hidden">
                  <PlayButton lesson={nextLesson} />
                </div>
                <Markdown
                  rehypePlugins={[rehypeRaw]}
                  className="mb-6 prose text-gray-900 dark:prose-dark md:prose-lg md:dark:prose-lg-dark dark:text-gray-100 dark:prose-a:text-blue-300 dark:hover:prose-a:text-blue-200 prose-a:text-blue-500 hover:prose-a-:text-blue-600 mt-14"
                >
                  {description}
                </Markdown>
                <div className="block pt-5 md:hidden">
                  {get(course, 'access_state') === 'free' && (
                    <div className="p-4 my-8 border border-gray-100 rounded-md bg-gray-50 dark:border-gray-800 dark:bg-gray-800">
                      <ScrimbaResource type="course" />
                    </div>
                  )}
                  <AccordionLessonList />
                </div>
                <LearnerRatings collection={course} />
              </header>
            </div>
            <div className="flex flex-col items-center justify-start mb-4 md:col-span-2 md:mb-0">
              {image_url && (
                <div className="hidden md:block">
                  <CourseArtwork
                    path={nextLesson.path}
                    size={imageIsTag ? 200 : 420}
                    trackText="clicked course image"
                  />
                </div>
              )}
              {courseIllustrator && (
                <div className="hidden text-sm text-center md:block opacity-80">
                  <h4 className="font-semibold">Credits</h4>
                  <span>{courseIllustrator?.name}</span>
                </div>
              )}
              <div className="hidden space-y-6 md:block">
                <div className="flex justify-center w-full mt-10 mb-4">
                  <PlayButton lesson={nextLesson} />
                </div>
                {get(course, 'access_state') === 'free' && (
                  <div className="p-4 my-8 border border-gray-100 rounded-md bg-gray-50 dark:border-gray-800 dark:bg-gray-800">
                    <ScrimbaResource type="course" />
                  </div>
                )}
                <AccordionLessonList />
              </div>
            </div>
          </div>
          <div className="grid md:grid-cols-2 xl:gap-16 lg:gap-10 sm:gap-5 gap-5 sm:pt-8">
            <InstructorSection />
          </div>
        </div>
      </div>
    </>
  )
}

export default ScrimbaPageLayout
