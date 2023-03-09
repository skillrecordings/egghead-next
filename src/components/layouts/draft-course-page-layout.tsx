import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Markdown from 'react-markdown'
import InstructorProfile from 'components/pages/courses/instructor-profile'
import PlayIcon from 'components/pages/courses/play-icon'
import {
  PencilAltIcon,
  XCircleIcon,
  CheckCircleIcon,
  PlusCircleIcon,
} from '@heroicons/react/outline'
import {get, first, filter, isEmpty, truncate} from 'lodash'
import {NextSeo} from 'next-seo'
import removeMarkdown from 'remove-markdown'
import {track} from 'utils/analytics'
import {convertTimeWithTitles} from 'utils/time-utils'
import ClockIcon from '../icons/clock'
import {LessonResource} from 'types'
import LearnerRatings from '../pages/courses/learner-ratings'
import CommunityResource from 'components/community-resource'
import TagList from './tag-list'
import {useTheme} from 'next-themes'
import ClosedCaptionIcon from '../icons/closed-captioning'
import {HorizontalResourceCard} from '../card/horizontal-resource-card'
import {Formik} from 'formik'
import {useMachine} from '@xstate/react'
import {
  requestDraftCourseChangeMachine,
  DoneEventObject,
} from 'machines/draft-course-machine'
import {trpc} from 'trpc/trpc.client'
import toast from 'react-hot-toast'

type CoursePageLayoutProps = {
  lessons: any
  course: any
  ogImageUrl: string
}

type CollectionResource = {
  title: string
  duration: number
  instructor: {
    full_name: string
  }
  square_cover_url: string
  image_url: string
  path: string
  slug: string
  description: string
}

export const logCollectionResource = (collection: CollectionResource) => {
  if (typeof window !== 'undefined') {
    const {
      title,
      duration,
      instructor,
      square_cover_url,
      image_url,
      path,
      slug,
      description,
    } = collection
    const image = square_cover_url || image_url
    const formattedDuration = convertTimeWithTitles(duration)
    const byline = `${
      instructor?.full_name && `${instructor.full_name}・`
    }${formattedDuration}・Course`

    console.debug('collection resource', {
      title,
      byline,
      ...(!!image && {image}),
      path,
      slug,
      description,
    })
  }
}

export const Duration: React.FunctionComponent<{duration: string}> = ({
  duration,
}) => (
  <div className="flex flex-row items-center">
    <ClockIcon className="w-4 h-4 mr-1 opacity-60" />
    <span>{duration}</span>{' '}
    <ClosedCaptionIcon className="inline-block w-4 h-4 ml-2" />
  </div>
)

