import * as React from 'react'
import {FunctionComponent} from 'react'
import useClipboard from 'react-use-clipboard'

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

const CopyToClipboard: FunctionComponent<{
  stringToCopy: string
  className?: string
  label?: boolean
}> = ({stringToCopy = '', className = '', label = false}) => {
  const [isCopied, setCopied] = useClipboard(stringToCopy, {
    successDuration: 1000,
  })

  return (
    <div className={className}>
      <button
        type="button"
        onClick={setCopied}
        className={`group flex text-sm items-center space-x-1 rounded p-2 bg-gray-50 hover:bg-blue-100 hover:text-blue-600 transition-colors ease-in-out duration-150`}
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

export default CopyToClipboard
