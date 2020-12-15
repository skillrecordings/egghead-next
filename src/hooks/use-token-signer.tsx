import React from 'react'
import {useRouter} from 'next/router'
import axios from 'axios'
import cookie from '../utils/cookies'
import {AUTH_DOMAIN} from '../utils/auth'

export const AFFILIATE_TOKEN_KEY = 'af'
export const SIGNED_AFFILIATE_TOKEN_KEY = 'signed_af'

const http = axios.create()

function getSingleQueryValue(
  param: undefined | string | string[],
): string | undefined {
  if (Array.isArray(param)) {
    return param[0]
  } else {
    return param
  }
}

function createPermanentCookie(name: string, value: string) {
  // this is what permanent means for Rails cookies
  const twenty_years = 365 * 20
  const permanent = twenty_years

  cookie.set(name, value, {
    expires: permanent,
    domain: process.env.NEXT_PUBLIC_AUTH_COOKIE_DOMAIN,
  })
}

function useTokenSigner(): void {
  const router = useRouter()

  const referralQueryParam: string | undefined = getSingleQueryValue(
    router.query.rc,
  )

  const affiliateQueryParam: string | undefined = getSingleQueryValue(
    router.query.af,
  )

  React.useEffect(() => {
    const requestSignedReferralToken = async (referralToken: string) => {
      const existingReferralToken = cookie.get('rc')

      if (!!existingReferralToken) {
        Promise.resolve(existingReferralToken)
      } else {
        return http
          .post(
            `${AUTH_DOMAIN}/api/v1/sign_referral_token`,
            {rc: referralToken},
            {},
          )
          .then(({data}) => {
            const newReferralToken = data.signed_referral_token

            createPermanentCookie('rc', newReferralToken)

            // TODO: Remove `rc` from URL query params, similar to `af`.

            return newReferralToken
          })
          .catch((error) => {
            return null
          })
      }
    }

    if (!!referralQueryParam) {
      requestSignedReferralToken(referralQueryParam)
    }

    return () => {}
  }, [referralQueryParam])

  React.useEffect(() => {
    const requestSignedAffiliateToken = async (affiliateToken: string) => {
      const existingAffiliateToken =
        cookie.get(AFFILIATE_TOKEN_KEY) ||
        cookie.get(SIGNED_AFFILIATE_TOKEN_KEY)

      if (!!existingAffiliateToken) {
        Promise.resolve(existingAffiliateToken)
      } else {
        return http
          .post(
            `${AUTH_DOMAIN}/api/v1/sign_affiliate_token`,
            {af: affiliateToken},
            {},
          )
          .then(({data}) => {
            const newAffiliateToken = data.signed_affiliate_token

            // Store this as `signed_af` to differentiate from unsigned legacy
            // af cookies.
            createPermanentCookie(SIGNED_AFFILIATE_TOKEN_KEY, newAffiliateToken)

            // remove `af` from the URL params
            const {af, ...updatedQuery} = router.query
            router.push(
              {pathname: router.pathname, query: updatedQuery},
              undefined,
              {
                shallow: true,
              },
            )

            return newAffiliateToken
          })
          .catch((error) => {
            return null
          })
      }
    }

    if (!!affiliateQueryParam) {
      requestSignedAffiliateToken(affiliateQueryParam)
    }

    return () => {}
  }, [affiliateQueryParam, router])
}

export default useTokenSigner
