import React, {FunctionComponent, useState} from 'react'
import {GetServerSideProps} from 'next'
import Link from 'next/link'
import {useRouter} from 'next/router'
import {GraphQLClient} from 'graphql-request'
import {isEmpty, get, first} from 'lodash'
import {useMachine} from '@xstate/react'
import {Tabs, TabList, Tab, TabPanels, TabPanel} from '@reach/tabs'
import useSWR from 'swr'
import {useWindowSize} from 'react-use'
import playerMachine from 'machines/lesson-player-machine'
import EggheadPlayer from 'components/EggheadPlayer'
import LessonInfo from 'components/pages/lessons/LessonInfo'
import Transcript from 'components/pages/lessons/Transcript'
import {loadLesson} from 'lib/lessons'
import {useViewer} from 'context/viewer-context'
import {LessonResource} from 'types'
import {NextSeo} from 'next-seo'
import removeMarkdown from 'remove-markdown'
import getTracer from 'utils/honeycomb-tracer'
import {setupHttpTracing} from '@vercel/tracing-js'
import CreateAccountCTA from 'components/pages/lessons/CreateAccountCTA'
import JoinCTA from 'components/pages/lessons/JoinCTA copy'

const tracer = getTracer('lesson-page')

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
      free_forever
      http_url
      path
      course {
        title
        square_cover_480_url
        slug
      }
      tags {
        name
        http_url
        image_url
      }
      instructor {
        full_name
        avatar_64_url
        slug
        twitter
      }
    }
  }
