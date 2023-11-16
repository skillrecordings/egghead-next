'use client'

import {ViewerProvider} from '@/context/viewer-context'
import {CioProvider} from '@/hooks/use-cio'
import {ThemeProvider} from 'next-themes'
import TrpcProvider from '@/app/_trpc/Provider'

export function Providers({children}: {children: React.ReactNode}) {
  return (
    <ThemeProvider attribute="class">
      <ViewerProvider>
        <TrpcProvider>
          <CioProvider>{children}</CioProvider>
        </TrpcProvider>
      </ViewerProvider>
    </ThemeProvider>
  )
}
