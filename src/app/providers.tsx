'use client'

import {QueryClientProvider, QueryClient} from '@tanstack/react-query'
import {ViewerProvider} from 'context/viewer-context'
import {CioProvider} from 'hooks/use-cio'
import {ThemeProvider} from 'next-themes'

export function Providers({children}: {children: React.ReactNode}) {
  const queryClient = new QueryClient()
  return (
    <ThemeProvider attribute="class">
      <ViewerProvider>
        <QueryClientProvider client={queryClient}>
          <CioProvider>{children}</CioProvider>
        </QueryClientProvider>
      </ViewerProvider>
    </ThemeProvider>
  )
}
