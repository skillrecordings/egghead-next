import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Markdown from 'react-markdown'
import toast from 'react-hot-toast'
import InstructorProfile from 'components/pages/courses/instructor-profile'
import PlayIcon from 'components/pages/courses/play-icon'
import getDependencies from 'data/courseDependencies'
import {get, first, filter, isEmpty, take, find} from 'lodash'
import {NextSeo} from 'next-seo'
import removeMarkdown from 'remove-markdown'
import {track} from 'utils/analytics'
import FolderDownloadIcon from '../icons/folder-download'
import RSSIcon from '../icons/rss'
import {convertTimeWithTitles} from 'utils/time-utils'
import ClockIcon from '../icons/clock'
import CheckIcon from '../icons/check'
import {LessonResource} from 'types'
import BookmarkIcon from '../icons/bookmark'
import axios from 'utils/configured-axios'
import friendlyTime from 'friendly-time'
import LearnerRatings from '../pages/courses/learner-ratings'
import FiveStars from '../five-stars'
import CommunityResource from 'components/community-resource'
import TagList from './tag-list'
import {useTheme} from 'next-themes'
import ClosedCaptionIcon from '../icons/closed-captioning'
import {HorizontalResourceCard} from '../card/horizontal-resource-card'
import ExternalTrackedLink from 'components/external-tracked-link'
import DialogButton from '../pages/courses/dialog-button'
import MembershipDialogButton from '../pages/courses/membership-dialog-button'

import LoginForm from 'pages/login'
import {useCoursePresence} from '../../hooks/use-course-presence'

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

