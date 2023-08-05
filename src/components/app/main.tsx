import * as React from 'react'
import {FunctionComponent} from 'react'

type MainProps = {
  children: React.ReactNode
  className?: string
}

const Main: FunctionComponent<React.PropsWithChildren<MainProps>> = ({
  children,
  className = '',
}) => {
  return (
    <div
      className={`w-full flex flex-col flex-grow dark:bg-gray-900 dark:text-gray-100 ${className}`}
    >
      {children}
    </div>
  )
}

export default Main
