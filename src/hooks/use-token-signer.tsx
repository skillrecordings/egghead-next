import React from 'react'
import {useRouter} from 'next/router'
import axios from 'axios'
import cookie from '../utils/cookies'
import {AUTH_DOMAIN} from '../utils/auth'

const REFERRAL_TOKEN_KEY = 'rc'
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

async function requestSignedReferralToken(
  referralToken: string,
): Promise<string | null> {
  const existingReferralToken = cookie.get(REFERRAL_TOKEN_KEY)

  if (!!existingReferralToken) {
    return Promise.resolve(existingReferralToken)
  } else {
    return http
      .get(`${AUTH_DOMAIN}/api/v1/tokens/${referralToken}/signed`)
      .then(({data}) => {
        const newReferralToken = data.signed_token

        createPermanentCookie(REFERRAL_TOKEN_KEY, newReferralToken)

        return newReferralToken
      })
      .catch((_error) => {
        return null
      })
  }
}

async function requestSignedAffiliateToken(
  affiliateToken: string,
): Promise<string | null> {
  const existingAffiliateToken =
    cookie.get(AFFILIATE_TOKEN_KEY) || cookie.get(SIGNED_AFFILIATE_TOKEN_KEY)

  if (!!existingAffiliateToken) {
    return Promise.resolve(existingAffiliateToken)
  } else {
    return http
      .get(`${AUTH_DOMAIN}/api/v1/tokens/${affiliateToken}/signed`)
      .then(({data}) => {
        const newAffiliateToken = data.signed_token

        // Store this as `signed_af` to differentiate from unsigned legacy
        // af cookies.
        createPermanentCookie(SIGNED_AFFILIATE_TOKEN_KEY, newAffiliateToken)

        return newAffiliateToken
      })
      .catch((_error) => {
        return null
      })
  }
}

function useTokenSigner() {
  const router = useRouter()

  const referralQueryParam: string | undefined = getSingleQueryValue(
    router.query.rc,
  )

  const affiliateQueryParam: string | undefined = getSingleQueryValue(
    router.query.af,
  )

  const removeQueryFromUrl = React.useCallback(
    (paramName: string) => {
      const {[paramName]: _paramToRemove, ...updatedQuery} = router.query
      router.push({pathname: router.pathname, query: updatedQuery}, undefined, {
        shallow: true,
      })
    },
    [router],
  )

  React.useEffect(() => {
    if (!!referralQueryParam) {
      requestSignedReferralToken(referralQueryParam).then((token) => {
        if (token) {
          removeQueryFromUrl('rc')
        }
      })
    }
  }, [referralQueryParam, removeQueryFromUrl])

  React.useEffect(() => {
    if (!!affiliateQueryParam) {
      requestSignedAffiliateToken(affiliateQueryParam).then((token) => {
        if (token) {
          removeQueryFromUrl('af')
        }
      })
    }
  }, [affiliateQueryParam, removeQueryFromUrl])
}

export default useTokenSigner
