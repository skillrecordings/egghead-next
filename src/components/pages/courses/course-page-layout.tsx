import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Markdown from 'react-markdown'
import UserRating from 'components/pages/courses/user-rating'
import InstructorProfile from 'components/pages/courses/instructor-profile'
import PlayIcon from 'components/pages/courses/play-icon'
import getDependencies from 'data/courseDependencies'
import {get, first, filter, isEmpty, map, times, floor} from 'lodash'
import {NextSeo} from 'next-seo'
import removeMarkdown from 'remove-markdown'
import {track} from 'utils/analytics'
import FolderDownloadIcon from '../../icons/folder-download'
import RSSIcon from '../../icons/rss'
import Star from '../../icons/star'
import {convertTimeWithTitles} from 'utils/time-utils'
import ClockIcon from '../../icons/clock'
import {LessonResource} from '../../../types'
import BookmarkIcon from '../../icons/bookmark'
import axios from 'utils/configured-axios'
import {FunctionComponent} from 'react'
import useSWR from 'swr'
import {loadRatings} from '../../../lib/ratings'

type CoursePageLayoutProps = {
  lessons: any
  course: any
  ogImageUrl: string
}

const defaultProgress = {
  completed_lesson_count: 0,
  completed_lesson: [],
  is_completed: false,
}

