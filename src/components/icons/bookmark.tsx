import * as React from 'react'

const BookmarkIcon: React.FunctionComponent<{
  className?: string
  fill?: boolean
}> = ({className, fill = false}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill={fill ? 'currentColor' : 'none'}
      viewBox="0 0 24 24"
      stroke="currentColor"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
      />
    </svg>
  )
}

export default BookmarkIcon
