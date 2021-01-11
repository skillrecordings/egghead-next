import React, {FunctionComponent} from 'react'

const CancelIcon: FunctionComponent<{
  className?: string
  strokeWidth: number
}> = ({className = '', strokeWidth = 2}) => (
  <svg
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <g fill="none">
      <path
        d="M6 18L18 6M6 6l12 12"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  </svg>
)

export default CancelIcon
