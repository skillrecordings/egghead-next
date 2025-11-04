import {cookies} from 'next/headers'
import {NextRequest, NextResponse} from 'next/server'
import {geolocation, ipAddress} from '@vercel/functions'
import axios from 'axios'
import {ACCESS_TOKEN_KEY} from '@/utils/auth'
import countries from 'i18n-iso-countries'
import enLocale from 'i18n-iso-countries/langs/en.json'

// Register English locale for country name lookups
countries.registerLocale(enLocale)

/**
 * Proxy endpoint for pricing API that forwards geolocation headers
 * This allows the Rails backend to determine PPP (Purchasing Power Parity) discounts
 *
 * Using @vercel/functions for cleaner geolocation data access
 * Reference: https://vercel.com/docs/functions/vercel-functions/geolocation
 */
export async function GET(request: NextRequest) {
  try {
    // Get geolocation data using Vercel Functions helper
    const geo = geolocation(request)
    const ip = ipAddress(request)

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

    // Log geo headers for debugging
    console.log('Geo headers:', geoHeaders)

    // Make the request to the Rails backend
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

    return NextResponse.json(response.data)
  } catch (error: any) {
    console.error('Pricing proxy error:', error.message)

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
