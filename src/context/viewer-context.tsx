'use client'
import React, {FunctionComponent} from 'react'
import Auth from '../utils/auth'
import queryString from 'query-string'
import get from 'lodash/get'
import isEqual from 'lodash/isEqual'
import isEmpty from 'lodash/isEmpty'
import getAccessTokenFromCookie from '../utils/get-access-token-from-cookie'
import useTokenSigner from '../hooks/use-token-signer'
import useAffiliateAssigner from '../hooks/use-affiliate-assigner'
import {getAbilityFromToken, canDoNothingAbility} from '@/server/ability'

export const auth = new Auth()

type ViewerContextType = {
  authenticated?: boolean
  viewer?: any
  authToken?: any
  requestSignInEmail?: any
  logout?: any
  loading: boolean
  refreshUser?: any
  setViewerEmail: (newEmail: string) => void
  handleAccessTokenAuthentication: (
    accessToken: string,
    expiresInSeconds: string,
  ) => Promise<any>
  ability: any
}

const defaultViewerContext: ViewerContextType = {
  authenticated: false,
  loading: true,
  setViewerEmail: (_) => {},
  handleAccessTokenAuthentication: () => Promise.resolve(),
  ability: canDoNothingAbility,
}

export function useViewer() {
  return React.useContext(ViewerContext)
}

export const ViewerContext = React.createContext(defaultViewerContext)

