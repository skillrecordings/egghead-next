import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Markdown from 'react-markdown'
import useSWR from 'swr'
import {loadPlaylist} from 'lib/playlists'
import {FunctionComponent} from 'react'
import {GetServerSideProps} from 'next'
import {get, first} from 'lodash'
import {NextSeo} from 'next-seo'
import removeMarkdown from 'remove-markdown'
import {getTokenFromCookieHeaders} from 'utils/auth'

const fetcher = (url: RequestInfo) => fetch(url).then((r) => r.json())

type PlaylistProps = {
  playlist: any
}

const PlayIcon: FunctionComponent<{className: string}> = ({className}) => {
  return (
    // prettier-ignore
    <svg className={className ? className : ""} xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 16 16"><g fill="none" fillRule="evenodd" transform="translate(-5 -4)"><polygon points="0 0 24 0 24 24 0 24"/><path fill="currentColor" fillRule="nonzero" d="M19.376,12.416 L8.777,19.482 C8.62358728,19.5840889 8.42645668,19.5935191 8.26399944,19.5065407 C8.10154219,19.4195623 8,19.2502759 8,19.066 L8,4.934 C8,4.74972414 8.10154219,4.58043768 8.26399944,4.49345928 C8.42645668,4.40648088 8.62358728,4.41591114 8.777,4.518 L19.376,11.584 C19.5150776,11.6767366 19.5986122,11.8328395 19.5986122,12 C19.5986122,12.1671605 19.5150776,12.3232634 19.376,12.416 Z"/></g></svg>
  )
}

const Playlist: FunctionComponent<PlaylistProps> = ({playlist}) => {
  const initialData = playlist
  const {data} = useSWR(playlist.url, fetcher, {initialData})
  const {
    title,
    slug,
    description,
    image_thumb_url,
    lessons,
    http_url,
    owner,
  } = data
  const {full_name, avatar_url} = owner

  const firstLessonURL = `/lessons/${get(first(lessons), 'slug')}`

  const Instructor: FunctionComponent<{
    name: string
    avatar_url: string
    bio_short?: string
    twitter?: string
    className?: string
  }> = ({className, name, avatar_url, bio_short}) => (
    <div className={className ? className : ''}>
      <div className="flex flex-shrink-0">
        <div
          className="sm:w-10 sm:h-10 w-8 h-8 rounded-full flex-shrink-0"
          style={{
            background: `url(${avatar_url})`,
            backgroundSize: 'cover',
          }}
        />
        <div className="sm:pl-2 pl-1">
          <h4 className="text-gray-700 text-sm">Instructor</h4>
          <span className="font-semibold text-base">{name}</span>
          {bio_short && (
            <Markdown className="prose prose-sm mt-0">{bio_short}</Markdown>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <>
      <NextSeo
        description={removeMarkdown(description)}
        canonical={http_url}
        title={title}
        titleTemplate={'%s | egghead.io'}
        twitter={{
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
              url: `https://og-image-react-egghead.now.sh/playlists/${slug}?v=20201103`,
            },
          ],
        }}
      />
      <div className="max-w-screen-lg mx-auto">
        <div className="md:mt-10 mt-5 grid md:grid-cols-5 grid-cols-1 md:gap-16 gap-5 rounded-md w-full left-0 mb-4">
          <div className="md:col-span-3 md:row-start-auto row-start-2 flex flex-col h-full justify-center max-w-screen-2xl w-full mx-auto">
            <header>
              <h1 className="md:text-3xl text-2xl font-bold leading-tight md:text-left text-center">
                {title}
              </h1>

              <Markdown className="prose md:prose-lg text-gray-900 mt-6">
                {description}
              </Markdown>
            </header>

            <main>
              <section className="mt-8">
                <div className="mb-2 flex justify-between items-center">
                  <h2 className="text-lg font-semibold">
                    Course content{' '}
                    <span className="text-sm text-gray-600 font-normal">
                      ({lessons.length} lessons)
                    </span>
                  </h2>
                </div>
                <div>
                  <ul>
                    {lessons.map((lesson: any, i: number) => {
                      const lessonURL = `/lessons/${lesson.slug}`
                      return (
                        <li key={lesson.id}>
                          <div className="font-semibold flex items-center leading-tight py-2">
                            <div className="flex items-center mr-2 flex-grow">
                              <small className="text-gray-500 pt-px font-xs transform scale-75 font-normal w-4">
                                {i + 1}
                              </small>
                              <PlayIcon className="text-gray-500 mx-1" />
                            </div>
                            <Link href={lessonURL}>
                              <a className="hover:underline font-semibold flex items-center w-full">
                                <Markdown className="prose md:prose-lg text-gray-900 mt-0">
                                  {lesson.title}
                                </Markdown>
                              </a>
                            </Link>
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </section>
              <div className="pt-5 md:hidden block">
                <Instructor name={full_name} avatar_url={avatar_url} />
              </div>
            </main>
          </div>
          <div className="md:col-span-2 flex flex-col items-center justify-start md:mb-0 mb-4">
            <Image
              src={image_thumb_url}
              alt={`illustration for ${title}`}
              height={256}
              width={256}
            />
            <div className="md:block hidden">
              <div className="py-6 border-b border-gray-200 w-full flex justify-center">
                <Link href={firstLessonURL}>
                  <a className="inline-flex justify-center items-center px-5 py-3 rounded-md bg-blue-600 text-white transition-all hover:bg-blue-700 ease-in-out duration-200">
                    <PlayIcon className="text-blue-100 mr-2" />
                    Start Watching
                  </a>
                </Link>
              </div>
              <div className="py-6 border-b border-gray-200">
                <Instructor name={full_name} avatar_url={avatar_url} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Playlist

export const getServerSideProps: GetServerSideProps = async ({
  res,
  req,
  params,
}) => {
  const {eggheadToken} = getTokenFromCookieHeaders(req.headers.cookie as string)
  res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')
  const playlist =
    params && (await loadPlaylist(params.slug as string, eggheadToken))

  return {
    props: {
      playlist,
    },
  }
}
