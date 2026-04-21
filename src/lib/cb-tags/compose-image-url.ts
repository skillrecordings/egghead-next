const CLOUDFRONT_TAG_BASE =
  'https://d2eip9sf3oo6c2.cloudfront.net/tags/images'

const CLOUDFRONT_TAG_PATH_RE =
  /^(https?:\/\/d2eip9sf3oo6c2\.cloudfront\.net\/tags\/images\/\d{3}\/\d{3}\/\d{3})\/(thumb|square_\d+)\/(.+)$/

export type TagImageSize = 'thumb' | 'square_480' | 'square_280' | 'square_256'

function padLegacyId(legacyId: number): string {
  const padded = String(legacyId).padStart(9, '0')
  return `${padded.slice(0, 3)}/${padded.slice(3, 6)}/${padded.slice(6, 9)}`
}

export function composeTagImageUrl(opts: {
  imageUrl: string | null | undefined
  legacyId: number | null | undefined
  size?: TagImageSize
}): string | null {
  const {imageUrl, legacyId, size = 'square_480'} = opts
  if (!imageUrl) return null

  if (/^https?:\/\//i.test(imageUrl)) {
    const cfMatch = imageUrl.match(CLOUDFRONT_TAG_PATH_RE)
    if (cfMatch) {
      const [, prefix, , filename] = cfMatch
      return `${prefix}/${size}/${filename}`
    }
    return imageUrl
  }

  if (!legacyId) return null
  return `${CLOUDFRONT_TAG_BASE}/${padLegacyId(legacyId)}/${size}/${imageUrl}`
}
