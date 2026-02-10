import {cookies} from 'next/headers'
import {NextRequest, NextResponse} from 'next/server'
import {geolocation, ipAddress} from '@vercel/functions'
import axios from 'axios'
import {ACCESS_TOKEN_KEY} from '@/utils/auth'
import countries from 'i18n-iso-countries'
import enLocale from 'i18n-iso-countries/langs/en.json'
import {withAppApiLogging} from '@/lib/logging'

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

function sanitizeErrorMessage(input: unknown): string | null {
  if (input == null) return null
  const raw = typeof input === 'string' ? input : String(input)

  // Avoid leaking secrets/PII in logs.
  const redacted = raw
    .replace(/Bearer\\s+[A-Za-z0-9._\\-]+/g, 'Bearer [redacted]')
    .replace(/(sk|rk|pk)_(live|test)_[A-Za-z0-9]+/g, '[redacted_key]')
    .replace(
      /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}/g,
      '[redacted_email]',
    )

  const oneLine = redacted.replace(/\\s+/g, ' ').trim()
  if (!oneLine) return null
  const max = 300
  return oneLine.length > max ? `${oneLine.slice(0, max)}...` : oneLine
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

  try {
    // Get geolocation data using Vercel Functions helper
    // Build headers to forward to Rails backend
    const geoHeaders: Record<string, string> = {}

    // Forward Vercel geo data as headers that Rails expects
    if (geo?.country) {
      geoHeaders['x-vercel-ip-country'] = geo.country
      // Add country name header for Rails to use
      const countryName = countries.getName(geo.country, 'en')
      if (countryName) {
        geoHeaders['x-country-name'] = countryName
      }
    }
    if (geo?.city) {
      geoHeaders['x-vercel-ip-city'] = geo.city
    }
    if (geo?.countryRegion) {
      geoHeaders['x-vercel-ip-country-region'] = geo.countryRegion
    }
    if (geo?.latitude) {
      geoHeaders['x-vercel-ip-latitude'] = geo.latitude
    }
    if (geo?.longitude) {
      geoHeaders['x-vercel-ip-longitude'] = geo.longitude
    }
    if (ip) {
      geoHeaders['x-forwarded-for'] = ip
    }

    // Debug logging (only in development)
    if (process.env.NODE_ENV === 'development') {
      console.log('[Pricing Proxy] Geolocation data:', {
        country: geo?.country,
        countryName: geo?.country
          ? countries.getName(geo.country, 'en')
          : undefined,
        city: geo?.city,
        region: geo?.countryRegion,
        latitude: geo?.latitude,
        longitude: geo?.longitude,
        ip,
        headers: geoHeaders,
      })
    }

    // Get access token from cookies for authorization
    const cookieStore = await cookies()
    const accessToken = cookieStore.get(ACCESS_TOKEN_KEY)
    const authorizationHeader = accessToken?.value
      ? {Authorization: `Bearer ${accessToken.value}`}
      : {}

    // Get query parameters from the URL
    const searchParams = request.nextUrl.searchParams
    const queryParams = Object.fromEntries(searchParams.entries())

    // Make the request to the Rails backend
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

    // Success logs are noisy (this endpoint is high-volume). Emit only the
    // generic api.call log via withAppApiLogging. Error logs below are structured.
    //
    // If we need success sampling later for coupon/PPP visibility, add it here
    // deterministically (e.g. based on request_id hash) to keep volume bounded.
    return NextResponse.json(response.data)
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

    // Keep logs actionable for agents:
    // - upstream Rails status
    // - whether x-site-client header is set (ties to egghead-rails#5027)
    // - whether this request is a good cache candidate (non-auth, low-cardinality)
    try {
      const searchParams = request.nextUrl.searchParams
      const queryKeys = Array.from(searchParams.keys())

      const hasToken = Boolean((await cookies()).get(ACCESS_TOKEN_KEY)?.value)
      const hasCouponParam = Boolean(searchParams.get('coupon'))
      const hasDiscountCodeParam = Boolean(searchParams.get('dc'))
      const hasEncodedParams =
        Boolean(searchParams.get('en')) || Boolean(searchParams.get('dc'))

      const railsStatus =
        typeof error?.response?.status === 'number'
          ? error.response.status
          : null

      const siteClientId = process.env.NEXT_PUBLIC_CLIENT_ID ?? null

      const cacheable_candidate =
        !hasToken &&
        !hasCouponParam &&
        !hasDiscountCodeParam &&
        !hasEncodedParams

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
        cacheable_candidate,
        site_client_id: siteClientId,
        has_site_client: Boolean(siteClientId),
        geo_country: geo?.country ?? null,
        has_geo_country: Boolean(geo?.country),
        has_ip: Boolean(ip),
        query_keys: queryKeys,
        has_coupon_param: hasCouponParam,
      }

      console.error(JSON.stringify(log))
    } catch {
      // Never crash the handler due to logging failures.
    }

    if (error.response) {
      // Forward the error response from Rails
      return NextResponse.json(error.response.data, {
        status: error.response.status,
      })
    } else {
      return NextResponse.json(
        {error: 'Failed to fetch pricing data'},
        {status: 500},
      )
    }
  }
}
export const GET = withAppApiLogging(_GET)
