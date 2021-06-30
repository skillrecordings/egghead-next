import * as React from 'react'
import {FunctionComponent} from 'react'
import axios from 'utils/configured-axios'
import {track} from 'utils/analytics'
import Tippy from '@tippyjs/react'

type DownloadButtonProps = {
  lesson: any
}

type DownloadControlProps = {
  lesson: any
  key: string
  order: number
}

const DownloadButton: FunctionComponent<DownloadButtonProps> = ({lesson}) => {
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
      className={`w-10 h-8 flex items-center justify-center border-none text-white ${
        !lesson?.download_url ? 'opacity-50 cursor-default' : ''
      }`}
    >
      <IconDownload className="w-5" />
    </button>
  )
}

const DownloadControl: FunctionComponent<DownloadControlProps> = ({lesson}) => {
  return lesson?.download_url ? (
    <DownloadButton lesson={lesson} />
  ) : (
    <Tippy content="Download feature is for members only">
      <div>
        <DownloadButton lesson={lesson} />
      </div>
    </Tippy>
  )
}

const IconDownload: FunctionComponent<{className?: string}> = ({
  className = '',
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 32 32"
    className={className}
  >
    <path d="M24.853 12.838h-5.059V5.25h-7.588v7.588H7.147L16 21.691l8.853-8.853zM7.147 24.22v2.53h17.706v-2.53H7.147z" />
  </svg>
)

export default DownloadControl
