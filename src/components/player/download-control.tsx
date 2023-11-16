import * as React from 'react'
import {FunctionComponent} from 'react'
import axios from '@/utils/configured-axios'
import analytics from '@/utils/analytics'
import * as Tooltip from '@radix-ui/react-tooltip'
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

const DownloadButtonWithTooltip: FunctionComponent<
  React.PropsWithChildren<DownloadButtonProps>
> = ({slug, download_url, state}) => {
  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          {download_url ? (
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
            <Link
              href="/pricing"
              passHref
              aria-label="become a member to download this lesson"
              className="flex items-center justify-center w-10 h-10 opacity-50"
            >
              <IconDownload className="w-6" />
            </Link>
          )}
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content className="z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2">
            <div className="block z-10 px-2 py-1 text-sm bg-gray-900 rounded-sm">
              {download_url
                ? 'Download video'
                : 'Become a member to download this lesson'}
            </div>
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  )
}

class DownloadControlErrorBoundary extends React.Component {
  constructor(props: any) {
    super(props)
    this.state = {hasError: false}
  }

  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI.
    return {hasError: true}
  }

  componentDidCatch(error: any, info: any) {
    console.error(error, info.componentStack)
  }

  render() {
    // @ts-ignore
    if (this.state.hasError) {
      // You can render any custom fallback UI
      // @ts-ignore
      return <div></div>
    }

    // @ts-ignore
    return this.props.children
  }
}

const DownloadControl: FunctionComponent<
  React.PropsWithChildren<DownloadControlProps>
> = ({slug, download_url, state}) => {
  return (
    <DownloadControlErrorBoundary>
      <DownloadButtonWithTooltip
        slug={slug}
        download_url={download_url}
        state={state}
      />
    </DownloadControlErrorBoundary>
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
