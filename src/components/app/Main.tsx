import * as React from 'react'
import {FunctionComponent} from 'react'
import Footer from './Footer'

const Main: FunctionComponent = ({children}) => {
  return (
    <>
      <div className="w-full flex flex-col flex-grow px-5">{children}</div>
      <Footer />
    </>
  )
}

export default Main
