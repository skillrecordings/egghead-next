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
import playerMachine from 'machines/lesson-player-machine'
import EggheadPlayer from 'components/EggheadPlayer'
import PlayerControls from 'components/pages/lessons/PlayerControls'
import Metadata from 'components/pages/lessons/Metadata'
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

const useNextUpData = (url: string) => {
  const {data} = useSWR(url, fetcher)
  return data
}

type NextUpProps = {
  data: {
    list: {
      lessons: LessonResource[]
    }
  }
}

const NextUp: FunctionComponent<NextUpProps> = ({children, data}) => {
  return data ? (
    <ul>
      {data.list.lessons.map((lesson, index = 0) => {
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
      })}
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

const lessonLoader = (slug: string, token: string) => {
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
  return graphQLClient.request(lessonQuery, variables)
}

const NextResourceButton: FunctionComponent<{
  path: string
  onClick: () => void
}> = ({children, path, onClick}) => {
  return (
    <div>
      <Link href={`/lessons/[id]`} as={path}>
        <a className="bg-gray-300 rounded p-2" onClick={onClick}>
          {children || 'Next Lesson'}
        </a>
      </Link>
    </div>
  )
}

type LessonProps = {
  initialLesson: LessonResource
}

const Lesson: FunctionComponent<LessonProps> = ({initialLesson}) => {
  const router = useRouter()
  const playerRef = React.useRef(null)
  const {authToken, logout} = useViewer()
  const [playerState, send] = useMachine(playerMachine)

  console.log({playerState})

  const {data = {}, error} = useSWR(
    [initialLesson.slug, authToken],
    lessonLoader,
  )

  if (error) logout()

  const lesson = {...initialLesson, ...data.lesson}
  if (router.isFallback) {
    return <div>Loading...</div>
  }

  if (!lesson) return null

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

  const currentState = playerState.value

  console.log(`The current player state: ${currentState}`)

  React.useEffect(() => {
    switch (currentState) {
      case 'loading':
        if (!isEmpty(data.lesson)) {
          send('LOADED')
        }
        break
      case 'loaded':
        if (hls_url || dash_url) {
          send('PLAY')
        } else {
          send('SUBSCRIBE')
        }
      case 'completed':
        send('NEXT')
      default:
        break
    }
  }, [currentState, data.lesson])

  const nextUpData = useNextUpData(next_up_url)
  const nextUpPath = get(nextUpData, 'next_lesson')
  const playerVisible: boolean =
    playerState.value === 'playing' || playerState.value === 'paused'

  console.log(nextUpPath)

  return (
    <div className="max-w-none" key={lesson.slug}>
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
            {playerVisible && (
              <EggheadPlayer
                ref={playerRef}
                hls_url={hls_url}
                dash_url={dash_url}
                width="100%"
                height="auto"
                pip="true"
                controls
                onPlay={() => send('PLAY')}
                onPause={() => send('PAUSE')}
                onEnded={() => send('COMPLETE')}
                subtitlesUrl={get(lesson, 'subtitles_url')}
              />
            )}

            {playerState.value === 'subscribe' && (
              <div className="flex justify-center items-center h-full">
                <Link href="/pricing">
                  <a>Get Access to This Video</a>
                </Link>
              </div>
            )}

            {playerState.value === 'showingNext' && (
              <div className="flex justify-center items-center h-full">
                <NextResourceButton
                  path={nextUpPath}
                  onClick={() => send('LOAD')}
                >
                  Load the Next Video
                </NextResourceButton>
              </div>
            )}
          </div>
        </div>
        <PlayerControls
          handlerDownload={() => console.log('handlerDownload')}
          isPro={true}
        >
          <NextResourceButton path={nextUpPath} onClick={() => send('LOAD')} />
        </PlayerControls>
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
            {nextUpData && (
              <div>
                <NextUp data={nextUpData} />
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
