import * as React from 'react'
import {FunctionComponent} from 'react'
import useClipboard from 'react-use-clipboard'
import {isEmpty, get} from 'lodash'

type ShareProps = {
  title?: string
  label?: boolean
  resource: {title: string; path: string; type: string}
  instructor: {slug: string; twitter?: string}
  className?: string
}

const Share: FunctionComponent<ShareProps> = ({
  children,
  resource,
  instructor,
  className,
  label = false,
  title = `Share this ${
    resource.type === 'lesson' ? 'video' : 'course'
  } with your friends`,
}) => {
  return (
    <>
      <h4 className="text-sm">{children || title}</h4>
      <div className={className || 'flex items-center mt-3'}>
        <div className={'flex items-center space-x-1'}>
          <TweetLink label resource={resource} instructor={instructor} />
          <CopyToClipboard
            label
            stringToCopy={`${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}${resource.path}`}
          />
        </div>
      </div>
    </>
  )
}

const TweetLink: FunctionComponent<ShareProps> = ({
  resource,
  instructor,
  className = '',
  label = false,
}) => {
  const encodeTweetUrl = () => {
    const twitterBase = `https://twitter.com/intent/tweet/?text=`
    const instructorTwitterText = isEmpty(get(instructor, 'twitter'))
      ? ''
      : `by @${instructor.twitter}`
    const tweetText = `${resource.title} ${instructorTwitterText} (${resource.type} on @eggheadio)`
    const encodeResourceUrl = encodeURIComponent(
      process.env.NEXT_PUBLIC_DEPLOYMENT_URL + resource.path,
    )
    const tweetParams = `&url=${encodeResourceUrl}`
    return twitterBase + tweetText + tweetParams
  }
  return get(resource, 'title') && get(resource, 'path') ? (
    <a
      className={`group flex text-sm items-center space-x-1 rounded p-2 bg-gray-50 hover:bg-blue-100 hover:text-blue-600 transition-colors ease-in-out duration-150 ${className}`}
      target="_blank"
      rel="noopener noreferrer"
      href={encodeTweetUrl()}
    >
      <IconTwitter className="w-5" />
      {label && <span>Send Tweet</span>}
    </a>
  ) : null
}
const CopyToClipboard: FunctionComponent<{
  stringToCopy: string
  className?: string
  label?: boolean
}> = ({stringToCopy = '', className = '', label = false}) => {
  const [isCopied, setCopied] = useClipboard(stringToCopy, {
    successDuration: 1000,
  })

  return (
    <div>
      <button
        type="button"
        onClick={setCopied}
        className={`group flex text-sm items-center space-x-1 rounded p-2 bg-gray-50 hover:bg-blue-100 hover:text-blue-600 transition-colors ease-in-out duration-150 ${className}`}
      >
        {isCopied ? (
          'Copied'
        ) : (
          <>
            <IconLink className="w-5" />
            {label && (
              <span>
                Copy link
                <span className="hidden lg:inline"> to clipboard</span>
              </span>
            )}
          </>
        )}
      </button>
    </div>
  )
}

const IconLink: FunctionComponent<{className?: string}> = ({
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
      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
    />
  </svg>
)

const IconTwitter: FunctionComponent<{className?: string}> = ({
  className = '',
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className={className}
  >
    <g fill="currentColor">
      <path fill="none" d="M0 0h24v24H0z"></path>
      <path d="M22.162 5.656a8.384 8.384 0 0 1-2.402.658A4.196 4.196 0 0 0 21.6 4c-.82.488-1.719.83-2.656 1.015a4.182 4.182 0 0 0-7.126 3.814 11.874 11.874 0 0 1-8.62-4.37 4.168 4.168 0 0 0-.566 2.103c0 1.45.738 2.731 1.86 3.481a4.168 4.168 0 0 1-1.894-.523v.052a4.185 4.185 0 0 0 3.355 4.101 4.21 4.21 0 0 1-1.89.072A4.185 4.185 0 0 0 7.97 16.65a8.394 8.394 0 0 1-6.191 1.732 11.83 11.83 0 0 0 6.41 1.88c7.693 0 11.9-6.373 11.9-11.9 0-.18-.005-.362-.013-.54a8.496 8.496 0 0 0 2.087-2.165z"></path>
    </g>
  </svg>
)

export default Share
