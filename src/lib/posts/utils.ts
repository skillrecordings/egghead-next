import type {ParsedSlug} from '@/schemas/post'

export function parseSlugForHash(rawSlug: string | string[]): ParsedSlug {
  if (!rawSlug) {
    throw new Error('Slug is required')
  }

  const slug = String(rawSlug)

  // Course Builder slugs include a `~<id>` suffix. Legacy slugs do not.
  // Never derive a fallback hash from the last dash-separated segment because
  // that causes loose SQL matching against unrelated content (for example a
  // slug ending in `vite` matching `joe-previte`).
  const tildeIndex = slug.lastIndexOf('~')
  if (tildeIndex === -1) {
    return {
      hashFromSlug: '',
      originalSlug: slug,
    }
  }

  return {
    hashFromSlug: slug.substring(tildeIndex + 1),
    originalSlug: slug,
  }
}

export function convertToSerializeForNextResponse(result: any) {
  if (!result) return null

  for (const resultKey in result) {
    if (result[resultKey] instanceof Date) {
      result[resultKey] = result[resultKey].toISOString()
    } else if (
      result[resultKey]?.constructor?.name === 'Decimal' ||
      result[resultKey]?.constructor?.name === 'i'
    ) {
      result[resultKey] = result[resultKey].toNumber()
    } else if (result[resultKey]?.constructor?.name === 'BigInt') {
      result[resultKey] = Number(result[resultKey])
    } else if (result[resultKey] instanceof Object) {
      result[resultKey] = convertToSerializeForNextResponse(result[resultKey])
    }
  }

  return result
}
