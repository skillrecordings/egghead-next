import * as React from 'react'
import {FunctionComponent} from 'react'
import Header from './header'
import Main from './main'
import Footer from './footer'

const Layout: FunctionComponent = ({children}) => {
  return (
    <>
      <Header />
      <Main>{children}</Main>
      <Footer />
    </>
  )
}

export const getLayout = (page: JSX.Element) => <Layout>{page}</Layout>

export default Layout
