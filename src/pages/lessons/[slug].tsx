/** @jsx jsx */
import {jsx} from '@emotion/core'
import React, {FunctionComponent} from 'react'
import Link from 'next/link'
import {useRouter} from 'next/router'
import EggheadPlayer from 'components/EggheadPlayer'
import {isEmpty, get} from 'lodash'
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
      tags {
        name
        http_url
        image_url
      }
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
  instructor: {
    full_name: string
    http_url: string
    avatar_64_url: string
  }
  tags: [
    {
      name: string
      http_url: string
      image_url: string
    },
  ]
  summary: string
  [cssRelated: string]: any
}

const Metadata: FunctionComponent<MetadataProps> = ({
  title,
  instructor,
  tags,
  summary,
  ...restProps
}: MetadataProps) => {
  return (
    <div {...restProps}>
      {title && <h3 className="mt-0 text-2xl">{title}</h3>}
      <div className="flex items-center mt-4">
        <a href={get(instructor, 'http_url', '#')} className="mr-4">
          {get(instructor, 'avatar_64_url') ? (
            <img
              src={instructor.avatar_64_url}
              alt=""
              className="w-8 rounded-full"
              css={{margin: 0}}
            />
          ) : (
            <Eggo className="w-8 rounded-full" />
          )}
        </a>
        {get(instructor, 'full_name') && (
          <a href={get(instructor, 'http_url', '#')}>{instructor.full_name}</a>
        )}
        {!isEmpty(tags) && (
          <div className="flex ml-6">
            {tags.map((tag, index) => (
              <a
                href={tag.http_url}
                key={index}
                className="flex items-center ml-4 first:ml-0"
              >
                <img
                  src={tag.image_url}
                  alt=""
                  className="w-5 h-5 flex-shrink-0"
                />
                <span className="ml-2">{tag.name}</span>
              </a>
            ))}
          </div>
        )}
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
    tags,
    summary,
  } = lesson

  return (
    <div className="max-w-none">
      <div>
        <h1 className="mb-10">{get(lesson, 'title')}</h1>

        <div
          className="relative overflow-hidden bg-gray-100"
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
        <Metadata
          title={title}
          instructor={instructor}
          tags={tags}
          summary={summary}
          className="mt-10"
        />
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
