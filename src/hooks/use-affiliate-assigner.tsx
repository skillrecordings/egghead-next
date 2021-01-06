import React from 'react'
import axios from 'axios'
import {
  getAffiliateTokenFromCookie,
  removeAffiliateTokenFromCookie,
} from '../utils/affiliate-token'
import {AUTH_DOMAIN} from '../utils/auth'

const http = axios.create()

function useAffiliateAssigner(
  viewerId: string | null,
  authToken: string | null,
) {
  const {token, signed} = getAffiliateTokenFromCookie()

  React.useEffect(() => {
    // 1. POST affiliate token to assign to auth'd user
    const assignAffiliateToUser = async (token: string, signed: boolean) => {
      await http.post(
        `${AUTH_DOMAIN}/api/v1/assign_affiliate_token`,
        {token, signed},
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      )

      // 2. If POST successful, delete the affiliate token cookie
      removeAffiliateTokenFromCookie()
    }

    if (!!viewerId && !!authToken && !!token) {
      assignAffiliateToUser(token, signed)
    }
  }, [viewerId, authToken, token, signed])
}

export default useAffiliateAssigner
