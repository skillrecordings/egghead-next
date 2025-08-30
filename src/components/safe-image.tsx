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
  const [currentImageSrc, setCurrentImageSrc] = React.useState<string | null>(
    primarySrc || fallbackSrc || null,
  )

  React.useEffect(() => {
    // Reset to primary source when props change
    setCurrentImageSrc(primarySrc || fallbackSrc || null)
  }, [primarySrc, fallbackSrc])

  if (!currentImageSrc) return null

  return (
    <Image
      src={currentImageSrc}
      alt={alt}
      width={width}
      height={height}
      onError={() => {
        if (currentImageSrc === primarySrc && fallbackSrc) {
          console.error(
            `SafeImage: primary image failed, trying fallback`,
            primarySrc,
          )
          setCurrentImageSrc(fallbackSrc)
        } else {
          console.error(`SafeImage: image failed to load`, currentImageSrc)
          setCurrentImageSrc(null)
        }
      }}
      {...rest}
    />
  )
}

export default SafeImage
