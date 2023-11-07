'use client'

import {ViewerProvider} from 'context/viewer-context'
import {CioProvider} from 'hooks/use-cio'
import {ThemeProvider} from 'next-themes'
import TrpcProvider from 'app/_trpc/Provider'
import PosthogClient from 'lib/posthog-client'
import {PostHogProvider} from 'posthog-js/react'

export function Providers({children}: {children: React.ReactNode}) {
  const posthog = PosthogClient.init()

  return (
    <ThemeProvider attribute="class">
      <ViewerProvider>
        <TrpcProvider>
          <CioProvider>
            <PostHogProvider client={posthog}>{children}</PostHogProvider>
          </CioProvider>
        </TrpcProvider>
      </ViewerProvider>
    </ThemeProvider>
  )
}
