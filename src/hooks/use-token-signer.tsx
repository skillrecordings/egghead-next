import React from 'react'
import {useRouter} from 'next/router'
import axios from 'axios'
import cookie from '../utils/cookies'
import {AUTH_DOMAIN} from '../utils/auth'

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

function useTokenSigner(): void {
  const router = useRouter()

  const referralQueryParam: string | undefined = getSingleQueryValue(
    router.query.rc,
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
            const twenty_years = 365 * 20
            const permanent = twenty_years // this is what permanent means for Rails cookies

            cookie.set('rc', newReferralToken, {
              expires: permanent,
              domain: process.env.NEXT_PUBLIC_AUTH_COOKIE_DOMAIN,
            })

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
}

export default useTokenSigner