`

const fetcher = (url: RequestInfo) => fetch(url).then((r) => r.json())

const useNextUpData = (url: string) => {
  const {data: nextUpData} = useSWR(url, fetcher)
  const nextUpPath = get(nextUpData, 'next_lesson')
  const nextLessonTitle = get(nextUpData, 'next_lesson_title')
  return {nextUpData, nextUpPath, nextLessonTitle, nextUpLoading: !nextUpData}
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
  className: string
}> = ({children, path, className = ''}) => {
  return (
    <Link href={path || '#'}>
      <a className={className}>{children || 'Next Lesson'}</a>
    </Link>
  )
}

const OverlayWrapper: FunctionComponent<{children: React.ReactNode}> = ({
  children,
}) => {
  return (
    <div className="flex flex-col justify-center items-center h-full">
      {children}
    </div>
  )
}

type LessonProps = {
  initialLesson: LessonResource
}

const OFFSET_Y = 80
const VIDEO_MIN_HEIGHT = 480

const Lesson: FunctionComponent<LessonProps> = ({initialLesson}) => {
  const {height} = useWindowSize()
  const [lessonMaxWidth, setLessonMaxWidth] = useState(0)
  const router = useRouter()
  const playerRef = React.useRef(null)
  const {authToken, logout, viewer} = useViewer()
  const [playerState, send] = useMachine(playerMachine)

  const currentPlayerState = playerState.value

  const {data = {}, error} = useSWR(
    [initialLesson.slug, authToken],
    lessonLoader,
  )

  if (error) logout()

  const lesson = {...initialLesson, ...data.lesson}

  const {
    instructor,
    next_up_url,
    transcript_url,
    hls_url,
    dash_url,
    http_url,
    title,
    tags,
    summary,
    course,
    slug,
    free_forever,
  } = lesson

  const primary_tag = get(first(get(lesson, 'tags')), 'name', 'javascript')

  React.useEffect(() => {
    switch (currentPlayerState) {
      case 'loading':
        if (!isEmpty(data.lesson)) {
          const event: {type: 'LOADED'; lesson: any} = {
            type: 'LOADED',
            lesson: data.lesson,
          }
          send(event)
        }
        break
      case 'loaded':
        if (isEmpty(viewer) && free_forever) {
          send('JOIN')
        } else if (hls_url || dash_url) {
          send('VIEW')
        } else {
          send('SUBSCRIBE')
        }
        break
      case 'completed':
        send('NEXT')
        break
    }
  }, [
    currentPlayerState,
    dash_url,
    data.lesson,
    free_forever,
    hls_url,
    send,
    viewer,
  ])

  React.useEffect(() => {
    const handleRouteChange = () => {
      send('LOAD')
    }
    router.events.on('routeChangeStart', handleRouteChange)
    return () => {
      router.events.off('routeChangeStart', handleRouteChange)
    }
  }, [router.events, send])

  React.useEffect(() => {
    setLessonMaxWidth(Math.round((height - OFFSET_Y) * 1.6))
  }, [height])

  const {nextUpData, nextUpPath, nextLessonTitle} = useNextUpData(next_up_url)

  const playerVisible: boolean = ['playing', 'paused', 'viewing'].some(
    playerState.matches,
  )

  return (
    <>
      <NextSeo
        description={removeMarkdown(summary)}
        canonical={http_url}
        title={title}
        titleTemplate={'%s | egghead.io'}
        twitter={{
          handle: instructor?.twitter,
          site: `@eggheadio`,
          cardType: 'summary_large_image',
        }}
        openGraph={{
          title,
          url: http_url,
          description: removeMarkdown(summary),
          site_name: 'egghead',
          images: [
            {
              url: `https://og-image-react-egghead.now.sh/lesson/${slug}?v=20201027`,
            },
          ],
        }}
      />
      <div key={lesson.slug} className="space-y-8 w-full">
        <div className="bg-black -mt-3 sm:-mt-5 -mx-5">
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
              css={{
                '@media (max-width: 640px)': {
                  paddingTop: playerVisible ? '56.25%' : '0',
                },

                paddingTop: '56.25%',
              }}
            >
              <div
                className={`${
                  playerVisible ? 'absolute' : 'sm:absolute sm:py-0 py-5'
                } w-full h-full top-0 left-0`}
              >
                {playerVisible && (
                  <EggheadPlayer
                    ref={playerRef}
                    hls_url={hls_url}
                    dash_url={dash_url}
                    playing={playerState.matches('playing')}
                    width="100%"
                    height="auto"
                    pip="true"
                    controls
                    onPlay={() => send('PLAY')}
                    onPause={() => {
                      send('PAUSE')
                    }}
                    onEnded={() => send('COMPLETE')}
                    subtitlesUrl={get(lesson, 'subtitles_url')}
                  />
                )}

                {currentPlayerState === 'joining' && (
                  <OverlayWrapper>
                    <CreateAccountCTA
                      lesson={get(lesson, 'slug')}
                      technology={primary_tag}
                    />
                  </OverlayWrapper>
                )}
                {currentPlayerState === 'subscribing' && (
                  <OverlayWrapper>
                    <JoinCTA />
                  </OverlayWrapper>
                )}
                {currentPlayerState === 'showingNext' && (
                  <OverlayWrapper>
                    <img
                      src={lesson.course.square_cover_480_url}
                      alt=""
                      className="w-32"
                    />
                    <div className="mt-8">Up Next</div>
                    <h3 className="text-xl font-semibold mt-4">
                      {nextLessonTitle}
                    </h3>
                    <div className="flex mt-16">
                      <button
                        className="bg-gray-300 rounded p-2 flex items-center"
                        onClick={() => send('LOAD')}
                      >
                        <IconRefresh className="w-6 mr-3" /> Watch Again
                      </button>
                      <NextResourceButton
                        path={nextUpPath}
                        className="bg-gray-300 rounded p-2 flex items-center ml-4"
                      >
                        <IconPlay className="w-6 mr-3" /> Load the Next Video
                      </NextResourceButton>
                    </div>
                    <div className="mt-20">
                      Feeling stuck?{' '}
                      <a href="#" className="font-semibold">
                        Get help from egghead community
                      </a>
                    </div>
                  </OverlayWrapper>
                )}
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="grid md:gap-8 md:grid-cols-12 grid-cols-1 max-w-screen-2xl xl:px-5 mx-auto">
            <div className="md:col-span-8 md:row-start-1 row-start-2">
              <Tabs>
                <TabList
                  css={{background: 'none'}}
                  className="text-lg font-semibold"
                >
                  {transcript_url && <Tab>Transcript</Tab>}
                  <Tab>Comments</Tab>
                </TabList>
                <TabPanels className="mt-6">
                  {transcript_url && (
                    <TabPanel>
                      <Transcript
                        player={playerRef}
                        url={transcript_url}
                        fetcher={fetcher}
                        playVideo={() => send('PLAY')}
                      />
                    </TabPanel>
                  )}
                  <TabPanel>
                    <p>Comments</p>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </div>
            <div className="md:col-span-4 flex flex-col space-y-8">
              <LessonInfo
                title={title}
                instructor={instructor}
                tags={tags}
                summary={summary}
                course={course}
                nextUpData={nextUpData}
                lesson={lesson}
                className="space-y-6 divide-y divide-cool-gray-100"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Lesson

export const getServerSideProps: GetServerSideProps = async function ({
  req,
  res,
  params,
}) {
  setupHttpTracing({name: getServerSideProps.name, tracer, req, res})
  res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')

  const initialLesson: LessonResource | undefined =
    params && (await loadLesson(params.slug as string))

  return {
    props: {
      initialLesson,
    },
  }
}

const IconPlay: FunctionComponent<{className: string}> = ({className = ''}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className={className}
  >
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
      clipRule="evenodd"
    />
  </svg>
)

const IconRefresh: FunctionComponent<{className: string}> = ({
  className = '',
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
    />
  </svg>
)