const TitleChangeForm: React.FunctionComponent<RequestDraftCourseFormProps> = ({
  title,
  sanityCourseId,
}) => {
  const [state, send] = useMachine(requestDraftCourseChangeMachine, {
    services: {
      requestChange: (_, event: DoneEventObject) => {
        return updateCourseTitleMutation.mutateAsync({
          title: event.data.title,
          id: sanityCourseId,
        })
      },
    },
  })
  const updateCourseTitleMutation =
    trpc.instructor.updateDraftCourseTitle.useMutation<{
      title: string
      id: string
    }>({
      onSuccess: (data) => {
        toast.success(`Your course title has been updated.`, {
          duration: 6000,
          icon: '✅',
        })
      },
      onError: (error) => {
        toast.error(
          `There was a problem updating your course title. Contact egghead staff if the issue persists.`,
          {
            duration: 6000,
            icon: '❌',
          },
        )
      },
    })
  let currentTitle = state.context.title ? state.context.title : title
  return (
    <Formik
      initialValues={{title: currentTitle}}
      // validationSchema={emailChangeSchema}
      onSubmit={async (values) => {
        send({type: 'SUBMIT', data: {title: values.title}})
      }}
    >
      {(props) => {
        const {
          values,
          isSubmitting,
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
        } = props
        return (
          <form className="grow" onSubmit={handleSubmit}>
            <div className="flex flex-col">
              <div className="relative flex flex-col sm:flex-row sm:space-y-0 sm:space-x-2 text-center sm:text-left">
                {state.matches('edit') || state.matches('loading') ? (
                  <div className="container w-full px-0">
                    <div className="flex flex-row-reverse gap-2 absolute -top-6 right-4 z-10">
                      <button
                        type="button"
                        onClick={() => {
                          setFieldValue('title', currentTitle)
                          send({type: 'CANCEL'})
                        }}
                      >
                        <XCircleIcon className="text-red-400" height={20} />
                      </button>
                      <button type="submit" disabled={isSubmitting}>
                        <CheckCircleIcon
                          className="text-green-400"
                          height={20}
                        />
                      </button>
                    </div>
                    <textarea
                      rows={3}
                      maxLength={90}
                      id="title"
                      value={state.matches('edit') ? values.title : title}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      disabled={isSubmitting || !state.matches('edit')}
                      className="p-2 text-2xl font-bold leading-tight text-center sm:text-3xl md:text-4xl md:leading-tighter md:text-left md:mt-0 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:shadow-outline border border-gray-100 dark:border-gray-700 rounded-md w-full max-w-[34ch] break-normal"
                    />
                  </div>
                ) : (
                  <>
                    <div className="container relative px-0">
                      <PencilAltIcon
                        height={20}
                        className="absolute -top-6 right-4 z-10 text-gray-400 cursor-pointer"
                        onClick={() => send({type: 'EDIT'})}
                      />
                      <h1 className="p-2 mt-4 text-2xl font-bold leading-tight text-center sm:text-3xl md:text-4xl md:leading-tighter md:text-left md:mt-0">
                        {currentTitle}
                      </h1>
                    </div>
                  </>
                )}
              </div>
            </div>
          </form>
        )
      }}
    </Formik>
  )
}

export type RequestDraftCourseFormProps = {
  description?: string
  title?: string
  sanityCourseId: string
}

