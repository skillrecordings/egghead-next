import * as React from 'react'
import {FunctionComponent} from 'react'

const Main: FunctionComponent = ({children}) => {
  return <div className="w-full flex flex-col flex-grow px-5">{children}</div>
}

export default Main
