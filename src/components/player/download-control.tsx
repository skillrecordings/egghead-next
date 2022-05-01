import * as React from 'react'
import {FunctionComponent} from 'react'
import axios from 'utils/configured-axios'
import {track} from 'utils/analytics'
import Tippy from '@tippyjs/react'
import Link from 'next/link'

type DownloadButtonProps = {
  slug: string
  download_url: string
}

type DownloadControlProps = {
  slug: string
  download_url: string
  key?: string
  order?: number
}

const DownloadButton: FunctionComponent<DownloadButtonProps> = ({
  slug,
  download_url,
}) => {
  return download_url ? (
    <button
      onClick={(e) => {
        e.preventDefault()
        if (download_url) {
          axios.get(download_url).then(({data}) => {
            window.location.href = data
          })
        }
        track(`clicked download lesson`, {
          lesson: slug,
        })
      }}
      aria-label="download video"
      className="w-10 h-10 flex items-center justify-center border-none text-white"
      type="button"
    >
      <IconDownload className="w-6" />
    </button>
  ) : (
    <Link href="/pricing" passHref>
      <a
        aria-label="become a member to download this lesson"
        className="w-10 h-10 flex items-center justify-center opacity-50"
      >
        <IconDownload className="w-6" />
      </a>
    </Link>
  )
}

const DownloadControl: FunctionComponent<DownloadControlProps> = ({
  slug,
  download_url,
}) => {
  return (
    <Tippy
      offset={[0, -2]}
      content={
        <div className="text-sm bg-gray-900 px-2 py-1 rounded-sm">
          {download_url
            ? 'Download video'
            : 'Become a member to download this lesson'}
        </div>
      }
    >
      <div>
        <DownloadButton slug={slug} download_url={download_url} />
      </div>
    </Tippy>
  )
}

const IconDownload: FunctionComponent<{className?: string}> = ({
  className = '',
}) => (
  <svg
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 32 32"
    className={className}
  >
    <path d="M24.853 12.838h-5.059V5.25h-7.588v7.588H7.147L16 21.691l8.853-8.853zM7.147 24.22v2.53h17.706v-2.53H7.147z" />
  </svg>
)

export default DownloadControl
