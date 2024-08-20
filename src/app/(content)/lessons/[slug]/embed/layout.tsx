'use client'

import * as React from 'react'
import {FunctionComponent} from 'react'
import TrpcProvider from '@/app/_trpc/Provider'
import '@/styles/index.css'

const Layout: FunctionComponent<React.PropsWithChildren<unknown>> = ({
  children,
}) => {
  return (
    <html>
      <body>
        <TrpcProvider>{children}</TrpcProvider>
      </body>
    </html>
  )
}

export default Layout
