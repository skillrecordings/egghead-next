import * as React from 'react'
import {FunctionComponent} from 'react'
import {Tooltip} from 'react-tippy'

const TheaterModeToggle: FunctionComponent<{
  toggleTheaterMode: () => void
  theaterMode: boolean
  className?: string
}> = ({toggleTheaterMode, theaterMode, className}) => {
  return (
    <Tooltip
      title={theaterMode ? 'Disable theater mode' : 'Activate theater mode'}
    >
      <button onClick={toggleTheaterMode} className="p-2">
        {theaterMode ? (
          <IconTheaterModeOff className={className} />
        ) : (
          <IconTheaterModeOn className={className} />
        )}
      </button>
    </Tooltip>
  )
}

const IconTheaterModeOn: FunctionComponent<{className?: string}> = ({
  className = '',
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    className={className}
  >
    <g fill="currentColor">
      <path fill="none" d="M0 0h24v24H0z"></path>
      <path d="M12 15l-4.243-4.243 1.415-1.414L12 12.172l2.828-2.829 1.415 1.414z"></path>
    </g>
  </svg>
)

const IconTheaterModeOff: FunctionComponent<{className?: string}> = ({
  className = '',
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="currentColor"
    className={className}
  >
    <path d="M7,9 L7,16 L4.20703,13.20703 L1.70703,15.70703 C1.51172,15.90234 1.25586,16 1,16 C0.74414,16 0.48828,15.90234 0.29297,15.70703 C-0.09765,15.31641 -0.09765,14.68359 0.29297,14.29297 L0.29297,14.29297 L2.79297,11.79297 L0,9 L7,9 Z M9,0 L11.79297,2.79297 L14.29297,0.29297 C14.68359,-0.09765 15.31641,-0.09765 15.70703,0.29297 C16.09765,0.68359 16.09765,1.31641 15.70703,1.70703 L15.70703,1.70703 L13.20703,4.20703 L16,7 L9,7 L9,0 Z" />
  </svg>
)

export default TheaterModeToggle
