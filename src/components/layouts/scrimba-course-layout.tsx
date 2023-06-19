import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Markdown from 'react-markdown'
import toast from 'react-hot-toast'
import InstructorProfile from 'components/pages/courses/instructor-profile'
import PlayIcon from 'components/pages/courses/play-icon'
import getDependencies from 'data/courseDependencies'
import {get, first, filter, isEmpty} from 'lodash'
import {NextSeo} from 'next-seo'
import removeMarkdown from 'remove-markdown'
import {track} from 'utils/analytics'
import FolderDownloadIcon from '../icons/folder-download'
import RSSIcon from '../icons/rss'
import {convertTimeWithTitles} from 'utils/time-utils'
import {LessonResource} from 'types'
import BookmarkIcon from '../icons/bookmark'
import axios from 'utils/configured-axios'
import friendlyTime from 'friendly-time'
import LearnerRatings from '../pages/courses/learner-ratings'
import CommunityResource from 'components/community-resource'
import TagList from './tag-list'
import DialogButton from '../pages/courses/dialog-button'
import MembershipDialogButton from '../pages/courses/membership-dialog-button'
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

import LoginForm from 'pages/login'

type CoursePageLayoutProps = {
  lessons: LessonResource[]
  course: any
  ogImageUrl: string
}

type ModuleResource = {
  resourceList: Resource[]
  sectionTitle: string
}

type Resource = ModuleResource | LessonResource

