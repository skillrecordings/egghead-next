import * as React from 'react'
import {FunctionComponent} from 'react'
import axios from 'utils/configured-axios'
import {useViewer} from 'context/viewer-context'
import {track} from 'utils/analytics'
import {Tooltip} from 'react-tippy'

type LessonDownloadProps = {
  lesson: any
}

const LessonDownload: FunctionComponent<LessonDownloadProps> = ({lesson}) => {
  const {viewer} = useViewer()

  return (
    <Tooltip
      title={
        viewer?.is_pro ? 'Download Video' : 'Download Video (members only)'
      }
    >
      {lesson?.download_url && viewer?.is_pro ? (
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
          className=""
        >
          <IconDownload className="w-5 mr-1 text-white" />
        </a>
      ) : (
        <div
          onClick={() => {
            track(`clicked download lesson blocked`, {
              lesson: lesson.slug,
            })
          }}
          className=""
        >
          <IconDownload className="w-5 text-white opacity-30" />
        </div>
      )}
    </Tooltip>
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
