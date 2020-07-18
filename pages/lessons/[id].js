import {getAllLessonIds, getLessonData} from '../../lib/lessons'
import ReactPlayer from '../../components/ReactPlayer'
import get from 'lodash/get'
import Markdown from 'react-markdown'

export default function Lesson({lessonData}) {
  const playerRef = React.useRef(null)
  return (
    <div className="">
      <div className="">
        <h1>{lessonData.title}</h1>
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
      </div>
    </div>
  )
}

export async function getStaticPaths() {
  const paths = getAllLessonIds()
  return {
    paths,
    fallback: false,
  }
}

export async function getStaticProps({params}) {
  const lessonData = getLessonData(params.id)
  return {
    props: {
      lessonData,
    },
  }
}
