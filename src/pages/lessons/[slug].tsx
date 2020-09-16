/** @jsx jsx */
import {jsx} from '@emotion/core'
import React, {FunctionComponent} from 'react'
import {GetServerSideProps} from 'next'
import Link from 'next/link'
import {useRouter} from 'next/router'
import {GraphQLClient} from 'graphql-request'
import {isEmpty, get} from 'lodash'
import Markdown from 'react-markdown'
import {useMachine} from '@xstate/react'
import useSWR from 'swr'
import {
  ListboxInput,
  ListboxButton,
  ListboxPopover,
  ListboxList,
  ListboxOption,
} from '@reach/listbox'
import playerMachine from 'components/EggheadPlayer/machine'
import EggheadPlayer from 'components/EggheadPlayer'
import PlayerControls from 'components/PlayerControls'
import Metadata from 'components/Metadata'
import {loadLesson} from 'lib/lessons'
import {useViewer} from 'context/viewer-context'
import {LessonResource} from 'types'

const API_ENDPOINT = `${process.env.NEXT_PUBLIC_AUTH_DOMAIN}/graphql`

const lessonQuery = /* GraphQL */ `
  query getLesson($slug: String!) {
    lesson(slug: $slug) {
      slug
      title
      transcript_url
      subtitles_url
      next_up_url
      summary
      hls_url
      dash_url
      course {
        title
        square_cover_480_url
      }
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
    <ul>
      {data.list.lessons.map(
        (
          lesson: {
            slug: string | number | undefined
            path: string | import('url').UrlObject | undefined
            title: React.ReactNode
            completed: any
          },
          index = 0,
        ) => {
          return (
            <li
              key={lesson.slug}
              className="p-4 bg-gray-200 border-gray-100 border-2"
            >
              <div className="flex">
                <div>
                  {index + 1}{' '}
                  <input type="checkbox" checked={lesson.completed} readOnly />
                </div>
                <Link href={`/lessons/[id]`} as={lesson.path}>
                  <a className="no-underline hover:underline text-blue-500">
                    {lesson.title}
                  </a>
                </Link>
              </div>
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
      <div className="space-y-3">
        {lesson.course && (
          <div className="flex align-middle items-center space-x-6 w-100 p-3 bg-gray-200">
            <img className="w-10" src={lesson.course.square_cover_480_url} />
            {lesson.course.title}
          </div>
        )}

        <div
          className="relative overflow-hidden bg-gray-100"
          css={{paddingTop: '56.25%'}}
        >
          <div className="absolute w-full h-full top-0 left-0">
            {playerState.value === 'playing' && (
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
            )}
          </div>
        </div>
        <PlayerControls
          handlerSpeed={() => console.log('handlerSpeed')}
          handlerRewinding={() => console.log('handlerRewinding')}
          handlerDownload={() => console.log('handlerDownload')}
          handlerTheaterMode={() => console.log('handlerTheaterMode')}
          isPro={true}
        />
        <div className="flex space-x-12">
          <div className="w-4/6">
            {transcript_url && (
              <div>
                <h3>Transcript:</h3>
                <Transcript url={transcript_url} />
              </div>
            )}
          </div>
          <div className="w-2/6 flex flex-col space-y-8">
            <Metadata
              title={title}
              instructor={instructor}
              tags={tags}
              summary={summary}
            />
            <div className="p-3 bg-gray-200">Social Sharing and Flagging</div>
            {next_up_url && (
              <div>
                <NextUp url={next_up_url} />
              </div>
            )}
          </div>
        </div>
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
