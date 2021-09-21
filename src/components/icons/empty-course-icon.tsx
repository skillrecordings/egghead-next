import * as React from 'react'

const EmptyCourseIcon: React.FunctionComponent<{className?: string}> = ({
  className = 'fill-current text-gray-300 dark:text-gray-600',
}) => (
  <svg viewBox="0 0 58.08 47.22" width="110" class={className}>
    <g id="prefix__Layer_2" data-name="Layer 2">
      <g id="prefix__Artwork">
        <path
          className="prefix__cls-1"
          d="M1.84 7.26A2.94 2.94 0 000 10.41L1.84 22.5zM53 3.33l-.13-.83A2.93 2.93 0 0049.58 0l-22 3.3zM5 43.89l.13.83a2.94 2.94 0 003.37 2.47l22.05-3.3zM58.05 36.81l-1.81-12.09V40a2.94 2.94 0 001.81-3.19z"
        />
        <path
          className="prefix__cls-1"
          d="M53.28 4.33a2 2 0 012 2v34.6a2 2 0 01-2 2H4.8a2 2 0 01-2-2V6.29a2 2 0 012-2h48.48m0-1H4.8a3 3 0 00-3 3v34.64a3 3 0 003 3h48.48a3 3 0 003-3V6.29a3 3 0 00-3-3z"
        />
        <path
          className="prefix__cls-1"
          d="M22.07 15.37v16.5a1.31 1.31 0 002 1.12l13.55-8.19a1.31 1.31 0 000-2.23l-13.57-8.32a1.3 1.3 0 00-1.98 1.12z"
        />
      </g>
    </g>
  </svg>
)

export default EmptyCourseIcon
