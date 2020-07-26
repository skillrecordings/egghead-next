import React from 'react'

import Auth from '../utils/auth'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import isEqual from 'lodash/isEqual'
import queryString from 'query-string'

const auth = new Auth()

function useInitializeUser() {
  const [user, setUser] = React.useState()

  React.useEffect(() => {
    setUser(auth.getLocalUser())
  }, [])

  return [user, setUser]
}

function useEggheadUserAuthentication(options = {loadFullUser: false}) {
  const [user, setUser] = useInitializeUser()
  const [viewingAs, setViewingAs] = React.useState()

  const becomeUser = async ({showAsUser, accessToken}) => {
    const newUser = await auth.becomeUser(showAsUser, accessToken)
    if (!isEqual(newUser, user)) {
      setUser(user)
    }
    if (!isEqual(viewingAs, showAsUser)) {
      setViewingAs(showAsUser)
    }
  }
  React.useEffect(() => {
    const queryHash = queryString.parse(window.location.hash)
    const queryParams = queryString.parse(window.location.search)
    const accessToken = get(queryHash, 'access_token')

    const refreshLocalUser = async () => {
      try {
        const newUser = await auth.refreshUser(
          accessToken,
          options.loadFullUser,
        )
        if (!isEqual(newUser, user)) {
          setUser(newUser)
        }
      } catch (error) {
        console.error(error)
      }
    }

    let userMonitorIntervalId

    const clearAccessToken = () => {
      if (!isEmpty(accessToken)) {
        window.history.replaceState({}, document.title, '.')
      }
    }

    const setUserOnInterval = () => {
      const newUser = auth.getLocalUser()
      if (!isEmpty(newUser) && !isEqual(newUser, previousUser.current)) {
        setUser(newUser)
      }
    }

    const clearUserMonitorInterval = () =>
      !isEmpty(userMonitorIntervalId) && clearInterval(userMonitorIntervalId)

    const showAsUser = get(queryParams, 'show-as-user')

    if (!isEmpty(showAsUser) && !isEmpty(accessToken)) {
      becomeUser({showAsUser, accessToken})
      clearAccessToken()
    } else if (!isEmpty(user)) {
      refreshLocalUser()
      clearAccessToken()
    } else if (isEmpty(accessToken)) {
      userMonitorIntervalId = auth.monitor(setUserOnInterval)
    } else {
      auth.handleAuthentication(window.location).then(setUser)
    }

    return () => clearUserMonitorInterval()
  }, [setUser, user, becomeUser, options.loadFullUser])

  const previousUser = React.useRef()
  React.useEffect(() => {
    previousUser.current = user
  })

  function logout() {
    auth.logout()
    window.location.reload()
  }

  const values = React.useMemo(
    () => ({
      user,
      logout,
      viewingAs,
      setSession: (session) => auth.setSession(session),
      authToken: () => auth.getAuthToken(),
      isAuthenticated: () => auth.isAuthenticated(),
      requestSignInEmail: (email) => auth.requestSignInEmail(email),
    }),
    [user, viewingAs],
  )

  return values
}

export default useEggheadUserAuthentication
