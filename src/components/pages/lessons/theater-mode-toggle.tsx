import * as React from 'react'
import {FunctionComponent} from 'react'
import Tippy from '@tippyjs/react'

const TheaterModeToggle: FunctionComponent<
  React.PropsWithChildren<{
    toggleTheaterMode: () => void
    theaterMode: boolean
    className?: string
  }>
> = ({toggleTheaterMode, theaterMode, className}) => {
  return (
    <Tippy
      content={theaterMode ? 'Disable theater mode' : 'Activate theater mode'}
    >
      <button onClick={toggleTheaterMode} className="p-2">
        {theaterMode ? (
          <IconTheaterModeOff className={className} />
        ) : (
          <IconTheaterModeOn className={className} />
        )}
      </button>
    </Tippy>
  )
}

const IconTheaterModeOn: FunctionComponent<
  React.PropsWithChildren<{className?: string}>
> = ({className = ''}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 16 16"
    fill="currentColor"
    className={className}
  >
    <path d="M6,9 C6.25586,9 6.51172,9.09766 6.70703,9.29297 C7.09765,9.68359 7.09765,10.31641 6.70703,10.70703 L6.70703,10.70703 L4.20703,13.20703 L7,16 L1.8189894e-12,16 L1.81987758e-12,9 L2.79297,11.79297 L5.29297,9.29297 C5.48828,9.09766 5.74414,9 6,9 Z M16,-8.8817842e-16 L16,7 L13.20703,4.20703 L10.70703,6.70703 C10.31641,7.09765 9.68359,7.09765 9.29297,6.70703 C8.90235,6.31641 8.90235,5.68359 9.29297,5.29297 L9.29297,5.29297 L11.79297,2.79297 L9,-1.77635684e-15 L16,-8.8817842e-16 Z" />
  </svg>
)

const IconTheaterModeOff: FunctionComponent<
  React.PropsWithChildren<{className?: string}>
> = ({className = ''}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 16 16"
    fill="currentColor"
    className={className}
  >
    <path d="M7,9 L7,16 L4.20703,13.20703 L1.70703,15.70703 C1.51172,15.90234 1.25586,16 1,16 C0.74414,16 0.48828,15.90234 0.29297,15.70703 C-0.09765,15.31641 -0.09765,14.68359 0.29297,14.29297 L0.29297,14.29297 L2.79297,11.79297 L0,9 L7,9 Z M9,0 L11.79297,2.79297 L14.29297,0.29297 C14.68359,-0.09765 15.31641,-0.09765 15.70703,0.29297 C16.09765,0.68359 16.09765,1.31641 15.70703,1.70703 L15.70703,1.70703 L13.20703,4.20703 L16,7 L9,7 L9,0 Z" />
  </svg>
)

export default TheaterModeToggle
