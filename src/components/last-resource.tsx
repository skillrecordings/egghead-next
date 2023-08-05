import useLastResource from 'hooks/use-last-resource'
import {isEmpty} from 'lodash'
import Link from 'next/link'
import * as React from 'react'
import {track} from 'utils/analytics'

const LastResource: React.FunctionComponent<
  React.PropsWithChildren<{
    className?: string
    location?: string
  }>
> = ({children, className, location}) => {
  const {lastResource, clearResource} = useLastResource()

  const trackAndClearResource = (event: string) => {
    if (!isEmpty(lastResource)) {
      track(event, {
        lesson: lastResource.slug,
        location,
      })
    }
    clearResource()
  }

  return !isEmpty(lastResource) ? (
    <div>
      {children}{' '}
      <Link href={lastResource.path}>
        <a
          onClick={() => {
            trackAndClearResource('clicked show last resource')
          }}
          className={className}
        >
          {lastResource.title}
        </a>
      </Link>
      <div className="w-100 flex items-center justify-end">
        <button
          className="rounded text-xs px-2 py-1 flex justify-center items-center bg-gray-100 hover:bg-gray-200 transition-colors duration-150 ease-in-out "
          onClick={() => {
            trackAndClearResource('clicked stop showing last resource')
          }}
        >
          x
        </button>
      </div>
    </div>
  ) : null
}

export default LastResource
