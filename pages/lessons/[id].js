import {getAllLessonIds, getLessonData} from '../../lib/lessons'
import Link from 'next/link'
import {useRouter} from 'next/router'
import ReactPlayer from '../../components/ReactPlayer'
import get from 'lodash/get'
import Markdown from 'react-markdown'
import useSWR from 'swr'

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
  console.log(data)
  return data ? <Markdown>{data.text}</Markdown> : null
}

export default function Lesson({lessonData}) {
  const router = useRouter()
  const playerRef = React.useRef(null)
  console.log(lessonData)

  if (router.isFallback) {
    return <div>Loading...</div>
  }

  if (!lessonData) return null

  const {instructor, next_up_url, transcript_url, primary_tag} = lessonData

  return (
    <div className="">
      <div className="">
        <h1>{lessonData.title}</h1>
        <div>by {instructor.full_name}</div>
        <div
          className="relative overflow-hidden bg-gray-100"
          style={{paddingTop: '56.25%'}}
        >
          <ReactPlayer
            ref={playerRef}
            className="absolute top-0 left-0 w-full h-full"
            {...get(lessonData, 'media_urls')}
            width="100%"
            height="auto"
            poster={get(lessonData, 'thumb_nail')}
            pip="true"
            controls
            subtitlesUrl={get(lessonData, 'subtitles_url')}
          />
        </div>
        <div>
          <Markdown>{lessonData.summary}</Markdown>
        </div>
        <div>
          <h1 className="font-bold">Playlist:</h1>
          <NextUp url={next_up_url} />
        </div>
        <div>
          <h1 className="font-bold">Transcript:</h1>
          <Transcript url={transcript_url} />
        </div>
      </div>
    </div>
  )
}

export async function getStaticPaths() {
  const paths = getAllLessonIds()
  return {
    paths,
    fallback: true,
  }
}

export async function getStaticProps({params}) {
  const res = await fetch(`https://egghead.io/api/v1/lessons/${params.id}`)
  const lesson = await res.json()
  return {
    props: {
      lessonData: lesson,
    },
    unstable_revalidate: 10,
  }
}
