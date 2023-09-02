import axios from 'axios'
import cookie from '../utils/cookies'
import {AUTH_DOMAIN} from '../utils/auth'

const REFERRAL_TOKEN_KEY = 'rc'
export const AFFILIATE_TOKEN_KEY = 'af'
export const SIGNED_AFFILIATE_TOKEN_KEY = 'signed_af'

const http = axios.create()

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
  // TODO add stripping `rc` and `af` search params out of URL
}

export default useTokenSigner