const CoursePageLayout: React.FunctionComponent<CoursePageLayoutProps> = ({
  lessons,
  course,
  ogImageUrl,
}) => {
  const courseDependencies: any = getDependencies(course.slug)
  const [isFavorite, setIsFavorite] = React.useState(false)

  const {topics, illustrator, dependencies} = courseDependencies

  const {
    title,
    image_thumb_url,
    square_cover_480_url,
    instructor,
    average_rating_out_of_5,
    watched_count,
    primary_tag,
    http_url,
    description,
    rss_url,
    download_url,
    toggle_favorite_url,
    duration,
    collection_progress,
    favorited,
    tags = [],
  } = course

  const courseTags = tags.map((tag: any) => {
    const version = get(dependencies, tag.name)
    return {
      ...tag,
      ...(!!version && {version}),
    }
  })

  const {data: ratings} = useSWR([course.slug, course.type], loadRatings)

  React.useEffect(() => {
    setIsFavorite(favorited)
  }, [favorited])

  const completedLessonSlugs = get(
    collection_progress,
    'completed_lessons',
    [],
  ).map((lesson: LessonResource) => lesson.slug)

  const {
    full_name,
    avatar_64_url,
    slug: instructor_slug,
    bio_short,
    twitter,
  } = instructor

  const image_url = square_cover_480_url || image_thumb_url
  const {name: tagName, image_url: tagImage, slug: tagSlug} = primary_tag

  const playlists = filter(course.items, {type: 'playlist'}) || []

  const playlistLessons = playlists.reduce((acc, playlist) => {
    return [...acc, ...playlist.lessons]
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
        canonical={http_url}
        title={title}
        titleTemplate={'%s | egghead.io'}
        twitter={{
          handle: instructor.twitter,
          site: `@eggheadio`,
          cardType: 'summary_large_image',
        }}
        openGraph={{
          title,
          url: http_url,
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
        <div className="mt-5 grid md:grid-cols-5 grid-cols-1 md:gap-16 gap-5 rounded-md w-full left-0 mb-4">
          <div className="md:col-span-3 md:row-start-auto row-start-2 flex flex-col h-full justify-center max-w-screen-2xl w-full mx-auto">
            <header>
              <h1 className="md:text-3xl text-2xl font-bold leading-tight md:text-left text-center">
                {title}
              </h1>
              <div className="flex items-center md:justify-start justify-center mt-4 space-x-4">
                {duration && (
                  <div className="flex flex-row items-center">
                    <ClockIcon className="w-4 h-4 mr-1" />{' '}
                    {convertTimeWithTitles(duration)}
                  </div>
                )}
                <Tags tags={courseTags} courseSlug={course.slug} />{' '}
              </div>
              <div className="flex items-center md:justify-start justify-center mt-4 space-x-6">
                {average_rating_out_of_5 > 0 && (
                  <div className="flex items-center">
                    <FiveStars rating={average_rating_out_of_5} />
                    <span className="ml-2 font-semibold">
                      {average_rating_out_of_5.toFixed(1)}
                    </span>
                  </div>
                )}
                {watched_count > 0 && (
                  <div>
                    <span className="font-semibold mr-2">{watched_count}</span>
                    people completed
                  </div>
                )}
                <div className="inline-flex flex-wrap items-center md:justify-start justify-center"></div>
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
                <InstructorProfile
                  name={full_name}
                  avatar_url={avatar_64_url}
                  url={instructor_slug}
                  bio_short={bio_short}
                  twitter={twitter}
                />
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
                <div className="mt-8">
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
              {ratings && (
                <div className="mt-8">
                  <h2 className="text-lg font-semibold mb-3">
                    Learner Reviews
                  </h2>
                  <ul className="space-y-5">
                    {ratings.map((rating: any) => {
                      const {comment, rating_out_of_5, user} = rating
                      console.log(comment)
                      const displayAdminContent =
                        !isEmpty(comment.hide_url) ||
                        !isEmpty(comment.restore_url)
                      return (
                        <li
                          key={`rating-${rating.id}`}
                          className="space-y-2 border p-4"
                        >
                          <div className="font-bold">{user.full_name}</div>
                          <FiveStars rating={rating_out_of_5} />
                          <div className="text-sm">{comment.prompt}</div>
                          <div className="prose">{comment.comment}</div>
                          {displayAdminContent && (
                            <button
                              className="rounded text-xs px-2 py-1 flex justify-center items-center bg-gray-100 hover:bg-gray-200 transition-colors duration-150 ease-in-out"
                              onClick={() => {
                                axios.post(comment.hide_url)
                              }}
                            >
                              hide
                            </button>
                          )}
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )}
            </header>
            <main>
              <section className="mt-8">
                <div className="mb-2 flex justify-between items-center">
                  <h2 className="text-lg font-semibold">
                    Course content{' '}
                    <span className="text-sm text-gray-600 font-normal">
                      ({lessons.length + playlistLessons.length} lessons)
                    </span>
                  </h2>
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
                                    <li
                                      key={`${playlist.slug}::${lesson.slug}`}
                                    >
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
                      console.log(lesson)
                      const isComplete = completedLessonSlugs.includes(
                        lesson.slug,
                      )
                      return (
                        <li key={lesson.slug}>
                          <div className="font-semibold flex items-center leading-tight py-2">
                            <div className="flex items-center mr-2 flex-grow space-x-2">
                              <div className="text-gray-500 pt-px font-xs transform scale-75 font-normal w-4">
                                {isComplete ? `✔️` : index + 1}
                              </div>
                              {lesson.icon_url && (
                                <div className="flex items-center">
                                  <Image
                                    src={lesson.icon_url}
                                    width={24}
                                    height={24}
                                  />
                                </div>
                              )}
                            </div>
                            {lesson.path && (
                              <Link href={lesson.path}>
                                <a
                                  onClick={() => {
                                    track(`clicked video link on course page`, {
                                      course: course.slug,
                                      video: lesson.slug,
                                    })
                                  }}
                                  className="hover:underline font-semibold flex items-center w-full"
                                >
                                  <Markdown className="prose md:prose-lg text-gray-900 mt-0">
                                    {lesson.title}
                                  </Markdown>
                                </a>
                              </Link>
                            )}
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </section>
            </main>
          </div>
          <div className="md:col-span-2 flex flex-col items-center justify-start md:mb-0 mb-4">
            <Image
              src={image_url}
              alt={`illustration for ${title}`}
              height={256}
              width={256}
            />
            <div className="md:block hidden space-y-10">
              <div className="w-full flex justify-center mt-10">
                <PlayButton lesson={nextLesson} />
              </div>
              <div className="">
                <InstructorProfile
                  name={full_name}
                  avatar_url={avatar_64_url}
                  url={instructor_slug}
                  bio_short={bio_short}
                  twitter={twitter}
                />
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
          </div>
        </div>
      </div>
    </>
  )
}

const Tags: FunctionComponent<{tags: any; courseSlug: string}> = ({
  tags,
  courseSlug,
}) => {
  return (
    <>
      {!isEmpty(tags) && (
        <div className="flex space-x-4 items-center">
          {/* <div className="font-medium">Tech used:</div> */}
          <ul className="flex flex-wrap items-center space-x-4">
            {tags.slice(0, 1).map((tag: any, index: number) => (
              <li key={index} className="inline-flex items-center">
                <Link href={`/q/${tag.name}`}>
                  <a
                    onClick={() => {
                      track(`clicked view topic`, {
                        course: courseSlug,
                        topic: tag.name,
                      })
                    }}
                    className="inline-flex items-center hover:underline"
                  >
                    <Image
                      src={tag.image_url}
                      alt={tag.name}
                      width={16}
                      height={16}
                      className="flex-shrink-0"
                    />
                    <span className="ml-1">{tag.label}</span>
                    {tag.version && (
                      <span className="ml-2">
                        <code>{tag.version}</code>
                      </span>
                    )}
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  )
}

const FiveStars: React.FunctionComponent<{
  rating: any
}> = ({rating}) => {
  const remainder = parseFloat((rating % 1).toFixed(1))
  const roundedRemainder = Math.ceil(remainder)
  const showHalfStar = roundedRemainder === 1
  const emptyStarCount = 5 - roundedRemainder - floor(rating)
  return (
    <div className="flex items-center lh-solid">
      {map(times(rating), (index) => (
        <div key={`filled-${index}`}>
          <Star filled />
        </div>
      ))}
      {showHalfStar && (
        <div key={`half`}>
          <Star half />
        </div>
      )}
      {map(times(emptyStarCount), (index) => (
        <div key={`empty-${index}`}>
          <Star />
        </div>
      ))}
    </div>
  )
}

export default CoursePageLayout