const logCollectionResource = (collection: CollectionResource) => {
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

const Duration: React.FunctionComponent<{duration: string}> = ({duration}) => (
  <div className="flex flex-row items-center">
    <ClockIcon className="w-4 h-4 mr-1 opacity-60" />
    <span>{duration}</span>{' '}
    <ClosedCaptionIcon className="inline-block w-4 h-4 ml-2" />
  </div>
)

export const UpdatedAt: React.FunctionComponent<{date: string}> = ({date}) => (
  <div>Updated {date}</div>
)

export const PublishedAt: React.FunctionComponent<{date: string}> = ({
  date,
}) => <div>Published {date}</div>

const StarsRating: React.FunctionComponent<{
  rating: number
}> = ({rating}) => (
  <div className="flex items-center">
    <FiveStars rating={rating} />
    <span className="ml-1 font-semibold leading-tight">
      {rating.toFixed(1)}
    </span>
  </div>
)

const PeopleCompleted: React.FunctionComponent<{count: number}> = ({count}) => (
  <div className="flex items-center flex-nowrap">
    <div className="mr-1 font-semibold">{count}</div>
    <div className="whitespace-nowrap">people completed</div>
  </div>
)

const CollectionPageLayout: React.FunctionComponent<CoursePageLayoutProps> = ({
  lessons = [],
  course,
  ogImageUrl,
}) => {
  const courseDependencies: any = getDependencies(course.slug)
  const [isFavorite, setIsFavorite] = React.useState(false)
  const [clickable, setIsClickable] = React.useState(true)

  const count = useCoursePresence(course.slug)

  React.useEffect(() => {
    if (count) console.log(`${count} learners watching this course right now`)
  }, [count])

  const defaultPairWithResources: any[] = take(
    [
      {
        title: 'Introduction to Cloudflare Workers',
        byline: 'Kristian Freeman・36m・Course',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/418/892/thumb/EGH_IntroCloudFlareWorkers_Final.png',
        path: '/playlists/introduction-to-cloudflare-workers-5aa3',
        slug: 'introduction-to-cloudflare-workers-5aa3',
        description:
          "Become familiar with the Workers CLI `wrangler` that we will use to bootstrap our Worker project. From there you'll understand how a Worker receives and returns requests/Responses. We will also build this serverless function locally for development and deploy it to a custom domain.",
      },
      {
        title: 'Create an eCommerce Store with Next.js and Stripe Checkout',
        byline: 'Colby Fayock・1h 4m・Course',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/412/781/thumb/ecommerce-stripe-next.png',
        path: '/playlists/create-an-ecommerce-store-with-next-js-and-stripe-checkout-562c',
        slug: 'create-an-ecommerce-store-with-next-js-and-stripe-checkout-562c',
        description: `This is a practical project based look at building a working e-commerce store
        using modern tools and APIs. Excellent for a weekend side-project for your [developer project portfolio](https://joelhooks.com/developer-portfolio)`,
      },
      {
        title: 'Practical Git for Everyday Professional Use',
        byline: 'Trevor Miller・1h・Course',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/050/thumb/egghead-practical-git-course.png',
        path: '/courses/practical-git-for-everyday-professional-use',
        slug: 'practical-git-for-everyday-professional-use',
        description: `[git](/q/git) is a critical component in the modern web developers tool box. This course
         is a solid introduction and goes beyond the basics with some more advanced git commands
         you are sure to find useful.`,
      },
      {
        title: 'Build an App with the AWS Cloud Development Kit',
        byline: 'Tomasz Łakomy・1h 4m・Course',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/450/thumb/EGH_AWS-TS.png',
        path: '/courses/build-an-app-with-the-aws-cloud-development-kit',
        slug: 'build-an-app-with-the-aws-cloud-development-kit',
        description:
          "Tomasz Łakomy will guide you through using TypeScript to complete the lifecycle of an application powered by AWS CDK. You'll see how to start a project, develop it locally, deploy it globally, then tear it all down when you're done. Excellent kick start for your next side project or your developer portfolio.",
      },
    ].filter((resource) => {
      return resource.slug !== course.slug
    }),
    3,
  )

  const {
    topics,
    illustrator,
    dependencies,
    pairWithResources = defaultPairWithResources,
    courseProject,
    quickFacts,
    prerequisites,
    essentialQuestions,
    multiModuleCourse,
    moduleResource,
    moduleLabel,
    multiModuleSlug,
    multiModuletitle,
    totalCourseModules,
    multiModuleLineheight,
  } = courseDependencies

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
    published_at,
    created_at,
    access_state,
    customOgImage,
    prerequisites: sanityPrerequisites,
    topics: sanityTopics,
    pairWithResources: sanityPairWithResources,
    essentialQuestions: sanityEssentialQuestions,
    illustrator: sanityIllustrator,
    dependencies: sanityDependencies,
    state,
    path,
    tags = [],
  } = course

  const ogImage = customOgImage ? customOgImage.url : ogImageUrl

  const relatedResources = sanityPairWithResources
    ? sanityPairWithResources
    : pairWithResources
  const courseEssentialQuestions = !isEmpty(sanityEssentialQuestions)
    ? transformSanityEssentialQuestions(sanityEssentialQuestions)
    : essentialQuestions
  const courseTopics = !isEmpty(sanityTopics)
    ? transformSanityTopics(sanityTopics)
    : topics
  const coursePrerequisites = !isEmpty(sanityPrerequisites)
    ? sanityPrerequisites
    : prerequisites
  const courseIllustrator = !isEmpty(sanityIllustrator)
    ? sanityIllustrator
    : illustrator

  const podcast = first(
    course?.items?.filter((item: any) => item.type === 'podcast'),
  )

  logCollectionResource(course)

  const courseTags = tags.map((tag: any) => {
    const ogVersion = get(dependencies, tag.name)
    const sanityTag = find(sanityDependencies, {name: tag.name})?.version

    const version = !isEmpty(sanityTag) ? sanityTag : ogVersion

    return {
      ...tag,
      ...(!!version && {version}),
    }
  })

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

  const EpicReactBanner = ({
    image = 'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1626109728/epic-react/default-banners/banner-course-page_2x.jpg',
    width = 1416,
    height = 508,
  }) => {
    return get(course, 'owner.id') === 15369 ? (
      <ExternalTrackedLink
        eventName="clicked epic react banner"
        params={{location: course.path}}
        href="https://epicreact.dev"
        target="_blank"
        rel="noopener"
        className="block"
      >
        <div className="flex items-center justify-center overflow-hidden rounded-lg">
          <Image
            src={image}
            alt="Get Really Good at React on EpicReact.dev by Kent C. Dodds"
            width={width}
            height={height}
            quality={100}
            className="hover:scale-[102%] ease-in-out duration-500"
          />
        </div>
      </ExternalTrackedLink>
    ) : null
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
        <div className="left-0 grid w-full grid-cols-1 gap-5 mt-10 mb-4 rounded-md md:grid-cols-5 md:gap-16">
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
              {moduleResource && (
                <div className="mt-4 -mb-4 text-base leading-loose text-center md:mb-0 md:mt-0 md:text-left">
                  <Link href={multiModuleSlug}>
                    <a>
                      <span className="text-gray-700 dark:text-gray-400 hover:underline">
                        {multiModuletitle && multiModuletitle}
                      </span>
                    </a>
                  </Link>
                  {' • '}
                  <span className="font-semibold">Part {moduleLabel}</span>
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
                  <TagList tags={courseTags} courseSlug={course.slug} />
                  <div className="flex items-center justify-center md:justify-start md:mr-4">
                    {duration && (
                      <div className="mt-2 mr-4 md:mt-0">
                        <Duration duration={convertTimeWithTitles(duration)} />
                      </div>
                    )}
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
                  {count > 1 && (
                    <span>
                      {count} learners are watching this course right now.
                    </span>
                  )}
                </div>

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
                        axios.post(toggle_favorite_url).then((resp) => {
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
                        You need to be signed in to bookmark courses. Sign in or
                        create a free account to save this course.
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
                        <FolderDownloadIcon className="w-4 h-4 mr-1" /> Download
                      </div>
                    </a>
                  </Link>
                ) : (
                  <MembershipDialogButton
                    buttonText="Download"
                    title="Become a member to download this course"
                  >
                    As an egghead member you can download any of our courses and
                    watch them offline.
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
              <Markdown className="mb-6 prose text-gray-900 dark:prose-dark md:prose-lg md:dark:prose-lg-dark dark:text-gray-100 mt-14">
                {description}
              </Markdown>
              <div className="block pt-5 md:hidden">
                <CourseProjectCard courseProject={courseProject} />

                {get(course, 'access_state') === 'free' && (
                  <div className="p-4 my-8 border border-gray-100 rounded-md bg-gray-50 dark:border-gray-800 dark:bg-gray-800">
                    <CommunityResource type="course" />
                  </div>
                )}
              </div>
              {!isEmpty(podcast) && (
                <CoursePodcast podcast={podcast} instructorName={name} />
              )}

              {courseTopics && (
                <div className="p-5 mt-8 border border-gray-100 rounded-md dark:border-gray-700">
                  <h2 className="mb-3 text-lg font-semibold">
                    What you'll learn:
                  </h2>
                  <div className="prose dark:prose-dark">
                    <ul className="grid grid-cols-1 md:gap-x-5">
                      {courseTopics?.map((topic: string) => (
                        <li
                          key={topic}
                          className="leading-6 text-gray-900 dark:text-gray-100"
                        >
                          {topic}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              {coursePrerequisites && (
                <div className="p-5 mt-8 border border-gray-100 rounded-md dark:border-gray-700">
                  <h2 className="mb-3 text-lg font-semibold">Prerequisites:</h2>
                  <div className="prose dark:prose-dark">
                    <Prereqs prerequisites={coursePrerequisites} />
                  </div>
                </div>
              )}
              {quickFacts && (
                <div className="p-5 mt-8 border border-gray-100 rounded-md dark:border-gray-700">
                  <h2 className="mb-3 text-lg font-semibold">Quick Facts:</h2>
                  <div className="prose dark:prose-dark">
                    <ul className="grid grid-cols-1 md:gap-x-5">
                      {quickFacts?.map((quickFact: string) => (
                        <li
                          key={quickFact}
                          className="leading-6 text-gray-900 dark:text-gray-100"
                        >
                          {quickFact}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              {courseEssentialQuestions && (
                <div className="p-5 mt-8 border border-gray-100 rounded-md dark:border-gray-700">
                  <h2 className="mb-3 text-lg font-semibold">
                    Questions to Think About:
                  </h2>
                  <div className="prose dark:prose-dark">
                    <ul className="grid grid-cols-1 md:gap-x-5">
                      {courseEssentialQuestions?.map(
                        (essentialQuestion: string) => (
                          <li
                            key={essentialQuestion}
                            className="leading-6 text-gray-900 dark:text-gray-100"
                          >
                            {essentialQuestion}
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                </div>
              )}
              <LearnerRatings collection={course} />
              {!isEmpty(relatedResources) && (
                <div className="flex-col hidden my-12 space-y-2 md:flex">
                  <h2 className="mb-3 text-lg font-semibold">
                    You might also like these resources:
                  </h2>
                  <EpicReactBanner />
                  {relatedResources.map((resource: any) => {
                    return (
                      <div key={resource.slug}>
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

              <CourseProjectCard courseProject={courseProject} />

              {get(course, 'access_state') === 'free' && (
                <div className="p-4 my-8 border border-gray-100 rounded-md bg-gray-50 dark:border-gray-800 dark:bg-gray-800">
                  <CommunityResource type="course" />
                </div>
              )}
            </div>
            <section className="mt-8">
              <div className="flex flex-col mb-2 space-y-4 ">
                {moduleResource && (
                  <div className="p-4 my-4 border border-gray-100 rounded-md dark:text-gray-400 bg-gray-50 dark:border-gray-800 dark:bg-gray-800">
                    Part{' '}
                    {moduleLabel && (
                      <span className="font-semibold dark:text-gray-100">
                        {moduleLabel}
                      </span>
                    )}{' '}
                    of {totalCourseModules && totalCourseModules} in the{' '}
                    <Link href={multiModuleSlug}>
                      <a>
                        <span className="font-semibold hover:underline dark:text-gray-100">
                          {multiModuletitle && multiModuletitle}
                        </span>
                      </a>
                    </Link>
                  </div>
                )}
                <h2 className="text-xl font-bold">
                  {multiModuleCourse ? 'Modules' : 'Course Content'}
                </h2>
                <div className="text-sm font-normal text-gray-600 dark:text-gray-300">
                  {duration && `${convertTimeWithTitles(duration)} • `}
                  {lessons.length + playlistLessons.length} lessons{' '}
                  {multiModuleCourse && '• 4 Modules'}{' '}
                </div>
              </div>
              {multiModuleCourse ? (
                <ul className="relative">
                  <div
                    className={`bg-gray-200 dark:bg-gray-700 absolute left-[79px] w-[1px] top-[8%] z-0 ${
                      multiModuleLineheight
                        ? `height-[${multiModuleLineheight}]`
                        : ''
                    }`}
                  ></div>
                  {playlists.map((course: any) => {
                    return (
                      <ul key={course.slug}>
                        <div className="flex items-center py-10 space-x-10 max-w-max-content">
                          <Link href={course.path}>
                            <a>
                              <div className="flex flex-shrink-0">
                                <Image
                                  src={course.square_cover_url}
                                  width={160}
                                  height={160}
                                  layout="fixed"
                                  quality={100}
                                />
                              </div>
                            </a>
                          </Link>
                          <div className="flex flex-col">
                            <Link href={course.path}>
                              <a>
                                <h2 className="text-lg font-semibold leading-tight">
                                  {course.title}
                                </h2>
                              </a>
                            </Link>
                            <div className="mt-1 text-xs font-semibold text-gray-700 dark:text-gray-500">
                              {course.duration &&
                                `${convertTimeWithTitles(course.duration)} • `}
                              {course.lessons.length} lessons
                            </div>
                          </div>
                        </div>
                      </ul>
                    )
                  })}
                </ul>
              ) : (
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
                                  const isComplete =
                                    completedLessonSlugs.includes(lesson.slug)
                                  return (
                                    <li
                                      key={`${playlist.slug}::${lesson.slug}`}
                                    >
                                      <div className="flex items-center py-2 leading-tight">
                                        <div className="flex items-center flex-grow mr-2">
                                          <small className="w-4 pt-px font-normal text-gray-500 scale-75 dark:text-gray-600 font-xs">
                                            {isComplete ? `✔️` : index + 1}
                                          </small>
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
              )}

              <div>
                <ul>
                  {lessons.map((lesson: LessonResource, index: number) => {
                    const isComplete = completedLessonSlugs.includes(
                      lesson.slug,
                    )
                    return (
                      <li key={lesson.slug}>
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
                                index + 1
                              )}
                            </div>
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
              </div>
            </section>
            {!isEmpty(pairWithResources) && (
              <div className="flex flex-col my-12 space-y-2 md:hidden">
                <h2 className="mb-3 text-lg font-semibold">
                  You might also like these resources:
                </h2>
                <EpicReactBanner
                  // 25% off
                  // image="https://res.cloudinary.com/dg3gyk0gu/image/upload/v1625226676/epic-react/summer-sale-2021/banner-react-page_2x.jpg"
                  // default
                  image="https://res.cloudinary.com/dg3gyk0gu/image/upload/v1626109728/epic-react/default-banners/banner-react-page_2x.jpg"
                  width={916 / 2}
                  height={1024 / 2}
                />
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

const CourseProjectCard = ({courseProject}: {courseProject: any}) => {
  return (
    <>
      {courseProject && (
        <div className="p-4 my-8 bg-indigo-100 border border-indigo-500 rounded-md hover:border-indigo-700 dark:hover:border-indigo-400 dark:bg-indigo-900 border-opacity-20">
          {courseProject && (
            <Link href={courseProject.url}>
              <a>
                {courseProject.label && (
                  <h2 className="mb-4 text-xl font-semibold">
                    ⚔️ {courseProject.label}
                  </h2>
                )}
                {courseProject.text && (
                  <Markdown className="w-full prose dark:prose-dark">
                    {courseProject.text}
                  </Markdown>
                )}
              </a>
            </Link>
          )}
        </div>
      )}
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

const Prereqs = ({prerequisites}: any) => {
  return (
    <ul className="grid grid-cols-1 md:gap-x-5">
      {prerequisites?.map((prerequisite: any) =>
        prerequisite.path ? (
          <li
            key={prerequisite.id}
            className="leading-6 text-gray-900 dark:text-gray-100"
          >
            <Link href={prerequisite.path}>
              <a>{prerequisite.title}</a>
            </Link>
          </li>
        ) : (
          <li
            key={prerequisite.id}
            className="leading-6 text-gray-900 dark:text-gray-100"
          >
            {prerequisite.title}
          </li>
        ),
      )}
    </ul>
  )
}

const transformSanityEssentialQuestions = (essentialQuestions: any) => {
  return essentialQuestions.map((question: any) => question.question)
}

const transformSanityTopics = (topics: any) => {
  return topics.items
}

export default CollectionPageLayout
