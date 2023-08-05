import * as React from 'react'
import {FunctionComponent} from 'react'
import axios from 'utils/configured-axios'
import analytics from 'utils/analytics'
import Tippy from '@tippyjs/react'
import Link from 'next/link'

type DownloadButtonProps = {
  slug: string
  download_url?: string
  state?: string
}

type DownloadControlProps = {
  slug: string
  download_url?: string
  key?: string
  order?: number
  state?: string
}

const DownloadButton: FunctionComponent<
  React.PropsWithChildren<DownloadButtonProps>
> = ({slug, download_url, state}) => {
  return download_url ? (
    <button
      onClick={(e) => {
        e.preventDefault()
        if (download_url) {
          axios.get(download_url).then(({data}) => {
            window.location.href = data
          })
        }
        analytics.events.activityCtaClick('lesson download', slug)
      }}
      aria-label="download video"
      className="flex items-center justify-center w-10 h-10 text-white border-none"
      type="button"
    >
      <IconDownload className="w-6" />
    </button>
  ) : state === 'RETIRED' ? null : (
    <Link href="/pricing" passHref>
      <a
        aria-label="become a member to download this lesson"
        className="flex items-center justify-center w-10 h-10 opacity-50"
      >
        <IconDownload className="w-6" />
      </a>
    </Link>
  )
}

const DownloadControl: FunctionComponent<
  React.PropsWithChildren<DownloadControlProps>
> = ({slug, download_url, state}) => {
  return (
    <Tippy
      offset={[0, -2]}
      content={
        <div className="px-2 py-1 text-sm bg-gray-900 rounded-sm">
          {download_url
            ? 'Download video'
            : 'Become a member to download this lesson'}
        </div>
      }
    >
      <div>
        <DownloadButton slug={slug} download_url={download_url} state={state} />
      </div>
    </Tippy>
  )
}

const IconDownload: FunctionComponent<
  React.PropsWithChildren<{className?: string}>
> = ({className = ''}) => (
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
