import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import {type FunctionComponent} from 'react'
import {twMerge} from 'tailwind-merge'

const BlueskyLink: FunctionComponent<React.PropsWithChildren<any>> = ({
  resource,
  instructor,
  className = '',
}) => {
  const encodeBlueskyUrl = () => {
    const blueskyBase = `https://bsky.app/intent/compose?text=`
    const instructorBlueskyText = isEmpty(get(instructor, 'bluesky'))
      ? ''
      : `by @${instructor.bluesky}`
    const postText = `${resource.title} ${instructorBlueskyText} -${
      resource.type === 'playlist' ? 'course' : resource.type
    } on @egghead.io
    

    ${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}${resource.path}`

    return blueskyBase + encodeURIComponent(postText)
  }
  return get(resource, 'title') && get(resource, 'path') ? (
    <a
      className={`group flex text-sm items-center space-x-1 rounded-md p-2 bg-gray-50 dark:bg-gray-800 text-black dark:text-white dark:hover:bg-gray-700 hover:bg-blue-100 dark:hover:text-blue-500 hover:text-blue-600 transition-colors ease-in-out duration-300 ${className}`}
      target="_blank"
      rel="noopener noreferrer"
      href={encodeBlueskyUrl()}
      aria-label="Share on Bluesky"
    >
      <IconBluesky className="w-5" />
    </a>
  ) : null
}

export const IconBluesky: FunctionComponent<
  React.PropsWithChildren<{className?: string}>
> = ({className = ''}) => (
  <svg
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 64 57"
    className={`w-5 ${className}`}
  >
    <path
      fill="currentColor"
      d="M13.873 3.805C21.21 9.332 29.103 20.537 32 26.55v15.882c0-.338-.13.044-.41.867-1.512 4.456-7.418 21.847-20.923 7.944-7.111-7.32-3.819-14.64 9.125-16.85-7.405 1.264-15.73-.825-18.014-9.015C1.12 23.022 0 8.51 0 6.55 0-3.268 8.579-.182 13.873 3.805ZM50.127 3.805C42.79 9.332 34.897 20.537 32 26.55v15.882c0-.338.13.044.41.867 1.512 4.456 7.418 21.847 20.923 7.944 7.111-7.32 3.819-14.64-9.125-16.85 7.405 1.264 15.73-.825 18.014-9.015C62.88 23.022 64 8.51 64 6.55c0-9.818-8.578-6.732-13.873-2.745Z"
    />
  </svg>
)

export default BlueskyLink
