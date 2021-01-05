import * as React from 'react'
import {FunctionComponent} from 'react'
import axios from 'utils/configured-axios'
import {useViewer} from 'context/viewer-context'
import {track} from 'utils/analytics'

type LessonDownloadProps = {
  lesson: any
}

const LessonDownload: FunctionComponent<LessonDownloadProps> = ({lesson}) => {
  const {viewer} = useViewer()

  return (
    <div className="flex space-x-6">
      {lesson.download_url && viewer?.is_pro ? (
        <div className="flex items-center">
          <a
            onClick={(e) => {
              e.preventDefault()
              axios.get(lesson.download_url).then(({data}) => {
                window.location.href = data
              })
              track(`clicked download lesson`, {
                lesson: lesson.slug,
              })
            }}
            href={lesson.download_url}
            className="flex items-center text-blue-600 hover:underline font-semibold"
          >
            <IconDownload className="w-5 mr-2 text-blue-700" />
            Download Video
          </a>
        </div>
      ) : (
        <div className="flex items-center">
          <div
            onClick={() => {
              track(`clicked download lesson blocked`, {
                lesson: lesson.slug,
              })
            }}
            className="flex items-center text-blue-600 opacity-30 font-semibold"
          >
            <IconDownload className="w-5 mr-2 text-blue-700" />
            Download Video {!viewer?.is_pro && `(members only)`}
          </div>
        </div>
      )}
    </div>
  )
}

const IconDownload: FunctionComponent<{className?: string}> = ({
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
      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
    />
  </svg>
)

export default LessonDownload
