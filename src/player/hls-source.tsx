import * as React from 'react'

export type HLSSourceProps = {
  src: string
  type?: string
}

export const HLSSource: React.FC<
  React.PropsWithChildren<HLSSourceProps>
> = () => {
  return null
}
;(HLSSource as any).__playerSource = 'hls-source'
