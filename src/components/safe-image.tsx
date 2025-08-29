import Image from 'next/image'
import * as React from 'react'

export interface SafeImageProps
  extends Omit<React.ComponentProps<typeof Image>, 'src' | 'alt'> {
  primarySrc?: string | null
  fallbackSrc?: string | null
  alt: string
  width?: number
  height?: number
}

const SafeImage: React.FC<SafeImageProps> = ({
  primarySrc,
  fallbackSrc,
  alt,
  width = 20,
  height = 20,
  ...rest
}) => {
  const [primaryError, setPrimaryError] = React.useState(false)
  const [fallbackError, setFallbackError] = React.useState(false)

  const currentSrc = React.useMemo(() => {
    if (!primaryError && primarySrc) return primarySrc
    if (!fallbackError && fallbackSrc) return fallbackSrc
    return null
  }, [primarySrc, fallbackSrc, primaryError, fallbackError])

  React.useEffect(() => {
    setPrimaryError(false)
    setFallbackError(false)
  }, [primarySrc, fallbackSrc])

  if (!currentSrc) return null

  return (
    <Image
      src={currentSrc}
      alt={alt}
      width={width}
      height={height}
      onError={() => {
        if (!primaryError && currentSrc === primarySrc) {
          console.error(`SafeImage: failed to load primary image ${primarySrc}`)
          setPrimaryError(true)
        } else if (!fallbackError && currentSrc === fallbackSrc) {
          console.error(
            `SafeImage: failed to load fallback image ${fallbackSrc}`,
          )
          setFallbackError(true)
        }
      }}
      {...rest}
    />
  )
}

export default SafeImage
