'use client'

import {ViewerProvider} from 'context/viewer-context'
import {CioProvider} from 'hooks/use-cio'
import {ThemeProvider} from 'next-themes'

export function Providers({children}: {children: React.ReactNode}) {
  return (
    <ThemeProvider attribute="class">
      <ViewerProvider>
        <CioProvider>{children}</CioProvider>
      </ViewerProvider>
    </ThemeProvider>
  )
}
