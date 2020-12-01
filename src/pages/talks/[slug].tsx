import React, {FunctionComponent} from 'react'
import Link from 'next/link'
import {useRouter} from 'next/router'
import {useMachine} from '@xstate/react'
import EggheadPlayer from 'components/EggheadPlayer'
import get from 'lodash/get'
import Markdown from 'react-markdown'
import Image from 'next/image'
import useSWR from 'swr'
import {loadLesson} from 'lib/lessons'
import {GraphQLClient} from 'graphql-request'
import {useViewer} from 'context/viewer-context'
import {GetServerSideProps} from 'next'
import {LessonResource} from 'types'
import playerMachine from 'machines/lesson-player-machine'
import {useWindowSize} from 'react-use'
import Transcript from 'components/pages/lessons/Transcript'

const API_ENDPOINT = `${process.env.NEXT_PUBLIC_AUTH_DOMAIN}/graphql`

const lessonQuery = /* GraphQL */ `
  query getLesson($slug: String!) {
    lesson(slug: $slug) {
      slug
      title
      transcript_url
      subtitles_url
      summary
      hls_url
      dash_url
      instructor {
        full_name
        slug
        avatar_url
      }
    }
  }
`

const fetcher = (url: RequestInfo) => fetch(url).then((r) => r.json())

const useTranscriptData = (url: string) => {
  const {data: transcriptData} = useSWR(url, fetcher)
  return get(transcriptData, 'text')
}

type NextUpProps = {
  url: any
}

const NextUp: FunctionComponent<NextUpProps> = ({url}) => {
  const {data} = useSWR(url, fetcher)
  return data ? (
    <ul className="list-disc">
      {data.list.lessons.map((lesson: LessonResource) => {
        return (
          <li key={lesson.slug}>
            <Link href={lesson.path}>
              <a className="no-underline hover:underline text-blue-500">
                {lesson.title}
              </a>
            </Link>
          </li>
        )
      })}
    </ul>
  ) : null
}

const lessonLoader = (slug: any, token: any) => (query: string) => {
  const authorizationHeader = token && {
    authorization: `Bearer ${token}`,
  }
  const variables = {
    slug: slug,
  }
  const graphQLClient = new GraphQLClient(API_ENDPOINT, {
    headers: {
      ...authorizationHeader,
    },
  })
  return graphQLClient.request(query, variables)
}

type LessonProps = {
  initialLesson: any
}

const OFFSET_Y = 80
const VIDEO_MIN_HEIGHT = 480

const Talk: FunctionComponent<LessonProps> = ({initialLesson}) => {
  const router = useRouter()
  const playerRef = React.useRef(null)
  const {authToken, logout} = useViewer()
  const [, send] = useMachine(playerMachine)
  const {height} = useWindowSize()
  const [lessonMaxWidth, setLessonMaxWidth] = React.useState(0)

  React.useEffect(() => {
    setLessonMaxWidth(Math.round((height - OFFSET_Y) * 1.6))
  }, [height])

  const {data = {}, error} = useSWR(
    lessonQuery,
    lessonLoader(initialLesson.slug, authToken),
  )

  const lesson = {...initialLesson, ...data.lesson}
  const {instructor, next_up_url, transcript_url, hls_url, dash_url} = lesson

  const transcriptText = useTranscriptData(transcript_url)

  if (error) logout()

  if (router.isFallback) {
    return <div>Loading...</div>
  }

  if (!lesson) return null

  return (
    <div>
      <div>
        <div className="bg-black -mt-3 sm:-mt-5 sm:-mx-8 -mx-5">
          <div
            className="w-full m-auto"
            css={{
              '@media (min-width: 960px)': {
                maxWidth:
                  height > VIDEO_MIN_HEIGHT + OFFSET_Y
                    ? lessonMaxWidth
                    : VIDEO_MIN_HEIGHT * 1.6,
              },
              '@media (min-width: 960px) and (max-height: 560px)': {
                minHeight: '432px',
              },
            }}
          >
            <div
              className="w-full relative overflow-hidden bg-black text-white"
              css={{paddingTop: '56.25%'}}
            >
              <div className="absolute w-full h-full top-0 left-0">
                <EggheadPlayer
                  ref={playerRef}
                  hls_url={hls_url}
                  dash_url={dash_url}
                  width="100%"
                  height="auto"
                  pip="true"
                  controls
                  subtitlesUrl={get(lesson, 'subtitles_url')}
                />
              </div>
            </div>
          </div>
        </div>
        <main className="max-w-screen-lg mx-auto pt-8">
          <article>
            <header className="mb-6">
              <h1 className="text-2xl font-bold tracking-tight leading-tight">
                {get(lesson, 'title')}
              </h1>
              <div className="mt-2 flex items-center">
                <Link href={`/s/resources-by-${get(instructor, 'slug')}`}>
                  <a className="text-base text-gray-800 hover:text-blue-600 transition-colors ease-in-out duration-300 flex items-center">
                    {instructor.avatar_url && (
                      <Image
                        src={get(instructor, 'avatar_url')}
                        width={32}
                        height={32}
                        alt={get(instructor, 'full_name')}
                        className="rounded-full"
                      />
                    )}
                    <span className="ml-1">{get(instructor, 'full_name')}</span>
                  </a>
                </Link>
              </div>
            </header>
            <Markdown className="prose lg:prose-lg max-w-none text-gray-900">
              {get(lesson, 'summary')}
            </Markdown>
            {transcriptText && (
              <div className="sm:mt-16 mt-8">
                <h3 className="text-lg font-bold tracking-tight leading-tight mb-4">
                  Transcript
                </h3>
                <Transcript
                  className="prose max-w-none text-gray-800"
                  player={playerRef}
                  transcriptText={transcriptText}
                  playVideo={() => send('PLAY')}
                />
              </div>
            )}
          </article>
        </main>

        {next_up_url && (
          <div>
            <h3>Playlist:</h3>
            <NextUp url={next_up_url} />
          </div>
        )}
      </div>
    </div>
  )
}

export default Talk

export const getServerSideProps: GetServerSideProps = async function ({
  res,
  params,
}) {
  res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')

  const initialLesson = params && (await loadLesson(params.slug as string))

  return {
    props: {
      initialLesson,
    },
  }
}
