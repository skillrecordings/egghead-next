import * as React from 'react'
import {FunctionComponent} from 'react'
import Header from './Header'
import Footer from './Footer'
import Main from './Main'

const Layout: FunctionComponent = ({children}) => {
  return (
    <>
      <Header></Header>
      <Main>{children}</Main>
      <Footer></Footer>
    </>
  )
}

export default Layout