function useAuthedViewer() {
  const [viewer, setViewer] = React.useState<any>(auth.getLocalUser())
  const viewerId = get(viewer, 'id', null)
  const [loading, setLoading] = React.useState(true)
  const [loggingOut, setLoggingOut] = React.useState(false)
  const previousViewer = React.useRef(viewer)
  const authToken = auth.getAuthToken()

  const setViewerEmail = (newEmail: string) => {
    setViewer((prevViewer: any) => {
      return {...prevViewer, email: newEmail}
    })
  }

  useTokenSigner()
  useAffiliateAssigner(viewerId, getAccessTokenFromCookie())

  React.useEffect(() => {
    setViewer(auth.getLocalUser())
  }, [])

  React.useEffect(() => {
    previousViewer.current = viewer
  })

  React.useEffect(() => {
    const querySearch = queryString.parse(window.location.search)
    const viewAsUser = get(querySearch, 'show-as-user')
    const queryHash = queryString.parse(window.location.hash)
    const accessToken = get(queryHash, 'access_token')
    // In some cases (mobile safari) the access_token might be a query param instead of a hash
    // if the redirect didn't preserve the hash or was converted by the browser/proxy
    const queryAccessToken = get(querySearch, 'access_token')
    const effectiveAccessToken = accessToken || queryAccessToken

    const noAccessTokenFound = isEmpty(effectiveAccessToken)
    const viewerIsPresent = !isEmpty(viewerId)
    const authToken = getAccessTokenFromCookie()

    if (loggingOut) {
      const doLogout = async () => {
        await auth.logout()
        if (typeof window !== 'undefined') {
          window.location.href = '/'
        }
      }
      doLogout()
      return
    }

    let viewerMonitorIntervalId: number | undefined

    const clearUserMonitorInterval = () => {
      const intervalPresentForClearing = !isEmpty(viewerMonitorIntervalId)
      if (intervalPresentForClearing) {
        window.clearInterval(viewerMonitorIntervalId)
      }
    }

    const loadViewerFromStorage = async () => {
      const localViewer = auth.getLocalUser()

      if (localViewer) {
        if (!isEqual(localViewer.id, viewerId)) {
          setViewer(localViewer)
        }
        setLoading(() => false)
      }

      auth.refreshUser().then((newViewer: any) => {
        if (!isEqual(newViewer.id, viewerId)) {
          setViewer(newViewer)
        }
        setLoading(() => false)
      })
    }

    const clearAccessToken = () => {
      if (!isEmpty(effectiveAccessToken)) {
        window.history.replaceState({}, document.title, '.')
      }
    }

    const setViewerOnInterval = () => {
      const newViewer = auth.getLocalUser()
      if (!isEmpty(newViewer) && !isEqual(newViewer, previousViewer.current)) {
        setViewer(newViewer)
      }
    }

    console.log('[ViewerDebug] useEffect check', {
      viewAsUser,
      hasAccessToken: !!accessToken,
      hasQueryAccessToken: !!queryAccessToken,
      effectiveAccessToken: !!effectiveAccessToken,
      hasAuthToken: !!authToken,
      viewerIsPresent,
      noAccessTokenFound,
    })

    if (loggingOut) {
      const intervalPresentForClearing = !isEmpty(viewerMonitorIntervalId)
      if (intervalPresentForClearing) {
        window.clearInterval(viewerMonitorIntervalId)
      }
    }

    const loadViewerFromToken = async () => {
      const localViewer = auth.getLocalUser()

      if (localViewer) {
        if (!isEqual(localViewer.id, viewerId)) {
          setViewer(localViewer)
        }
        setLoading(() => false)
      }
      auth.handleAccessTokenAuthentication(authToken).then((viewer: any) => {
        setViewer(viewer)
        setLoading(() => false)
      })
    }

    const loadBecomeViewer = async () => {
      auth.becomeUser(viewAsUser, effectiveAccessToken)?.then((viewer) => {
        setViewer(viewer)
        setLoading(() => false)
      })
    }

    // This effect handles the auth flow.
    // The `viewAsUser` flow is for admins assuming a user identity.
    // The `authToken` flow is when we already have a cookie.
    // The `handleAuthentication` flow is when we have a fresh OAuth return (hash fragment).
    // The `viewerIsPresent` check is so we don't re-run auth logic if we are already logged in.

    if (viewAsUser && effectiveAccessToken) {
      loadBecomeViewer()
    } else if (authToken) {
      loadViewerFromToken()
    } else if (viewerIsPresent) {
      // If we are already logged in, we can safely clear the token from the URL to clean it up.
      // We do this AFTER confirming we have the viewer, so we don't clear it mid-auth.
      loadViewerFromStorage()
      clearAccessToken()
    } else if (noAccessTokenFound) {
      // If no token in URL and no cookie, we monitor for a login (e.g. if it happens in another tab).
      viewerMonitorIntervalId = auth.monitor(setViewerOnInterval)
      setLoading(() => false)
    } else {
      // This is the critical path for the initial OAuth callback.
      // We have a token in the URL (effectiveAccessToken), but no viewer yet.
      auth
        .handleAuthentication()
        .then((viewer: any) => {
          setViewer(viewer)
          // We only clear the token AFTER a successful auth handshake.
          // Doing it earlier might cancel the pending API requests on some browsers (Safari).
          clearAccessToken()
          setLoading(() => false)
        })
        .catch((error) => {
          console.error('Authentication failed', error)
          setLoading(() => false)
        })
    }

    return clearUserMonitorInterval
  }, [viewerId, loggingOut])

  React.useEffect(() => {
    window.becomeUser = auth.becomeUser
  }, [])

  const handleAccessTokenAuthentication = async (
    authToken: string,
    expiresInSeconds: string,
  ) => {
    const authenticatedUser = await auth.handleAccessTokenAuthentication(
      authToken,
      expiresInSeconds,
    )
    setViewer(authenticatedUser)
  }

  const [ability, setAbility] = React.useState(canDoNothingAbility)
  React.useEffect(() => {
    const fetchAbility = async (authToken: string) => {
      const ability = await getAbilityFromToken(authToken)
      setAbility(ability)
    }

    if (authToken) {
      fetchAbility(authToken)
    }
  }, [authToken])

  const values = React.useMemo(
    () => ({
      viewer,
      setViewerEmail,
      logout: () => {
        setLoggingOut(true)
      },
      setSession: auth.setSession, // TODO: This isn't exported in auth, so isn't available here.
      handleAccessTokenAuthentication: handleAccessTokenAuthentication,
      isAuthenticated: () => auth.isAuthenticated(),
      authToken,
      requestSignInEmail: (email: any) => auth.requestSignInEmail(email),
      loading,
      refreshUser: auth.refreshUser,
      ability,
    }),
    [viewer, loading, authToken],
  )

  return values
}

export const ViewerProvider: FunctionComponent<
  React.PropsWithChildren<unknown>
> = ({children}) => {
  const values = useAuthedViewer()

  return (
    <ViewerContext.Provider
      value={{...values, authenticated: values.isAuthenticated()}}
    >
      {children}
    </ViewerContext.Provider>
  )
}
