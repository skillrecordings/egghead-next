import Image from 'next/image'
import * as React from 'react'
import {ErrorBoundary} from 'react-error-boundary'

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
  const [validImageSrc, setValidImageSrc] = React.useState<string | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    setIsLoading(true)
    setValidImageSrc(null)

    const testImage = (src: string): Promise<string> => {
      return new Promise((resolve, reject) => {
        const img = new window.Image()
        img.onload = () => resolve(src)
        img.onerror = () => reject(new Error(`Failed to load: ${src}`))
        img.src = src
      })
    }

    const testImages = async () => {
      const sources = [primarySrc, fallbackSrc].filter(Boolean) as string[]

      if (sources.length === 0) {
        setIsLoading(false)
        return
      }

      for (const src of sources) {
        try {
          const validSrc = await testImage(src)
          setValidImageSrc(validSrc)
          setIsLoading(false)
          return
        } catch (error) {
          console.error(`SafeImage: failed to load ${src}`)
        }
      }

      // All sources failed
      setIsLoading(false)
    }

    testImages()
  }, [primarySrc, fallbackSrc])

  if (isLoading || !validImageSrc) return null

  return (
    <ErrorBoundary fallback={null}>
      <Image
        src={validImageSrc}
        alt={alt}
        width={width}
        height={height}
        {...rest}
      />
    </ErrorBoundary>
  )
}

export default SafeImage
