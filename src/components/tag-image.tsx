import Image from 'next/image'
import * as React from 'react'

// A tiny image component that disappears when the image fails to load.
// Optimised for tag icons which are small and non-critical.
export interface TagImageProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'> {
  src: string
  alt: string
  width?: number
  height?: number
}

const TagImage: React.FC<TagImageProps> = ({
  src,
  alt,
  width = 20,
  height = 20,
  ...rest
}) => {
  const [hasError, setHasError] = React.useState(false)

  if (hasError) return null

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      onError={() => {
        // Hide the image if it fails to load (e.g. 404)
        // eslint-disable-next-line no-console
        console.error(`TagImage: failed to load ${src}`)
        setHasError(true)
      }}
      {...rest}
    />
  )
}

export default TagImage
