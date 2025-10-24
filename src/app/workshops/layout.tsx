import * as React from 'react'
import {FunctionComponent} from 'react'
import Header from '@/components/app/header'
import Main from '@/components/app/app-main'
import Footer from '@/components/app/app-footer'
import '@/styles/index.css'
import {Providers} from '../providers'

export const metadata = {
  title: 'Workshops',
  description: 'egghead.io workshops',
  icons: {
    icon: [
      {url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png'},
      {url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png'},
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

const Layout: FunctionComponent<React.PropsWithChildren<unknown>> = ({
  children,
}) => {
  return (
    <html lang="en">
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
