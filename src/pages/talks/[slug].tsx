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
import {getGraphQLClient} from 'utils/configured-graphql-client'
import {useViewer} from 'context/viewer-context'
import {GetServerSideProps} from 'next'
import {playerMachine} from 'machines/lesson-player-machine'
import {useWindowSize} from 'react-use'
import Transcript from 'components/pages/lessons/transcript'
import {NextSeo} from 'next-seo'
import Head from 'next/head'
import removeMarkdown from 'remove-markdown'
import {useEnhancedTranscript} from 'hooks/use-enhanced-transcript'

const lessonQuery = /* GraphQL */ `
  query getLesson($slug: String!) {
    lesson(slug: $slug) {
      slug
      title
      http_url
      transcript_url
      subtitles_url
      description
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

const lessonLoader = (slug: any, token: any) => (query: string) => {
  const graphQLClient = getGraphQLClient(token)
  const variables = {
    slug: slug,
  }

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
  const {authToken} = useViewer()
  const [playerState, send] = useMachine(playerMachine)
  const {height} = useWindowSize()
  const [lessonMaxWidth, setLessonMaxWidth] = React.useState(0)

  React.useEffect(() => {
    setLessonMaxWidth(Math.round((height - OFFSET_Y) * 1.6))
  }, [height])

  const {data = {}} = useSWR(
    lessonQuery,
    lessonLoader(initialLesson.slug, authToken),
  )

  const lesson = {...initialLesson, ...data.lesson}
  const {
    instructor,
    transcript,
    transcript_url,
    hls_url,
    dash_url,
    title,
    description,
    path,
    slug,
  } = lesson

  const enhancedTranscript = useEnhancedTranscript(transcript_url)
  const transcriptAvailable = transcript || enhancedTranscript

  if (router.isFallback) {
    return <div>Loading...</div>
  }

  if (!lesson) return null

  const playerVisible: boolean = ['playing', 'paused', 'viewing'].some(
    playerState.matches,
  )

  return (
    <>
      <NextSeo
        description={removeMarkdown(description)}
        canonical={`${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}${path}`}
        title={title}
        titleTemplate={'%s | conference talk | egghead.io'}
        twitter={{
          handle: instructor?.twitter,
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
              url: `https://og-image-react-egghead.now.sh/talk/${slug}?v=20201027`,
            },
          ],
        }}
      />
      <Head>
        <script src="//cdn.bitmovin.com/player/web/8/bitmovinplayer.js" />
      </Head>
      <div>
        <div className="bg-black -mt-3 sm:-mt-5 -mx-5">
          <style jsx>
            {`
              @media (min-width: 960px) {
                .player-container {
                  max-width: ${height > VIDEO_MIN_HEIGHT + OFFSET_Y
                    ? lessonMaxWidth
                    : VIDEO_MIN_HEIGHT * 1.6}px;
                }
              }
              @media (min-width: 960px) and (max-height: 560px) {
                .player-container {
                  min-height: 432px;
                }
              }
            `}
          </style>
          <div className="player-container w-full m-auto">
            <div className="pt-[56.25%] w-full relative overflow-hidden bg-black text-white">
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
                <Link href={`/q/resources-by-${get(instructor, 'slug')}`}>
                  <a className="text-base dark:text-gray-400 text-gray-800 hover:text-blue-600 transition-colors ease-in-out duration-300 flex items-center">
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
            <Markdown className="prose dark:prose-dark lg:dark:prose-lg-dark lg:prose-lg max-w-none text-gray-900">
              {get(lesson, 'description')}
            </Markdown>
            {transcriptAvailable && (
              <div className="sm:mt-16 mt-8">
                <h3 className="text-lg font-bold tracking-tight leading-tight mb-4">
                  Transcript
                </h3>
                <Transcript
                  className="prose dark:prose-dark max-w-none text-gray-800"
                  initialTranscript={transcript}
                  enhancedTranscript={enhancedTranscript}
                />
              </div>
            )}
          </article>
        </main>
      </div>
    </>
  )
}

export default Talk

export const getServerSideProps: GetServerSideProps = async function ({
  res,
  req,
  params,
}) {
  const initialLesson = params && (await loadLesson(params.slug as string))

  return {
    props: {
      initialLesson,
    },
  }
}
