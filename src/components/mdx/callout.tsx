import React from 'react'
import {twMerge} from 'tailwind-merge'

type CalloutProps = {
  text?: string
  className?: string
}

const Callout: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<CalloutProps>>
> = ({text, className, children}) => {
  return (
    <div className="sm:mx-auto -mx-4">
      <div
        className={twMerge(
          'sm:py-5 sm:px-5 py-3 px-5 leading-relaxed my-3 w-full dark:bg-gray-800 bg-blue-200/20 border-l-4 dark:border-blue-600 border-blue-500 items-center text-left shadow-sm sm:rounded-md overflow-hidden lg:text-lg sm:text-md',
          className,
        )}
        aria-label="callout"
      >
        {text ? <p>{text}</p> : children}
      </div>
    </div>
  )
}

export default Callout
