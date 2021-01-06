import * as React from 'react'
import {FunctionComponent} from 'react'
import Header from './Header_'
import Main from './Main_'
import Footer from './Footer_'

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
