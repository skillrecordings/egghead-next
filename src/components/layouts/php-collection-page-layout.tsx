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
import CheckIcon from '../icons/check'
import {LessonResource} from 'types'
import BookmarkIcon from '../icons/bookmark'
import axios from 'utils/configured-axios'
import friendlyTime from 'friendly-time'
import LearnerRatings from '../pages/courses/learner-ratings'
import CommunityResource from 'components/community-resource'
import TagList from './tag-list'
import DialogButton from '../pages/courses/dialog-button'
import MembershipDialogButton from '../pages/courses/membership-dialog-button'

import {
  logCollectionResource,
  Duration,
  PeopleCompleted,
  StarsRating,
  PublishedAt,
  UpdatedAt,
} from './collection-page-layout'

import LoginForm from 'pages/login'

type CoursePageLayoutProps = {
  lessons: any
  course: any
  ogImageUrl: string
}

type ModuleResource = {
  type: 'module'
  resourceList: ResourceList
  title: string
  description: string
}

type NestedResource = ModuleResource | LessonResource

type ResourceList = Array<NestedResource>

const LessonLinkResource = ({
  lesson,
  completedLessonSlugs,
  index,
}: {
  lesson: LessonResource
  completedLessonSlugs: string[]
  index: number
}) => {
  const isComplete = completedLessonSlugs.includes(lesson.slug)
  return (
    <li>
      <div className="flex py-2 font-semibold leading-tight h-20">
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
              index + 1
            )}
          </div>
          {lesson.icon_url && (
            <div className="flex items-center flex-shrink-0 w-8">
              <Image src={lesson.icon_url} width={24} height={24} />
            </div>
          )}
        </div>
        {lesson.path && (
          <div className="flex flex-col ">
            <div>
              <Link href={lesson.path}>
                <a className="text-lg font-semibold hover:underline hover:text-blue-600 dark:text-gray-100">
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
}

const ModuleCollection = ({
  module,
  children,
}: {
  module: ModuleResource
  children: any
}) => {
  return (
    <div>
      <h2 className="text-xl font-bold mt-4 mb-2 sm:mx-0 mx-auto w-fit">
        {module.title}
      </h2>
      <div>
        <p className="mb-6 prose text-gray-900 dark:prose-dark md:prose-lg md:dark:prose-lg-dark dark:text-gray-100 dark:prose-a:text-blue-300 dark:hover:prose-a:text-blue-200 prose-a:text-blue-500 hover:prose-a-:text-blue-600 ">
          {module.description}
        </p>
        <ul
          className="grid sm:grid-flow-col gap-4"
          style={{
            gridTemplateRows: `repeat(${Math.ceil(
              module.resourceList.length / 2,
            )}, minmax(0, 1fr))`,
          }}
        >
          {children}
        </ul>
      </div>
    </div>
  )
}

const ResourceCollection = ({
  resourceList,
  completedLessonSlugs,
}: {
  resourceList: ResourceList
  completedLessonSlugs: string[]
}) => {
  return (
    <>
      {resourceList.map((resource: NestedResource, index: number) => {
        switch (resource.type) {
          case 'module':
            const nestedModuleResourceList = resource.resourceList
            return (
              <ModuleCollection key={`module-${index}`} module={resource}>
                <ResourceCollection
                  resourceList={nestedModuleResourceList}
                  completedLessonSlugs={completedLessonSlugs}
                />
              </ModuleCollection>
            )
          case 'lesson':
            return (
              <LessonLinkResource
                key={`lesson-${index}`}
                lesson={resource}
                index={index}
                completedLessonSlugs={completedLessonSlugs}
              />
            )
          default:
            return null
        }
      })}
    </>
  )
}

const PhpCollectionPageLayout: React.FunctionComponent<CoursePageLayoutProps> =
  ({lessons = [], course, ogImageUrl}) => {
    const courseDependencies: any = getDependencies(course.slug)
    const [isFavorite, setIsFavorite] = React.useState(false)
    const [clickable, setIsClickable] = React.useState(true)

    // Manually slicing lessons into modules
    const resourceCollection: ModuleResource[] = [
      {
        type: 'module',
        title: 'Project Setup',
        resourceList: lessons.slice(0, 3),
        description:
          'Before you can get started with PHP, you will need to install it, set up an IDE, and get your server running.',
      },
      {
        type: 'module',
        title: 'Tags',
        resourceList: lessons.slice(3, 7),
        description:
          'Tags are a fundamental syntax in PHP. In this module you\'ll learn how to open and close them, the importance of ending your statements with a semicolon, and even a short-hand for the commonly used "echo" tag.',
      },
      {
        type: 'module',
        title: 'Variables and Constants',
        resourceList: lessons.slice(7, 15),
        description:
          "Here, you will be learning how to create variables and constants, as well as learning the basics of PHP's type system. Like JavaScript, PHP features type coercion, which can be frustrating for new-to-PHP developers. But, we will exploring this so you can learn how to avoid some common mistakes",
      },
      {
        type: 'module',
        title: 'Conditionals',
        resourceList: lessons.slice(15, 21),
        description:
          "In this module, you will learn how to use conditionals to control the flow of your code. We will be covering a couple of ways to use if/else, switch statements, and PHP's match statement",
      },
      {
        type: 'module',
        title: 'Arrays and Loops',
        resourceList: lessons.slice(21, 29),
        description:
          "In this module, we will be exploring PHP's control flow even further with loops. We will also be exploring array features and iteration.",
      },
      {
        type: 'module',
        title: 'Functions',
        resourceList: lessons.slice(29, 37),
        description:
          'Grouping your code into functions is a great way to keep your code organized and reusable. In this module, you will learn how to create and use functions, how the type system applies here, how scope works, and how to use functions in other files with include/require',
      },
      {
        type: 'module',
        title: 'Classes',
        resourceList: lessons.slice(37, 46),
        description:
          'Classes are the core of object-oriented programming in PHP. In this module, you will learn how to create classes, refactor functions into classes, and even replace all of your require statements with the Composer class autoloader.',
      },
    ]

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
      : courseDependencies.illustrator

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
                `clicked ${
                  isContinuing ? 'continue' : 'start'
                } watching course`,
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
            <div className="flex flex-row left-0 grid w-full grid-cols-1 gap-5 mt-10 mb-4 rounded-md md:grid-cols-5 md:gap-16">
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
                        access_state === 'free'
                          ? 'bg-orange-500'
                          : 'bg-blue-500'
                      } text-white w-12 items-center text-center py-1 rounded-full uppercase font-bold my-2 text-xs mx-auto md:m-0 md:mb-2`}
                    >
                      {access_state}
                    </div>
                  )}
                  <h1 className="mt-4 text-2xl font-bold leading-tight text-center sm:text-3xl md:text-4xl md:leading-tighter md:text-left md:mt-0">
                    {title}
                  </h1>

                  {/* Start of metadata block */}
                  <div className="flex flex-col items-center my-6 space-y-2 md:items-start">
                    {instructor && (
                      <InstructorProfile
                        name={name}
                        avatar_url={avatar_url}
                        url={slug}
                        bio_short={bio_short}
                        twitter={twitter}
                      />
                    )}
                    <div className="flex flex-col flex-wrap items-center pt-2 md:flex-row">
                      <TagList
                        tags={sanityTagsPresent() ? sanityTags : railsTags}
                        courseSlug={course.slug}
                      />
                      <div className="flex items-center justify-center md:justify-start md:mr-4">
                        {duration && (
                          <div className="mt-2 mr-4 md:mt-0">
                            <Duration
                              duration={convertTimeWithTitles(duration)}
                            />
                          </div>
                        )}
                        {lessons.length + playlistLessons.length} lessons{' '}
                      </div>
                    </div>

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

                    <div className="flex flex-row space-x-3 text-sm opacity-80 md:items-start">
                      {created_at && (
                        <PublishedAt
                          date={friendlyTime(new Date(created_at))}
                        />
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
                              `clicked ${
                                isFavorite ? 'remove' : 'add'
                              } bookmark`,
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
                            You need to be signed in to bookmark courses. Sign
                            in or create a free account to save this course.
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
                  <div className="block pt-5 md:hidden">
                    {get(course, 'access_state') === 'free' && (
                      <div className="p-4 my-8 border border-gray-100 rounded-md bg-gray-50 dark:border-gray-800 dark:bg-gray-800">
                        <CommunityResource type="course" />
                      </div>
                    )}
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
                </div>
              </div>
            </div>
            <div className={'flex flex-row grid grid-rows-1'}>
              <div className="mx-auto ">
                {/*start of instructor block*/}
                <section className="my-8">
                  <h2 className="text-xl font-bold mb-4 sm:mx-0 mx-auto w-fit">
                    Meet the Instructor
                  </h2>
                  <div className="flex flex-row justify-between">
                    <div>
                      <div className="flex justify-center md:hidden mb-4">
                        <Image
                          className="rounded-full ml-4 justify-center"
                          src={avatar_url}
                          layout="fixed"
                          width="200"
                          height="200"
                          alt={`${name}'s avatar`}
                        />
                      </div>
                      <h2 className="font-semibold text-lg pb-4 sm:mx-0 mx-auto w-fit">
                        Hi, I'm Mark Shust
                      </h2>
                      <p className="mb-2 prose text-gray-900 dark:prose-dark md:prose-lg md:dark:prose-lg-dark dark:text-gray-100 dark:prose-a:text-blue-300 dark:hover:prose-a:text-blue-200 prose-a:text-blue-500 hover:prose-a-:text-blue-600 ">
                        I have over 20 years of web development experience, and
                        has been working with PHP for about as long. Soon after
                        starting development, I became extremely interested and
                        involved in open source programming, diving into various
                        PHP frameworks over the years including OSCommerce,
                        Drupal, and Laravel.
                      </p>
                      <p className="mb-6 prose text-gray-900 dark:prose-dark md:prose-lg md:dark:prose-lg-dark dark:text-gray-100 dark:prose-a:text-blue-300 dark:hover:prose-a:text-blue-200 prose-a:text-blue-500 hover:prose-a-:text-blue-600 ">
                        I'm excited to bring you a comprehensive introduction
                        course on PHP, and I hope you enjoy it!
                      </p>
                    </div>
                    <div className="flex lg:scale-100 md:scale-75 justify-center items-center hidden md:block xl:pr-12">
                      <Image
                        className="rounded-full ml-4 justify-center"
                        src={avatar_url}
                        layout="fixed"
                        width="300"
                        height="300"
                        alt={`${name}'s avatar`}
                      />
                    </div>
                  </div>
                </section>
                {/*end of instructor block*/}
                {/*Start of lessons block*/}
                <ResourceCollection
                  resourceList={resourceCollection}
                  completedLessonSlugs={completedLessonSlugs}
                />
                {/*End of lessons block*/}
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

export default PhpCollectionPageLayout
