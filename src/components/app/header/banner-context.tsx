'use client'

import * as React from 'react'
import type {HeaderBannerData} from './banner-data'

const HeaderBannerContext = React.createContext<HeaderBannerData | undefined>(
  undefined,
)

export function HeaderBannerProvider({
  children,
  initialData,
}: {
  children: React.ReactNode
  initialData?: HeaderBannerData
}) {
  const value = React.useMemo(() => initialData, [initialData])

  return (
    <HeaderBannerContext.Provider value={value}>
      {children}
    </HeaderBannerContext.Provider>
  )
}

export function useHeaderBannerData() {
  return React.useContext(HeaderBannerContext)
}
