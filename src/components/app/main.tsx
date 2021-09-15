import * as React from 'react'
import {FunctionComponent} from 'react'

type MainProps = {
  children: React.ReactNode
  className?: string
}

const Main: FunctionComponent<MainProps> = ({children, className = ''}) => {
  return (
    <div
      className={`w-full flex flex-col flex-grow px-5 dark:bg-gray-900 dark:text-gray-100 py-5 ${className}`}
    >
      {children}
    </div>
  )
}

export default Main
