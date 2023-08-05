import * as React from 'react'
import {FunctionComponent} from 'react'
import Header from './header'
import Main from './main'
import Footer from './footer'

const Layout: FunctionComponent<React.PropsWithChildren<unknown>> = ({
  children,
}) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Main>{children}</Main>
      <Footer />
    </div>
  )
}

export const getLayout = (page: JSX.Element) => <Layout>{page}</Layout>

export default Layout
