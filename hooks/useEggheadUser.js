import React from 'react'
import {UserContext} from '../context/userContext'
import get from 'lodash/get'
import filter from 'lodash/filter'

export function useEggheadUser() {
  const {
    user,
    logout,
    setSession,
    authToken,
    isAuthenticated,
    requestSignInEmail,
    viewingAs,
  } = React.useContext(UserContext)
  return {
    user: {
      ...user,
      purchased: filter(
        get(user, 'purchased', []),
        (purchase) => purchase.site === 'egghead.io',
      ),
    },
    logout,
    setSession,
    authToken,
    isAuthenticated,
    requestSignInEmail,
    viewingAs,
  }
}
