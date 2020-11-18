import * as React from 'react'
import {FunctionComponent} from 'react'
import Header from './Header'
import Main from './Main'

const Layout: FunctionComponent = ({children}) => {
  return (
    <>
      <Header />
      <Main>{children}</Main>
    </>
  )
}

export default Layout
