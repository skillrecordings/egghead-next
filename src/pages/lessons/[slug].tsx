/** @jsx jsx */
import {jsx} from '@emotion/core'
import React, {FunctionComponent} from 'react'
import Link from 'next/link'
import {useRouter} from 'next/router'
import EggheadPlayer from 'components/EggheadPlayer'
import get from 'lodash/get'
import Markdown from 'react-markdown'
import useSWR from 'swr'
import {loadLesson} from 'lib/lessons'
import {GraphQLClient} from 'graphql-request'
import {useViewer} from 'context/viewer-context'
import {GetServerSideProps} from 'next'
import {LessonResource} from 'types'
import {useMachine} from '@xstate/react'
import playerMachine from 'components/EggheadPlayer/machine'
import Eggo from '../../../public/images/eggo.svg'

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
        http_url
        avatar_64_url
      }
    }
  }
`

const fetcher = (url: RequestInfo) => fetch(url).then((r) => r.json())

type NextUpProps = {
  url: string
}

const NextUp: FunctionComponent<NextUpProps> = ({url}) => {
  const {data} = useSWR(url, fetcher)
  return data ? (
    <ul className="list-disc">
      {data.list.lessons.map(
        (lesson: {
          slug: string | number | undefined
          path: string | import('url').UrlObject | undefined
          title: React.ReactNode
        }) => {
          return (
            <li key={lesson.slug}>
              <Link href={`/lessons/[id]`} as={lesson.path}>
                <a className="no-underline hover:underline text-blue-500">
                  {lesson.title}
                </a>
              </Link>
            </li>
          )
        },
      )}
    </ul>
  ) : null
}

type TranscriptProps = {
  url: string
}

const Transcript: FunctionComponent<TranscriptProps> = ({
  url,
}: TranscriptProps) => {
  const {data} = useSWR(url, fetcher)
  return data ? <Markdown>{data.text}</Markdown> : null
}

type MetadataProps = {
  title: string
  // instructor: any
  instructor: {
    full_name: string
    http_url: string
    avatar_64_url: string
  }
  summary: string
}

const Metadata: FunctionComponent<MetadataProps> = ({
  title,
  instructor,
  summary,
}) => {
  const {full_name, http_url = '#', avatar_64_url} = instructor
  return (
    <div>
      {title && <h3 className="mt-0 text-2xl">{title}</h3>}
      <div className="flex items-center mt-4">
        <a href={http_url} className="mr-4">
          {avatar_64_url ? (
            <img
              src={avatar_64_url}
              alt=""
              className="w-8 rounded-full"
              css={{margin: 0}}
            />
          ) : (
            <Eggo className="w-8 rounded-full" />
          )}
        </a>
        {full_name && <a href={http_url}>{full_name}</a>}
      </div>
      {summary && <Markdown className="mt-4">{summary}</Markdown>}
    </div>
  )
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
  initialLesson: LessonResource
}

const Lesson: FunctionComponent<LessonProps> = ({initialLesson}) => {
  const router = useRouter()
  const playerRef = React.useRef(null)
  const {authToken, logout} = useViewer()
  const [playerState, send] = useMachine(playerMachine)

  const {data = {}, error} = useSWR(
    lessonQuery,
    lessonLoader(initialLesson.slug, authToken),
  )

  if (error) logout()

  const lesson = {...initialLesson, ...data.lesson}

  if (router.isFallback) {
    return <div>Loading...</div>
  }

  if (!lesson) return null

  React.useEffect(() => {
    if (playerState.value === 'loading') {
      // here we can do some consideration for the actual state.
      send('PLAY')
    }
  }, [playerState, send])

  const {
    instructor,
    next_up_url,
    transcript_url,
    hls_url,
    dash_url,
    title,
    summary,
  } = lesson
  console.log('lesson', lesson)

  return (
    <div className="max-w-none">
      <div>
        <h1 className="mb-10">{get(lesson, 'title')}</h1>

        <div
          className="relative overflow-hidden bg-gray-100 mb-10"
          style={{paddingTop: '56.25%'}}
        >
          {playerState.value === 'playing' && (
            <EggheadPlayer
              ref={playerRef}
              className="absolute top-0 left-0 w-full h-full"
              hls_url={hls_url}
              dash_url={dash_url}
              width="100%"
              height="auto"
              pip="true"
              controls
              subtitlesUrl={get(lesson, 'subtitles_url')}
            />
          )}
        </div>
        <div className="mb-10">
          <Metadata title={title} instructor={instructor} summary={summary} />
        </div>
        {next_up_url && (
          <div>
            <h3>Playlist:</h3>
            <NextUp url={next_up_url} />
          </div>
        )}
        {transcript_url && (
          <div>
            <h3>Transcript:</h3>
            <Transcript url={transcript_url} />
          </div>
        )}
      </div>
    </div>
  )
}

export default Lesson

export const getServerSideProps: GetServerSideProps = async function ({
  res,
  params,
}) {
  res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')

  const initialLesson: LessonResource | undefined =
    params && (await loadLesson(params.slug as string))

  return {
    props: {
      initialLesson,
    },
  }
}