const ScrimbaPageLayout: React.FunctionComponent<CoursePageLayoutProps> = ({
  lessons = [],
  course,
  ogImageUrl,
}) => {
  console.log('these are the lessons:', lessons)
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

  const resourceCollection: ModuleResource[] = [
    {
      sectionTitle: 'Build a Movie Idea Generator With ChatGPT and Dall-E',
      resourceList: lessons.slice(0, 3),
    },
    {
      sectionTitle: 'Build a GPT-4 Chatbot',
      resourceList: lessons.slice(3, 4),
    },
    {
      sectionTitle: 'Build a Chatbot With a fine-tuned Model',
      resourceList: lessons.slice(4, 5),
    },
  ]

  console.log('are the slices working?:', resourceCollection)

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
              {lessons.length + playlistLessons.length} lessons
            </div>
          </div>
          <Accordion.Root
            type="multiple"
            value={openLesson}
            onValueChange={handleAccordionChange}
          >
            {resourceCollection.map(
              (resource: ModuleResource, index: number) => (
                <Accordion.Item key={index} value={`resource_${index}`}>
                  <Accordion.Header className="relative z-10 overflow-hidden rounded-lg bg-gray-900 pt-4">
                    <Accordion.Trigger className="group relative z-10 flex w-full items-center justify-between rounded-lg border border-white/5 bg-gray-800/20 px-3 py-2.5 text-left text-lg font-medium leading-tight shadow-lg transition hover:bg-gray-800/40">
                      <Balancer>{resource.sectionTitle}</Balancer>
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
                      {resource.resourceList.map(
                        (item: Resource, itemIndex: number) => {
                          if ('sectionTitle' in item) {
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
                                        <Link href={lessonResource.path}>
                                          <a
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
                                          </a>
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
              ),
            )}
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
    download_url,
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

  const playlists = filter(course.items, {type: 'playlist'}) || []

  const playlistLessons = playlists.reduce((acc, playlist) => {
    const lessons = playlist?.lessons ?? []
    return [...acc, ...lessons]
  }, [])

  // this is a pretty sloppy approach to fetching the next lesson
  // via playlist lessons, but those are for nested playlists in
  // playlists
  const nextLesson: any = isEmpty(playlistLessons)
    ? first(
        lessons.filter(
          (lesson: LessonResource) =>
            !completedLessonSlugs.includes(lesson.slug),
        ),
      )
    : first(
        playlistLessons.filter(
          (lesson: LessonResource) =>
            !completedLessonSlugs.includes(lesson.slug),
        ),
      )

  const PlayButton: React.FunctionComponent<{lesson: LessonResource}> = ({
    lesson,
  }) => {
    const isContinuing =
      lesson && lesson !== first(lessons) && lesson !== first(playlistLessons)
    return lesson ? (
      <Link href={lesson.path}>
        <a
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
        </a>
      </Link>
    ) : null
  }

  const CourseArtwork: React.FunctionComponent<{
    path: string
    size: number
    trackText: string
  }> = ({path, size, trackText}) => {
    return path ? (
      <Link href={path}>
        <a
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
        </a>
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
                      <div>
                        {lessons.length + playlistLessons.length} lessons{' '}
                      </div>
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

                  {/* Download button */}
                  {download_url ? (
                    <Link href={download_url}>
                      <a
                        onClick={() => {
                          track(`clicked download course`, {
                            course: course.slug,
                          })
                        }}
                      >
                        <div className="flex flex-row items-center px-4 py-2 text-sm text-gray-600 transition-colors ease-in-out bg-white border border-gray-300 rounded shadow-sm dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 dark:bg-gray-800 dark:border-gray-600 xs:text-base">
                          <FolderDownloadIcon className="w-4 h-4 mr-1" />{' '}
                          Download
                        </div>
                      </a>
                    </Link>
                  ) : (
                    <MembershipDialogButton
                      buttonText="Download"
                      title="Become a member to download this course"
                    >
                      As an egghead member you can download any of our courses
                      and watch them offline.
                    </MembershipDialogButton>
                  )}

                  {/* RSS button */}
                  {rss_url ? (
                    <Link href={rss_url}>
                      <a
                        onClick={() => {
                          track(`clicked rss feed link`, {
                            course: course.slug,
                          })
                        }}
                      >
                        <div className="flex flex-row items-center px-4 py-2 text-sm text-gray-600 transition-colors ease-in-out bg-white border border-gray-300 rounded shadow-sm dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 dark:bg-gray-800 dark:border-gray-600 xs:text-base">
                          <RSSIcon className="w-4 h-4 mr-1" /> RSS
                        </div>
                      </a>
                    </Link>
                  ) : (
                    <a
                      onClick={() => {
                        track(`clicked disabled rss feed link`, {
                          course: course.slug,
                        })
                      }}
                    >
                      <MembershipDialogButton
                        buttonText="RSS"
                        title="Become a member to access RSS feeds"
                      >
                        As an egghead member you can subscribe to any of our
                        courses using an RSS feed.
                      </MembershipDialogButton>
                    </a>
                  )}
                </div>
                {/* End of action buttons block */}

                <div className="flex items-center justify-center w-full mt-5 md:hidden">
                  <PlayButton lesson={nextLesson} />
                </div>
                <Markdown
                  allowDangerousHtml
                  className="mb-6 prose text-gray-900 dark:prose-dark md:prose-lg md:dark:prose-lg-dark dark:text-gray-100 dark:prose-a:text-blue-300 dark:hover:prose-a:text-blue-200 prose-a:text-blue-500 hover:prose-a-:text-blue-600 mt-14"
                >
                  {description}
                </Markdown>
                <section className="mb-6 prose text-gray-900 dark:prose-dark md:prose-lg md:dark:prose-lg-dark dark:text-gray-100 dark:prose-a:text-blue-300 dark:hover:prose-a:text-blue-200 prose-a:text-blue-500 hover:prose-a-:text-blue-600 mt-14">
                  <h2>You'll learn</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <ul className="list-disc">
                      <li>Building fetch requests for the OpenAI API</li>
                      <li>OpenAI’s models</li>
                      <li>OpenAI tools</li>
                      <li>The Create Completions endpoint</li>
                      <li>Prompt engineering</li>
                      <li>The ‘zero shot’ approach</li>
                      <li>The ‘few shot’ approach</li>
                      <li>The temperature property</li>
                      <li>The Create Image endpoint</li>
                      <li>Building chatbots</li>
                    </ul>
                    <ul className="list-disc">
                      <li>Chatbot specific prompt syntax</li>
                      <li>The Create Chat Completions endpoint</li>
                      <li>Frequency Penalty</li>
                      <li>Presence Penalty</li>
                      <li>Controlling a chatbot’s personality</li>
                      <li>Persisting the chat with Firebase</li>
                      <li>Fine-tuning</li>
                      <li>n_epochs</li>
                      <li>The Stop Sequence</li>
                      <li>Deploying with API key hidden</li>
                    </ul>
                  </div>
                  <h2>You'll build</h2>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Image
                        src="https://res.cloudinary.com/dg3gyk0gu/image/upload/v1686947262/course-resources/build-ai-apps-with-chatgpt-dall-e-and-gpt-4-42d767cc/moviepitch3.png"
                        alt="screenshot"
                        width={285}
                        height={366}
                      />
                      <h5 className="font-bold">MoviePitch</h5>
                      <p>
                        Turn a one sentence idea into a synopsis for a movie
                        with a title, cast and cover art!
                      </p>
                    </div>
                    <div>
                      <Image
                        src="https://res.cloudinary.com/dg3gyk0gu/image/upload/v1686947260/course-resources/build-ai-apps-with-chatgpt-dall-e-and-gpt-4-42d767cc/knowitall5.png"
                        alt="screenshot"
                        width={285}
                        height={366}
                      />
                      <h5 className="font-bold">KnowItAll Chatbot</h5>
                      <p>An ask-me-anything chatbot built with GPT-4.</p>
                    </div>
                    <div>
                      <Image
                        src="https://res.cloudinary.com/dg3gyk0gu/image/upload/v1686947258/course-resources/build-ai-apps-with-chatgpt-dall-e-and-gpt-4-42d767cc/wewingit3.png"
                        alt="screenshot"
                        width={285}
                        height={366}
                      />
                      <h5 className="font-bold">
                        We-Wingit Drone Deliveries Chatbot
                      </h5>
                      <p>
                        A chatbot fine-tuned to answer questions using our own
                        specific dataset.
                      </p>
                    </div>
                  </div>
                  <div>
                    <h2>FAQ</h2>
                    <h3>What is AI?</h3>
                    <p>
                      AI (artificial intelligence) is like having a super-smart
                      computer buddy who can do things that humans normally do,
                      like recognize pictures of cats or tell you what the
                      weather is like outside. They're kind of like a cross
                      between R2-D2 and Hermione Granger - nerdy, helpful, and
                      always up for a challenge! Just don't expect them to have
                      feelings or opinions on whether pineapple belongs on
                      pizza.
                    </p>
                    <h3>There are two chatbots in this course?</h3>
                    <p>
                      Yes, this course contains two chatbots. From the outside
                      they look similar but they are in fact completely
                      different. The first (KnowItAll) uses the new GPT-4 model
                      which is mind-blowing for general Q and A tasks and
                      natural language generation. The second (We-Wingit) is
                      fine-tuned to answer questions from our own dataset. This
                      skill is useful for aspiring web developers who want their
                      chatbot (or any other AI app) to have a specific focus.
                    </p>
                    <h3>What is the OpenAI API?</h3>
                    <p>
                      The OpenAI API gives us access to AI models in our apps.
                      By interacting with the API, we can leverage the power of
                      these AI models to perform a wide range of tasks, such as
                      natural language understanding, text generation, image
                      generation, and more.
                    </p>
                  </div>
                </section>
                <div className="block pt-5 md:hidden">
                  {get(course, 'access_state') === 'free' && (
                    <div className="p-4 my-8 border border-gray-100 rounded-md bg-gray-50 dark:border-gray-800 dark:bg-gray-800">
                      <CommunityResource type="course" />
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
                    <CommunityResource type="course" />
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