const DescriptionChangeForm: React.FunctionComponent<RequestDraftCourseFormProps> =
  ({description, sanityCourseId}) => {
    const [state, send] = useMachine(requestDraftCourseChangeMachine, {
      services: {
        requestChange: (_, event: DoneEventObject) => {
          return updateCourseDescriptionMutation.mutateAsync({
            description: event.data.description,
            id: sanityCourseId,
          })
        },
      },
    })
    const updateCourseDescriptionMutation =
      trpc.instructor.updateDraftCourseDescription.useMutation<{
        description: string
        id: string
      }>({
        onSuccess: (data) => {
          toast.success(`Your course description has been updated.`, {
            duration: 6000,
            icon: '✅',
          })
        },
        onError: (error) => {
          toast.error(
            `There was a problem updating your course description. Contact egghead staff if the issue persists.`,
            {
              duration: 6000,
              icon: '❌',
            },
          )
        },
      })

    let currentDescription = state.context.description
      ? state.context.description
      : description

    return (
      <Formik
        initialValues={{description: currentDescription}}
        // validationSchema={emailChangeSchema}
        onSubmit={async (values) => {
          send({type: 'SUBMIT', data: {description: values.description}})
        }}
      >
        {(props) => {
          const {
            values,
            isSubmitting,
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
          } = props
          return (
            <form className="grow" onSubmit={handleSubmit}>
              <div className="flex flex-col">
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2o">
                  {state.matches('edit') || state.matches('loading') ? (
                    <div className="relative w-full">
                      <div className="flex flex-row-reverse gap-2 absolute top-4 right-2 z-10">
                        <button
                          type="button"
                          onClick={() => {
                            setFieldValue('description', currentDescription)
                            send({type: 'CANCEL'})
                          }}
                        >
                          <XCircleIcon className="text-red-400" height={20} />
                        </button>
                        <button type="submit" disabled={isSubmitting}>
                          <CheckCircleIcon
                            className="text-green-400"
                            height={20}
                          />
                        </button>
                      </div>
                      <textarea
                        rows={20}
                        id="description"
                        value={
                          state.matches('edit')
                            ? values.description
                            : description
                        }
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        disabled={isSubmitting || !state.matches('edit')}
                        className="bg-gray-50 dark:bg-gray-800 focus:outline-none focus:shadow-outline border border-gray-100 dark:border-gray-700 rounded-md py-2 px-4 block w-full appearance-none leading-normal resize-y prose text-gray-900 dark:prose-dark md:prose-lg md:dark:prose-lg-dark dark:text-gray-100 dark:prose-a:text-blue-300 dark:hover:prose-a:text-blue-200 prose-a:text-blue-500 hover:prose-a-:text-blue-600 mt-14"
                      />
                    </div>
                  ) : (
                    <>
                      <div className="container relative px-0">
                        <PencilAltIcon
                          height={20}
                          className="absolute top-4 right-2 z-10 text-gray-400 cursor-pointer"
                          onClick={() => send({type: 'EDIT'})}
                        />
                        {currentDescription && (
                          <Markdown
                            allowDangerousHtml
                            className="mb-6 mt-14 prose text-gray-900 dark:prose-dark md:prose-lg md:dark:prose-lg-dark dark:text-gray-100 dark:prose-a:text-blue-300 dark:hover:prose-a:text-blue-200 prose-a:text-blue-500 hover:prose-a-:text-blue-600"
                          >
                            {currentDescription}
                          </Markdown>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </form>
          )
        }}
      </Formik>
    )
  }

const DraftCourseLayout: React.FunctionComponent<CoursePageLayoutProps> = ({
  lessons = [],
  course,
  ogImageUrl,
}) => {
  const {
    id: sanityCourseId,
    title,
    image_thumb_url,
    square_cover_480_url,
    instructor,
    description,
    duration,
    access_state,
    customOgImage,
    pairWithResources,
    state,
    path,
    tags,
    relatedResources,
  } = course

  const ogImage = customOgImage ? customOgImage.url : ogImageUrl

  const podcast = first(
    course?.items?.filter((item: any) => item.type === 'podcast'),
  )

  logCollectionResource(course)

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
  const nextLesson: any = first(playlistLessons) || first(lessons)

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

  return (
    <>
      <NextSeo
        description={truncate(removeMarkdown(description), {length: 155})}
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
          description: truncate(removeMarkdown(description), {length: 155}),
          site_name: 'egghead',
          images: [
            {
              url: ogImage,
            },
          ],
        }}
      />
      <div className="container pb-8 sm:pb-16 dark:text-gray-100">
        <div className="left-0 grid w-full grid-cols-1 gap-5 mt-10 mb-4 rounded-md md:grid-cols-5 md:gap-16">
          <div className="flex flex-col w-full h-full mx-auto md:col-span-3 md:row-start-auto max-w-screen-2xl">
            <header>
              {image_url && (
                <div className="flex items-center justify-center md:hidden">
                  <CourseArtwork
                    path={nextLesson?.path}
                    trackText="clicked course image on mobile"
                    size={imageIsTag ? 100 : 200}
                  />
                </div>
              )}
              <div className="flex justify-center my-2 space-x-3 md:justify-start md:m-0 md:mb-2">
                {access_state && (
                  <div
                    className={`${
                      access_state === 'free' ? 'bg-orange-500' : 'bg-blue-500'
                    } text-white items-center text-center py-1 px-2 rounded-full uppercase font-bold text-xs cursor-default`}
                  >
                    {access_state}
                  </div>
                )}
                <div
                  className="items-center px-2 py-1 text-xs font-bold text-center text-white uppercase bg-orange-500 rounded-full cursor-default"
                  title="Draft Course"
                >
                  Draft
                </div>
              </div>

              <TitleChangeForm title={title} sanityCourseId={sanityCourseId} />

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
                  <TagList tags={tags} courseSlug={course.slug} />
                  <div className="flex items-center justify-center md:justify-start space-x-2">
                    {duration && (
                      <Duration duration={convertTimeWithTitles(duration)} />
                    )}
                    <span>&middot;</span>
                    <div className="flex items-center space-x-1">
                      <span>
                        {lessons.length + playlistLessons.length} lessons
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              {/* End of metadata block */}

              <div className="flex items-center justify-center w-full mt-5 md:hidden">
                <PlayButton lesson={nextLesson} />
              </div>

              <DescriptionChangeForm
                description={description}
                sanityCourseId={sanityCourseId}
              />

              <div className="block pt-5 md:hidden">
                {get(course, 'access_state') === 'free' && (
                  <div className="p-4 my-8 border border-gray-100 rounded-md bg-gray-50 dark:border-gray-800 dark:bg-gray-800">
                    <CommunityResource type="course" />
                  </div>
                )}
              </div>
              {!isEmpty(podcast) && (
                <CoursePodcast podcast={podcast} instructorName={name} />
              )}
              <LearnerRatings collection={course} />
              {!isEmpty(relatedResources) && (
                <div className="flex-col hidden my-12 space-y-2 md:flex">
                  <h2 className="mb-3 text-lg font-semibold">
                    You might also like these resources:
                  </h2>
                  {relatedResources.map((resource: any) => {
                    return (
                      <div key={resource.title}>
                        <HorizontalResourceCard
                          className="my-4 border border-gray-400 border-opacity-10 dark:border-gray-700"
                          resource={resource}
                          location={course.path}
                        />
                      </div>
                    )
                  })}
                </div>
              )}
            </header>
          </div>
          <div className="flex flex-col items-center justify-start mb-4 md:col-span-2 md:mb-0">
            {image_url && (
              <div className="hidden md:block">
                <CourseArtwork
                  path={nextLesson?.path}
                  size={imageIsTag ? 200 : 420}
                  trackText="clicked course image"
                />
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
            </div>
            <section className="mt-8">
              <div className="flex flex-col mb-2 space-y-4 ">
                <div className="flex flex-row gap-4">
                  <h2 className="text-xl font-bold">Course Content</h2>
                  <button className="w-10 h-8 bg-slate-100 hover:bg-slate-200 rounded text-slate-600 flex justify-center place-self-center">
                    <PlusCircleIcon
                      className=" place-self-center"
                      height={20}
                    />
                  </button>
                </div>

                <div className="text-sm font-normal text-gray-600 dark:text-gray-300">
                  {duration && `${convertTimeWithTitles(duration)} • `}
                  {lessons.length + playlistLessons.length} lessons{' '}
                </div>
              </div>
              <div>
                <ul>
                  {playlists.map((playlist: any) => {
                    return (
                      <li key={playlist.slug}>
                        <div className="flex items-center py-2 font-semibold leading-tight">
                          {playlist.path && (
                            <Link href={playlist.path}>
                              <a
                                onClick={() => {
                                  track(
                                    `clicked collection link on course page`,
                                    {
                                      course: course.slug,
                                      collection: playlist.slug,
                                    },
                                  )
                                }}
                                className="flex items-center w-full font-semibold hover:underline"
                              >
                                <Markdown className="mt-0 prose text-gray-900 dark:prose-dark md:dark:prose-lg-dark md:prose-lg dark:text-gray-100">
                                  {playlist.title}
                                </Markdown>
                              </a>
                            </Link>
                          )}
                        </div>
                        <div>
                          <ul className="ml-8">
                            {playlist?.lessons?.map(
                              (lesson: LessonResource, index: number) => {
                                return (
                                  <li key={`${playlist.slug}::${lesson.slug}`}>
                                    <div className="flex items-center py-2 leading-tight">
                                      <div className="flex items-center flex-grow mr-2">
                                        <PlayIcon className="mx-1 text-gray-500 dark:text-gray-100" />
                                      </div>
                                      {lesson.path && (
                                        <Link href={lesson.path}>
                                          <a
                                            onClick={() => {
                                              track(
                                                `clicked collection video link on course page`,
                                                {
                                                  course: course.slug,
                                                  video: lesson.slug,
                                                  collection: playlist.slug,
                                                },
                                              )
                                            }}
                                            className="flex items-center w-full hover:underline"
                                          >
                                            <Markdown className="mt-0 prose text-gray-700 dark:prose-dark md:dark:prose-lg-dark md:prose-lg dark:text-gray-100">
                                              {lesson.title}
                                            </Markdown>
                                          </a>
                                        </Link>
                                      )}
                                    </div>
                                  </li>
                                )
                              },
                            )}
                          </ul>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </div>

              <div>
                <ul>
                  {lessons.map((lesson: LessonResource, index: number) => {
                    return (
                      <li key={lesson.slug}>
                        <div className="flex py-2 font-semibold leading-tight">
                          <div className="flex items-center mr-2 space-x-2">
                            {lesson.icon_url && (
                              <div className="flex items-center flex-shrink-0 w-8">
                                <Image
                                  src={lesson.icon_url}
                                  width={24}
                                  height={24}
                                />
                              </div>
                            )}
                          </div>
                          {lesson.path && (
                            <div className="flex flex-col ">
                              <div>
                                <Link href={lesson.path}>
                                  <a
                                    onClick={() => {
                                      track(
                                        `clicked video link on course page`,
                                        {
                                          course: course.slug,
                                          video: lesson.slug,
                                        },
                                      )
                                    }}
                                    className="text-lg font-semibold hover:underline hover:text-blue-600 dark:text-gray-100"
                                  >
                                    {lesson.title}
                                  </a>
                                </Link>
                              </div>
                              <div className="text-xs text-gray-700 dark:text-gray-500">
                                {convertTimeWithTitles(lesson.duration, {
                                  showSeconds: true,
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      </li>
                    )
                  })}
                </ul>
                <button className="w-full h-10 bg-slate-100 hover:bg-slate-200 rounded text-slate-600 flex justify-center">
                  <PlusCircleIcon className=" place-self-center" height={20} />
                </button>
              </div>
            </section>
            {!isEmpty(pairWithResources) && (
              <div className="flex flex-col my-12 space-y-2 md:hidden">
                <h2 className="mb-3 text-lg font-semibold">
                  You might also like these resources:
                </h2>
                {pairWithResources.map((resource: any) => {
                  return (
                    <div key={resource.slug}>
                      <HorizontalResourceCard
                        className="my-4 border border-gray-400 border-opacity-10 dark:border-gray-500"
                        resource={resource}
                        location={course.path}
                      />
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

const CoursePodcast = ({
  podcast: {transcript, simplecast_uid: id},
  instructorName,
}: any) => {
  const [isOpen, setOpen] = React.useState(false)
  const {theme} = useTheme()

  if (isEmpty(id)) {
    return null
  } else {
    return (
      <div className="w-full pt-2 pb-3">
        <h3 className="my-2 text-xl font-semibold">
          {`Listen to ${instructorName} tell you about this course:`}{' '}
          {transcript && (
            <span>
              <button onClick={() => setOpen(!isOpen)}>
                {isOpen ? 'Hide Transcript' : 'Show Transcript'}
              </button>
            </span>
          )}
        </h3>
        <iframe
          height="52px"
          width="100%"
          frameBorder="no"
          scrolling="no"
          title="Podcast Player"
          seamless
          src={`https://player.simplecast.com/${id}?dark=${
            theme === 'dark'
          }&color=${theme === 'dark' && '111827'}`}
        />
        {isOpen && transcript && (
          <Markdown className="bb b--black-10 pb3 lh-copy">
            {transcript}
          </Markdown>
        )}
      </div>
    )
  }
}

export default DraftCourseLayout
