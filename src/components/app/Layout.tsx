import * as React from 'react'
import {FunctionComponent} from 'react'
import Header from './Header'
import Main from './Main'
import Footer from './Footer'

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
