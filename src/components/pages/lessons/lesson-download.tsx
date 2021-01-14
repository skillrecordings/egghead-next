import * as React from 'react'
import {FunctionComponent} from 'react'
import axios from 'utils/configured-axios'
import {track} from 'utils/analytics'

type LessonDownloadProps = {
  lesson: any
}

const LessonDownload: FunctionComponent<LessonDownloadProps> = ({lesson}) => {
  return (
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
      className={`space-x-2 flex items-center rounded-md px-3 py-2 bg-gray-800 border-none text-gray-300 hover:text-white text-xs uppercase tracking-wide transition-colors ease-in-out duration-200 ${
        !lesson?.download_url ? 'opacity-30 hover:text-gray-300' : ''
      }`}
    >
      <IconDownload className="w-5" />
      <span>Download</span>
    </button>
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
