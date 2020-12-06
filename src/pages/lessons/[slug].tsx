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
import Head from 'next/head'
import NextUpOverlay from 'components/pages/lessons/overlay/next-up-overlay'

const tracer = getTracer('lesson-page')

const API_ENDPOINT = `${process.env.NEXT_PUBLIC_AUTH_DOMAIN}/graphql`

const lessonMediaUrlQuery = /* GraphQL */ `
  query getLesson($slug: String!) {
    lesson(slug: $slug) {
      hls_url
      dash_url
    }
  }
`

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
  return graphQLClient.request(lessonMediaUrlQuery, variables)
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
      <Head>
        <script
          async
          src="https://cdn.bitmovin.com/player/web/8/bitmovinplayer.js"
        />
      </Head>
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
                    <NextUpOverlay
                      lesson={lesson}
                      send={send}
                      url={next_up_url}
                    />
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
                      {!playerState.matches('loading') && (
                        <Transcript
                          player={playerRef}
                          playVideo={() => send('PLAY')}
                          transcriptUrl={transcript_url}
                        />
                      )}
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
                nextUpUrl={next_up_url}
                lesson={lesson}
                playerState={playerState}
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
