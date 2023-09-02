'use client'

import {ViewerProvider} from 'context/viewer-context'
import {CioProvider} from 'hooks/use-cio'

export function Providers({children}: {children: React.ReactNode}) {
  return (
    <ViewerProvider>
      <CioProvider>{children}</CioProvider>
    </ViewerProvider>
  )
}
