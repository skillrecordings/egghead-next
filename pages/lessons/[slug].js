import Link from 'next/link'
import {useRouter} from 'next/router'
import ReactPlayer from '../../components/ReactPlayer'
import get from 'lodash/get'
import Markdown from 'react-markdown'
import useSWR from 'swr'
import {loadLesson} from '../../lib/lessons'

const fetcher = (url) => fetch(url).then((r) => r.json())

const NextUp = ({url}) => {
  const {data} = useSWR(url, fetcher)
  return data ? (
    <ul className="list-disc">
      {data.list.lessons.map((lesson) => {
        return (
          <li key={lesson.slug}>
            <Link href={`/lessons/[id]`} as={lesson.path}>
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

const Transcript = ({url}) => {
  const {data} = useSWR(url, fetcher)
  return data ? <Markdown className="prose">{data.text}</Markdown> : null
}

export default function Lesson({lesson}) {
  const router = useRouter()
  const playerRef = React.useRef(null)

  if (router.isFallback) {
    return <div>Loading...</div>
  }

  if (!lesson) return null

  const {instructor, next_up_url, transcript_url, hls_url, dash_url} = lesson

  return (
    <div className="">
      <div className="">
        <h1>{get(lesson, 'title')}</h1>
        <div>by {get(instructor, 'full_name')}</div>
        <div
          className="relative overflow-hidden bg-gray-100"
          style={{paddingTop: '56.25%'}}
        >
          <ReactPlayer
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
          <Markdown className="prose">{get(lesson, 'summary')}</Markdown>
        </div>
        {next_up_url && (
          <div>
            <h1 className="font-bold">Playlist:</h1>
            <NextUp url={next_up_url} />
          </div>
        )}
        {transcript_url && (
          <div>
            <h1 className="font-bold">Transcript:</h1>
            <Transcript url={transcript_url} />
          </div>
        )}
      </div>
    </div>
  )
}

// This gets called on every request
export async function getServerSideProps({res, params}) {
  res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')
  const lesson = await loadLesson(params.slug)
  return {
    props: {
      lesson,
    },
  }
}
