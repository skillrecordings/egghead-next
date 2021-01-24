import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Markdown from 'react-markdown'
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
import ClockIcon from '../icons/clock'
import {LessonResource} from 'types'
import BookmarkIcon from '../icons/bookmark'
import axios from 'utils/configured-axios'
import {FunctionComponent} from 'react'
import friendlyTime from 'friendly-time'
import LearnerRatings from '../pages/courses/learner-ratings'
import FiveStars from '../five-stars'
import CommunityResource from 'components/community-resource'
import {format, parse} from 'date-fns'
import CheckIcon from '../icons/check-icon'
import TagList from './tag-list'
import {CardHorizontal} from '../pages/home'

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

    console.debug({
      title,
      byline,
      ...(!!image && {image}),
      path,
      slug,
      description,
    })
  }
}

const CollectionPageLayout: React.FunctionComponent<CoursePageLayoutProps> = ({
  lessons,
  course,
  ogImageUrl,
}) => {
  const courseDependencies: any = getDependencies(course.slug)
  const [isFavorite, setIsFavorite] = React.useState(false)

  const defaultPairWithResources: any[] = [
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
      path:
        '/playlists/create-an-ecommerce-store-with-next-js-and-stripe-checkout-562c',
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
  })

  const {
    topics,
    illustrator,
    dependencies,
    freshness,
    pairWithResources = defaultPairWithResources,
  } = courseDependencies

  const {
    title,
    image_thumb_url,
    square_cover_480_url,
    instructor,
    average_rating_out_of_5,
    watched_count,
    primary_tag,
    description,
    rss_url,
    download_url,
    toggle_favorite_url,
    duration,
    collection_progress,
    favorited,
    updated_at,
    state,
    path,
    tags = [],
  } = course

  logCollectionResource(course)

  const courseTags = tags.map((tag: any) => {
    const version = get(dependencies, tag.name)
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

  const {full_name, avatar_64_url, slug: instructor_slug, bio_short, twitter} =
    instructor || {}

  const image_url = square_cover_480_url || image_thumb_url
  const {name: tagName, image_url: tagImage, slug: tagSlug} = primary_tag

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
      lesson && lesson != first(lessons) && lesson != first(playlistLessons)
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
          className="inline-flex justify-center items-center px-5 py-3 rounded-md bg-blue-600 text-white transition-all hover:bg-blue-700 ease-in-out duration-200"
        >
          <PlayIcon className="text-blue-100 mr-2" />
          {isContinuing ? 'Continue' : 'Start'} Watching
        </a>
      </Link>
    ) : null
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
              url: ogImageUrl,
            },
          ],
        }}
      />
      <div className="max-w-screen-xl mx-auto sm:pb-16 pb-8">
        {state === 'retired' && (
          <div className="w-full text-lg bg-orange-100 text-orange-800 p-3 rounded-md border border-orange-900 border-opacity-20">
            ⚠️ This course has been retired and might contain outdated
            information.
          </div>
        )}
        <div className="mt-5 grid md:grid-cols-5 grid-cols-1 md:gap-16 gap-5 rounded-md w-full left-0 mb-4">
          <div className="md:col-span-3 md:row-start-auto flex flex-col h-full max-w-screen-2xl w-full mx-auto">
            <header>
              <div className="md:hidden flex items-center justify-center">
                <div>
                  <Image
                    src={image_url}
                    alt={`illustration for ${title}`}
                    height={256}
                    width={256}
                  />
                </div>
              </div>
              <h1 className="md:text-3xl text-2xl font-bold leading-tight md:text-left text-center">
                {title}
              </h1>
              <div className="pt-2 flex items-center space-x-6">
                {instructor && (
                  <InstructorProfile
                    name={full_name}
                    avatar_url={avatar_64_url}
                    url={instructor_slug}
                    bio_short={bio_short}
                    twitter={twitter}
                  />
                )}
                <div className="flex items-center md:justify-start justify-center mt-4 space-x-4">
                  {duration && (
                    <div className="flex flex-row items-center">
                      <ClockIcon className="w-4 h-4 mr-1" />{' '}
                      {convertTimeWithTitles(duration)}
                    </div>
                  )}
                  <TagList tags={courseTags} courseSlug={course.slug} />{' '}
                </div>
              </div>

              <div className="flex items-center md:justify-start justify-center mt-4 space-x-6 w-full">
                <div className="flex items-center w-2/3 space-x-4">
                  {average_rating_out_of_5 > 0 && (
                    <div className="flex items-center">
                      <FiveStars rating={average_rating_out_of_5} />
                      <span className="ml-2 font-semibold">
                        {average_rating_out_of_5.toFixed(1)}
                      </span>
                    </div>
                  )}
                  {watched_count > 0 && (
                    <div className="flex flex-col lg:flex-row items-center text-center">
                      <div className="font-semibold mr-2">{watched_count}</div>
                      <div>people completed</div>
                    </div>
                  )}
                </div>
                {updated_at && (
                  <div className="flex flex-col lg:flex-row items-center space-x-2 w-1/3 ">
                    <div>Updated:</div>
                    <div>
                      <code>{format(new Date(updated_at), 'yyyy-MM-dd')}</code>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center md:justify-start justify-center mt-4 space-x-2">
                {toggle_favorite_url ? (
                  <button
                    onClick={() => {
                      track(
                        `clicked ${isFavorite ? 'remove' : 'add'} bookmark`,
                        {
                          course: course.slug,
                        },
                      )
                      axios.post(toggle_favorite_url)
                      setIsFavorite(!isFavorite)
                    }}
                  >
                    <div className="flex flex-row items-center border px-2 py-1 rounded hover:bg-gray-200 bg-gray-100 transition-colors">
                      <BookmarkIcon
                        className={`w-4 h-4 mr-1`}
                        fill={isFavorite}
                      />{' '}
                      Bookmark
                    </div>
                  </button>
                ) : (
                  <div className="flex flex-row items-center border px-2 py-1 rounded bg-gray-100 opacity-30">
                    <BookmarkIcon className="w-4 h-4 mr-1" /> Bookmark
                  </div>
                )}
                {download_url ? (
                  <Link href={download_url}>
                    <a
                      onClick={() => {
                        track(`clicked download course`, {
                          course: course.slug,
                        })
                      }}
                    >
                      <div className="flex flex-row items-center border px-2 py-1 rounded hover:bg-gray-200 bg-gray-100 transition-colors">
                        <FolderDownloadIcon className="w-4 h-4 mr-1" /> Download
                      </div>
                    </a>
                  </Link>
                ) : (
                  <div className="flex flex-row items-center border px-2 py-1 rounded bg-gray-100 opacity-30">
                    <FolderDownloadIcon className="w-4 h-4 mr-1" /> Download
                  </div>
                )}
                {rss_url ? (
                  <Link href={rss_url}>
                    <a
                      onClick={() => {
                        track(`clicked rss feed link`, {
                          course: course.slug,
                        })
                      }}
                    >
                      <div className="flex flex-row items-center border px-2 py-1 rounded hover:bg-gray-200 bg-gray-100 transition-colors">
                        <RSSIcon className="w-4 h-4 mr-1" /> RSS
                      </div>
                    </a>
                  </Link>
                ) : (
                  <div className="flex flex-row items-center border px-2 py-1 rounded bg-gray-100 opacity-30">
                    <RSSIcon className="w-4 h-4 mr-1" /> RSS
                  </div>
                )}
              </div>

              <div className="md:hidden flex items-center justify-center w-full mt-5">
                <PlayButton lesson={nextLesson} />
              </div>

              <Markdown className="prose md:prose-lg text-gray-900 mt-6">
                {description}
              </Markdown>

              <div className="pt-5 md:hidden block">
                <Fresh freshness={freshness} />
                {get(course, 'free_forever') && (
                  <div className="pt-3">
                    <CommunityResource type="course" />
                  </div>
                )}

                {illustrator && (
                  <div className="w-full py-6">
                    <h4 className="font-semibold">Credits</h4>
                    <span className="text-sm">
                      {illustrator?.name} (illustration)
                    </span>
                  </div>
                )}
              </div>
              {topics && (
                <div className="mt-8 border rounded-md p-5">
                  <h2 className="text-lg font-semibold mb-3">
                    What you'll learn
                  </h2>
                  <div className="prose">
                    <ul className="grid md:grid-cols-2 grid-cols-1 md:gap-x-5">
                      {topics?.map((topic: string) => (
                        <li key={topic} className="text-gray-900 leading-6">
                          {topic}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              <LearnerRatings collection={course} />
              {!isEmpty(pairWithResources) && (
                <div className="my-12 md:flex hidden flex-col space-y-2">
                  <h2 className="text-lg font-semibold mb-3">
                    You might also like these courses:
                  </h2>
                  {pairWithResources.map((resource) => {
                    return (
                      <div>
                        <CardHorizontal
                          className="border my-4 border-opacity-10 border-gray-400"
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
          <div className="md:col-span-2 flex flex-col items-center justify-start md:mb-0 mb-4">
            <div className="md:block hidden">
              <Image
                src={image_url}
                alt={`illustration for ${title}`}
                height={420}
                width={420}
                className="md:block hidden"
              />
            </div>
            <div className="md:block hidden space-y-10">
              <div className="w-full flex justify-center mt-10">
                <PlayButton lesson={nextLesson} />
              </div>
              <Fresh freshness={freshness} />
              <div className="">
                {get(course, 'free_forever') && (
                  <div className="p-3 border rounded-md bg-gray-100 bg-opacity-20">
                    <CommunityResource type="course" />
                  </div>
                )}
              </div>

              {illustrator && (
                <div className="w-full">
                  <h4 className="font-semibold">Credits</h4>
                  <span className="text-sm">
                    {illustrator?.name} (illustration)
                  </span>
                </div>
              )}
            </div>
            <section className="mt-8">
              <div className="mb-2 flex flex-col space-y-4">
                <h2 className="text-xl font-bold">Course Content </h2>
                <div className="text-sm text-gray-600 font-normal">
                  {duration && `${convertTimeWithTitles(duration)} • `}
                  {lessons.length + playlistLessons.length} lessons
                </div>
              </div>
              <div>
                <ul>
                  {playlists.map((playlist: any, i: number) => {
                    return (
                      <li key={playlist.slug}>
                        <div className="font-semibold flex items-center leading-tight py-2">
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
                                className="hover:underline font-semibold flex items-center w-full"
                              >
                                <Markdown className="prose md:prose-lg text-gray-900 mt-0">
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
                                const isComplete = completedLessonSlugs.includes(
                                  lesson.slug,
                                )
                                return (
                                  <li key={`${playlist.slug}::${lesson.slug}`}>
                                    <div className="flex items-center leading-tight py-2">
                                      <div className="flex items-center mr-2 flex-grow">
                                        <small className="text-gray-500 pt-px font-xs transform scale-75 font-normal w-4">
                                          {isComplete ? `✔️` : index + 1}
                                        </small>
                                        <PlayIcon className="text-gray-500 mx-1" />
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
                                            className="hover:underline flex items-center w-full"
                                          >
                                            <Markdown className="prose md:prose-lg text-gray-700 mt-0">
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
                    const isComplete = completedLessonSlugs.includes(
                      lesson.slug,
                    )
                    return (
                      <li key={lesson.slug}>
                        <div className="font-semibold flex  leading-tight py-2">
                          <div className="flex items-center mr-2 space-x-2">
                            <div
                              className={`${
                                isComplete ? 'text-blue-600' : 'text-gray-500'
                              } pt-px font-xs transform scale-75 font-normal w-4`}
                            >
                              {isComplete ? <CheckIcon /> : index + 1}
                            </div>
                            {lesson.icon_url && (
                              <div className="flex flex-shrink-0 w-8 items-center">
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
                                    className="text-lg hover:underline hover:text-blue-600 font-semibold"
                                  >
                                    {lesson.title}
                                  </a>
                                </Link>
                              </div>
                              <div className="text-xs text-gray-700">
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
              <div className="my-12 flex md:hidden flex-col space-y-2">
                <h2 className="text-lg font-semibold mb-3">
                  You might also like these courses:
                </h2>
                {pairWithResources.map((resource) => {
                  return (
                    <div>
                      <CardHorizontal
                        className="border my-4 border-opacity-10 border-gray-400"
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

const Fresh = ({freshness}: {freshness: any}) => {
  if (!freshness) return null

  const reviewedAt = friendlyTime(
    parse(freshness.asOf, 'yyyy-MM-dd', new Date()),
  )
  return (
    <>
      {freshness && (
        <div
          className={`flex flex-col space-y-1 ${
            freshness.status === 'fresh'
              ? 'border-green-900 border bg-green-100 bg-opacity-50'
              : freshness.status === 'classic'
              ? 'border-blue-900 border bg-blue-100 bg-opacity-50'
              : 'border'
          } border-opacity-20 p-4 my-3 rounded-md`}
        >
          {freshness.title && (
            <h2 className="text-xl font-semibold">
              {freshness.status === 'fresh' && '🌱'}
              {freshness.status === 'classic' && '💎'} {freshness.title}
            </h2>
          )}
          {freshness.asOf && (
            <p>
              <small>Staff reviewed: {reviewedAt}</small>
            </p>
          )}
          {freshness.text && (
            <Markdown className="prose w-full">{freshness.text}</Markdown>
          )}
        </div>
      )}
    </>
  )
}

export default CollectionPageLayout
