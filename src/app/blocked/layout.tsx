import * as React from 'react'
import {FunctionComponent} from 'react'
import Header from '@/components/app/header'
import Main from '@/components/app/app-main'
import Footer from '@/components/app/app-footer'
import '@/styles/index.css'
import {Providers} from '../providers'

const Layout: FunctionComponent<React.PropsWithChildren<unknown>> = ({
  children,
}) => {
  return (
    <html>
      <body>
        <div className="flex flex-col min-h-screen">
          <Providers>
            <Header />
            <Main>{children}</Main>
            <Footer />
          </Providers>
        </div>
      </body>
    </html>
  )
}

export default Layout
