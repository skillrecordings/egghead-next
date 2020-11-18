import * as React from 'react'
import {FunctionComponent} from 'react'
import Footer from './Footer'

const Main: FunctionComponent = ({children}) => {
  return (
    <>
      <div className="w-full flex flex-col flex-grow">{children}</div>
      <Footer />
    </>
  )
}

export default Main
