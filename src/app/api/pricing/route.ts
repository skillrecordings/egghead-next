import {NextRequest, NextResponse} from 'next/server'
import {geolocation, ipAddress} from '@vercel/functions'
import axios from 'axios'
import {ACCESS_TOKEN_KEY} from '@/utils/auth'
import countries from 'i18n-iso-countries'
import enLocale from 'i18n-iso-countries/langs/en.json'
import {withAppApiLogging} from '@/lib/logging'
import {getRedis} from '@/lib/upstash-redis'

// Register English locale for country name lookups
countries.registerLocale(enLocale)

function fnv1a32(input: string): string {
  // Small, stable fingerprint for grouping high-cardinality strings in logs.
  // Output: 8-char hex (uint32).
  let hash = 2166136261
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return (hash >>> 0).toString(16).padStart(8, '0')
}

function sanitizeForwardedHeader(input: unknown): string | null {
  if (typeof input !== 'string') return null

  const normalized = input
    .replace(/[\r\n]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  if (!normalized) return null

  // Node rejects header values with characters outside latin1 / valid header content.
  return Buffer.from(normalized, 'latin1').toString('latin1') === normalized
    ? normalized
    : null
}

function sanitizeErrorMessage(input: unknown): string | null {
  if (input == null) return null
  const raw = typeof input === 'string' ? input : String(input)

  // Avoid leaking secrets/PII in logs.
  const redacted = raw
    .replace(/Bearer\s+[A-Za-z0-9._-]+/g, 'Bearer [redacted]')
    .replace(/(sk|rk|pk)_(live|test)_[A-Za-z0-9]+/g, '[redacted_key]')
    .replace(
      /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g,
      '[redacted_email]',
    )

  const oneLine = redacted.replace(/\s+/g, ' ').trim()
  if (!oneLine) return null
  const max = 300
  return oneLine.length > max ? `${oneLine.slice(0, max)}...` : oneLine
}

const PRICING_PROXY_CACHE_PREFIX = 'pricing-proxy'
const PRICING_PROXY_CACHE_TTL_SECONDS = Number(
  process.env.PRICING_PROXY_CACHE_TTL_SECONDS ?? '300',
)

type PricingCacheEntry = {value: unknown; expiresAt: number}
type PricingCacheStatus = 'memory_hit' | 'redis_hit' | 'miss' | 'skip'

const pricingMemoryCache = new Map<string, PricingCacheEntry>()
const pricingInFlight = new Map<
  string,
  Promise<{value: unknown; cacheStatus: PricingCacheStatus}>
>()

function pricingMemoryGet<T>(key: string): T | undefined {
  const entry = pricingMemoryCache.get(key)
  if (!entry) return undefined
  if (Date.now() >= entry.expiresAt) {
    pricingMemoryCache.delete(key)
    return undefined
  }
  return entry.value as T
}

function pricingMemorySet(key: string, value: unknown) {
  if (!Number.isFinite(PRICING_PROXY_CACHE_TTL_SECONDS)) return
  if (PRICING_PROXY_CACHE_TTL_SECONDS <= 0) return

  pricingMemoryCache.set(key, {
    value,
    expiresAt: Date.now() + PRICING_PROXY_CACHE_TTL_SECONDS * 1000,
  })
}

function normalizeSearchParams(searchParams: URLSearchParams): string {
  const sortedEntries = Array.from(searchParams.entries()).sort(
    ([a, av], [b, bv]) => {
      const keyCompare = a.localeCompare(b)
      if (keyCompare !== 0) return keyCompare
      return av.localeCompare(bv)
    },
  )

  const normalized = new URLSearchParams()
  for (const [key, value] of sortedEntries) {
    normalized.append(key, value)
  }

  return normalized.toString()
}

function buildPricingCacheKey(args: {
  siteClientId: string | null
  country: string | null
  countryName: string | null
  queryString: string
}) {
  const queryFingerprint = fnv1a32(args.queryString || '_')

  return [
    PRICING_PROXY_CACHE_PREFIX,
    'v1',
    args.siteClientId ?? 'no-site-client',
    args.country ?? 'no-country',
    args.countryName ?? 'no-country-name',
    queryFingerprint,
  ].join(':')
}

async function getCachedPricingValue<T>(
  key: string,
  fetcher: () => Promise<T>,
): Promise<{value: T; cacheStatus: PricingCacheStatus}> {
  const mem = pricingMemoryGet<T>(key)
  if (mem !== undefined) {
    return {value: mem, cacheStatus: 'memory_hit'}
  }

  const existing = pricingInFlight.get(key)
  if (existing) {
    const result = await existing
    return {value: result.value as T, cacheStatus: result.cacheStatus}
  }

  const promise = (async () => {
    const redis = getRedis()

    if (redis) {
      try {
        const cached = await redis.get<T>(key)
        if (cached !== null && cached !== undefined) {
          pricingMemorySet(key, cached)
          return {value: cached, cacheStatus: 'redis_hit' as const}
        }
      } catch {
        // fail open if Redis is unavailable
      }
    }

    const fetched = await fetcher()
    pricingMemorySet(key, fetched)

    if (redis && Number.isFinite(PRICING_PROXY_CACHE_TTL_SECONDS)) {
      try {
        await redis.set(key, fetched, {ex: PRICING_PROXY_CACHE_TTL_SECONDS})
      } catch {
        // fail open if Redis set fails
      }
    }

    return {value: fetched, cacheStatus: 'miss' as const}
  })()

  pricingInFlight.set(key, promise)
  try {
    const result = await promise
    return {value: result.value as T, cacheStatus: result.cacheStatus}
  } finally {
    pricingInFlight.delete(key)
  }
}

function createPricingResponse(
  body: unknown,
  options: {cacheStatus: PricingCacheStatus; cacheableCandidate: boolean},
) {
  const response = NextResponse.json(body)

  response.headers.set('x-pricing-cache', options.cacheStatus)

  if (options.cacheableCandidate) {
    response.headers.set(
      'Cache-Control',
      'public, max-age=60, stale-while-revalidate=300',
    )
  }

  return response
}

/**
 * Proxy endpoint for pricing API that forwards geolocation headers
 * This allows the Rails backend to determine PPP (Purchasing Power Parity) discounts
 *
 * Using @vercel/functions for cleaner geolocation data access
 * Reference: https://vercel.com/docs/functions/vercel-functions/geolocation
 */
async function _GET(request: NextRequest) {
  const start = performance.now()
  const requestId = request.headers.get('x-egghead-request-id')
  const geo = geolocation(request)
  const ip = ipAddress(request)
  let railsStartedAt: number | null = null

  // Build headers to forward to Rails backend
  const geoHeaders: Record<string, string> = {}

  const safeCountry = sanitizeForwardedHeader(geo?.country)
  const safeCountryName = safeCountry
    ? sanitizeForwardedHeader(countries.getName(safeCountry, 'en'))
    : null
  if (safeCountry) {
    geoHeaders['x-vercel-ip-country'] = safeCountry
    if (safeCountryName) {
      geoHeaders['x-country-name'] = safeCountryName
    }
  }

  const safeCity = sanitizeForwardedHeader(geo?.city)
  if (safeCity) {
    geoHeaders['x-vercel-ip-city'] = safeCity
  }

  const safeRegion = sanitizeForwardedHeader(geo?.countryRegion)
  if (safeRegion) {
    geoHeaders['x-vercel-ip-country-region'] = safeRegion
  }

  const safeLatitude = sanitizeForwardedHeader(geo?.latitude)
  if (safeLatitude) {
    geoHeaders['x-vercel-ip-latitude'] = safeLatitude
  }

  const safeLongitude = sanitizeForwardedHeader(geo?.longitude)
  if (safeLongitude) {
    geoHeaders['x-vercel-ip-longitude'] = safeLongitude
  }

  if (ip) {
    geoHeaders['x-forwarded-for'] = ip
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('[Pricing Proxy] Geolocation data:', {
      country: safeCountry,
      countryName: safeCountryName,
      city: safeCity,
      region: safeRegion,
      latitude: safeLatitude,
      longitude: safeLongitude,
      ip,
      headers: geoHeaders,
    })
  }

  const accessToken = request.cookies.get(ACCESS_TOKEN_KEY)
  const hasToken = Boolean(accessToken?.value)
  const authorizationHeader = accessToken?.value
    ? {Authorization: `Bearer ${accessToken.value}`}
    : {}

  const searchParams = request.nextUrl.searchParams
  const queryParams = Object.fromEntries(searchParams.entries())
  const queryKeys = Array.from(searchParams.keys()).sort()
  const normalizedQueryString = normalizeSearchParams(searchParams)

  const hasCouponParam = Boolean(searchParams.get('coupon'))
  const hasDiscountCodeParam = Boolean(searchParams.get('dc'))
  const hasEncodedParams =
    Boolean(searchParams.get('en')) || Boolean(searchParams.get('dc'))
  const cacheableCandidate =
    !hasToken && !hasCouponParam && !hasDiscountCodeParam && !hasEncodedParams

  const siteClientId = process.env.NEXT_PUBLIC_CLIENT_ID ?? null
  const cacheKey = cacheableCandidate
    ? buildPricingCacheKey({
        siteClientId,
        country: safeCountry,
        countryName: safeCountryName,
        queryString: normalizedQueryString,
      })
    : null

  try {
    const fetchPricingFromRails = async () => {
      railsStartedAt = performance.now()
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_AUTH_DOMAIN}/api/v1/next/pricing`,
        {
          params: queryParams,
          headers: {
            ...authorizationHeader,
            'X-SITE-CLIENT': process.env.NEXT_PUBLIC_CLIENT_ID,
            ...geoHeaders,
          },
        },
      )

      return response.data
    }

    let cacheStatus: PricingCacheStatus = 'skip'
    let body: unknown

    if (cacheKey) {
      const cached = await getCachedPricingValue(
        cacheKey,
        fetchPricingFromRails,
      )
      cacheStatus = cached.cacheStatus
      body = cached.value
    } else {
      body = await fetchPricingFromRails()
    }

    try {
      console.log(
        JSON.stringify({
          event: 'pricing.proxy.cache',
          request_id: requestId,
          status: cacheStatus,
          cacheable_candidate: cacheableCandidate,
          has_token: hasToken,
          has_coupon_param: hasCouponParam,
          geo_country: safeCountry,
          query_keys: queryKeys,
          query_fingerprint: fnv1a32(normalizedQueryString || '_'),
        }),
      )
    } catch {
      // logging must never crash
    }

    return createPricingResponse(body, {cacheStatus, cacheableCandidate})
  } catch (error: any) {
    const duration_ms = Math.round(performance.now() - start)
    const rails_duration_ms =
      railsStartedAt != null
        ? Math.round(performance.now() - railsStartedAt)
        : null
    const error_message = sanitizeErrorMessage(
      error?.response?.data?.error ??
        error?.response?.data?.message ??
        error?.message,
    )
    const error_fingerprint = error_message
      ? fnv1a32(error_message)
      : sanitizeErrorMessage(error?.message)
      ? fnv1a32(String(error?.message))
      : null

    try {
      const railsStatus =
        typeof error?.response?.status === 'number'
          ? error.response.status
          : null

      const log = {
        event: 'pricing.proxy.error',
        ok: false,
        duration_ms,
        rails_duration_ms,
        request_id: requestId,
        rails_status: railsStatus,
        axios_code: error?.code ?? null,
        error_message,
        error_fingerprint,
        has_token: hasToken,
        cacheable_candidate: cacheableCandidate,
        site_client_id: siteClientId,
        has_site_client: Boolean(siteClientId),
        geo_country: safeCountry,
        has_geo_country: Boolean(safeCountry),
        has_ip: Boolean(ip),
        query_keys: queryKeys,
        has_coupon_param: hasCouponParam,
      }

      console.error(JSON.stringify(log))
    } catch {
      // Never crash the handler due to logging failures.
    }

    if (error.response) {
      const response = NextResponse.json(error.response.data, {
        status: error.response.status,
      })
      response.headers.set('x-pricing-cache', 'error')
      return response
    } else {
      const response = NextResponse.json(
        {error: 'Failed to fetch pricing data'},
        {status: 500},
      )
      response.headers.set('x-pricing-cache', 'error')
      return response
    }
  }
}

export const GET = withAppApiLogging(_GET)
