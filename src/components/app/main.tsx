import * as React from 'react'
import {FunctionComponent} from 'react'

const Main: FunctionComponent = ({children}) => {
  return (
    <div className="w-full flex flex-col flex-grow px-5 dark:bg-gray-900 dark:text-gray-100">
      {children}
    </div>
  )
}

export default Main
