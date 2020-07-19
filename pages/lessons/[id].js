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
  return data ? <Markdown>{data.text}</Markdown> : null
}

export default function Lesson({lessonData}) {
  const router = useRouter()
  const playerRef = React.useRef(null)

  if (router.isFallback) {
    return <div>Loading...</div>
  }

  if (!lessonData) return null

  const {instructor, next_up_url, transcript_url, primary_tag} = lessonData

  return (
    <div className="">
      <div className="">
        <h1>{get(lessonData, 'title')}</h1>
        <div>by {get(instructor, 'full_name')}</div>
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
          <Markdown>{get(lessonData, 'summary')}</Markdown>
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
export async function getServerSideProps({params}) {
  // Fetch data from external API
  const res = await fetch(`https://egghead.io/api/v1/lessons/${params.id}`)
  let lessonData = await res.json()
  console.log(lessonData)
  lessonData = {
    ...lessonData,
    id: params.id,
  }
  return {
    props: {
      lessonData,
    },
  }
}

// export async function getStaticPaths() {
//   const paths = getAllLessonIds()
//   return {
//     paths,
//     fallback: true,
//   }
// }

// export async function getStaticProps({params}) {
//   let lessonData = getLessonData(params.id)
//   if (!lessonData) {
//     const res = await fetch(`https://egghead.io/api/v1/lessons/${id}`)
//     lessonData = await res.json()
//     lessonData = {
//       ...lessonData,
//       id: params.id,
//     }
//   }
//   return {
//     props: {
//       lessonData,
//     },
//     unstable_revalidate: 10,
//   }
// }
