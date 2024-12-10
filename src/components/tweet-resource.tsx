import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import {type FunctionComponent} from 'react'
import {twMerge} from 'tailwind-merge'

const TweetResource: FunctionComponent<React.PropsWithChildren<any>> = ({
  resource,
  instructor,
  className = '',
}) => {
  const encodeTweetUrl = () => {
    const twitterBase = `https://x.com/intent/post/?text=`
    const instructorTwitterText = isEmpty(get(instructor, 'twitter'))
      ? ''
      : `by @${instructor.twitter}`
    const tweetText = `${resource.title} ${instructorTwitterText} (${
      resource.type === 'playlist' ? 'course' : resource.type
    } on @eggheadio)`
    const encodeResourceUrl = encodeURIComponent(
      process.env.NEXT_PUBLIC_DEPLOYMENT_URL + resource.path,
    )
    const tweetParams = `&url=${encodeResourceUrl}`
    return twitterBase + tweetText + tweetParams
  }
  return get(resource, 'title') && get(resource, 'path') ? (
    <a
      className={twMerge(
        `group flex text-sm items-center space-x-1 rounded-md p-2 bg-gray-50 dark:bg-gray-800 text-black dark:text-white dark:hover:bg-gray-700 dark:hover:text-blue-500 hover:bg-blue-100 hover:text-blue-600 transition-colors ease-in-out duration-300`,
        className,
      )}
      target="_blank"
      rel="noopener noreferrer"
      href={encodeTweetUrl()}
      aria-label="Share on X"
    >
      <IconTwitter className="w-5" />
    </a>
  ) : null
}

export const IconTwitter: FunctionComponent<
  React.PropsWithChildren<{className?: string}>
> = ({className = ''}) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
    <g>
      <path
        className="fill-current"
        d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
      />
    </g>
  </svg>
)

export default TweetResource
