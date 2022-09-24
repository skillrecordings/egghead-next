import * as React from 'react'
import Image, {ImageProps} from 'next/image'

const BLUR_DATA_URL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mO8//B+PQAIZgMgYk3sYgAAAABJRU5ErkJggg=='

const ImageWithPlaceholder = (props: ImageProps) => (
  <Image placeholder="blur" blurDataURL={BLUR_DATA_URL} {...props} />
)

export default ImageWithPlaceholder
