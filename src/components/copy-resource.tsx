import {type FunctionComponent} from 'react'
import toast from 'react-hot-toast'
import useClipboard from 'react-use-clipboard'

const CopyToClipboard: FunctionComponent<
  React.PropsWithChildren<{
    stringToCopy: string
    className?: string
  }>
> = ({stringToCopy = '', className = ''}) => {
  const duration: number = 1000
  const [isCopied, setCopied] = useClipboard(stringToCopy, {
    successDuration: duration,
  })
  const handleCopyToClipboard = () => {
    setCopied()
    !isCopied && toast('Link copied to clipboard', {duration})
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleCopyToClipboard}
        className={`group flex text-sm items-center space-x-1 rounded-md p-2 bg-gray-50 dark:bg-gray-800 text-black dark:text-white dark:hover:bg-gray-700 hover:bg-blue-100 dark:hover:text-blue-500 hover:text-blue-600 transition-colors ease-in-out duration-300 ${className}`}
        aria-label="Copy link"
      >
        <IconLink className="w-5" />
      </button>
    </div>
  )
}

export const IconLink: FunctionComponent<
  React.PropsWithChildren<{className?: string}>
> = ({className = 'w-5'}) => (
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

export default CopyToClipboard
