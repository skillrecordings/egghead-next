import * as React from 'react'
import {FunctionComponent} from 'react'
import Header from './Header'
import Footer from './Footer'
import Main from './Main'

const Layout: FunctionComponent = ({children}) => {
  return (
    <>
      <Header />
      <Main>{children}</Main>
      <Footer />
    </>
  )
}

export default Layout
