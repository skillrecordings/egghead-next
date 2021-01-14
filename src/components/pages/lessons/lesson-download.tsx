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
        lesson?.download_url ? 'Download Video' : 'Download Video (members only)'
      }
      className="self-center"
    >
      <button
        onClick={(e) => {
          e.preventDefault()
          if (lesson?.download_url) {
            axios.get(lesson.download_url).then(({data}) => {
              window.location.href = data
            })
          }
          track(`clicked download lesson`, {
            lesson: lesson.slug,
          })
        }}
        aria-label="download video"
        className="flex"
      >
        <IconDownload
          className={`w-5 text-white ${
            !lesson?.download_url ? 'opacity-30' : ''
          }`}
        /> Download
      </button>
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
