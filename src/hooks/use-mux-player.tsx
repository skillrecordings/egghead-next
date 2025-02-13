'use client'

import React, {createContext, useContext} from 'react'
import type {MuxPlayerRefAttributes} from '@mux/mux-player-react'

type MuxPlayerContextType = {
  setMuxPlayerRef: React.Dispatch<
    React.SetStateAction<React.RefObject<MuxPlayerRefAttributes | null> | null>
  >
  muxPlayerRef: React.RefObject<MuxPlayerRefAttributes | null> | null
}

export const MuxPlayerProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [muxPlayerRef, setMuxPlayerRef] =
    React.useState<React.RefObject<MuxPlayerRefAttributes | null> | null>(null)

  return (
    <MuxPlayerContext.Provider value={{muxPlayerRef, setMuxPlayerRef}}>
      {children}
    </MuxPlayerContext.Provider>
  )
}

const MuxPlayerContext = createContext<MuxPlayerContextType | undefined>(
  undefined,
)

export const useMuxPlayer = () => {
  const context = useContext(MuxPlayerContext)
  if (!context) {
    throw new Error('useMuxPlayer must be used within a MuxPlayerProvider')
  }
  return context
}
