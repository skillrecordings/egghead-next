import React, {FunctionComponent} from 'react'
import Link from 'next/link'
import {useRouter} from 'next/router'
import EggheadPlayer from '@components/EggheadPlayer'
import get from 'lodash/get'
import Markdown from 'react-markdown'
import useSWR from 'swr'
import {loadLesson} from '@lib/lessons'
import {GraphQLClient} from 'graphql-request'
import {useViewer} from '@context/viewer-context'
import {GetServerSideProps} from 'next'

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
      }
    }
  }
`

const fetcher = (url: RequestInfo) => fetch(url).then((r) => r.json())

type NextUpProps = {
  url: any
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
  url: any
}

const Transcript: FunctionComponent<TranscriptProps> = ({url}) => {
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
  initialLesson: any
}

const Talk: FunctionComponent<LessonProps> = ({initialLesson}) => {
  const router = useRouter()
  const playerRef = React.useRef(null)
  const {authToken, logout} = useViewer()

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

  const {instructor, next_up_url, transcript_url, hls_url, dash_url} = lesson

  return (
    <div className="prose lg:prose-xl max-w-none">
      <div>
        <h1>{get(lesson, 'title')}</h1>

        <div
          className="relative overflow-hidden bg-gray-100"
          style={{paddingTop: '56.25%'}}
        >
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
        </div>
        <div>
          <Markdown>{get(lesson, 'summary')}</Markdown>
        </div>
        <div className="mt-8 font-bold">by {get(instructor, 'full_name')}</div>
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
