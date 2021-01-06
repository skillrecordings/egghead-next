import {
  AFFILIATE_TOKEN_KEY,
  SIGNED_AFFILIATE_TOKEN_KEY,
} from '../hooks/use-token-signer'
import cookies from './cookies'

export type AffiliateToken = {
  token: string | null
  signed: boolean
}

const nullAffiliateToken: AffiliateToken = {
  token: null,
  signed: false,
}

export const getAffiliateTokenFromCookie = (): AffiliateToken => {
  const signedToken = cookies.get(SIGNED_AFFILIATE_TOKEN_KEY)
  const token = cookies.get(AFFILIATE_TOKEN_KEY)

  if (!signedToken && !token) return nullAffiliateToken

  return {
    token: signedToken || token,
    signed: !!signedToken,
  }
}

export const removeAffiliateTokenFromCookie = async () => {
  const cookieOptions = {
    path: '',
    domain: process.env.NEXT_PUBLIC_AUTH_COOKIE_DOMAIN,
  }
  cookies.remove(SIGNED_AFFILIATE_TOKEN_KEY, cookieOptions)
  cookies.remove(AFFILIATE_TOKEN_KEY, cookieOptions)
}
