import React from 'react'
import Auth from '../utils/auth'
import queryString from 'query-string'
import get from 'lodash/get'
import isEqual from 'lodash/isEqual'
import isEmpty from 'lodash/isEmpty'

export const auth = new Auth()

type ViewerContextType = {
  authenticated?: boolean
  viewer?: any
  authToken?: any
  requestSignInEmail?: any
  logout?: any
}

const defaultViewerContext: ViewerContextType = {
  authenticated: false,
}

export function useViewer() {
  return React.useContext(ViewerContext)
}

export const ViewerContext = React.createContext(defaultViewerContext)

function useAuthedViewer() {
  const [viewer, setViewer] = React.useState()
  const previousViewer = React.useRef(viewer)

  React.useEffect(() => {
    setViewer(auth.getLocalUser())
  }, [])

  React.useEffect(() => {
    previousViewer.current = viewer
  })

  React.useEffect(() => {
    const queryHash = queryString.parse(window.location.hash)
    const accessToken = get(queryHash, 'access_token')
    const noAccessTokenFound = isEmpty(accessToken)
    const viewerIsPresent = !isEmpty(viewer)

    let viewerMonitorIntervalId

    const loadViewerFromStorage = async () => {
      const newViewer: any = await auth.refreshUser(accessToken)
      if (!isEqual(newViewer, viewer)) {
        setViewer(newViewer)
      }
    }

    const clearAccessToken = () => {
      if (!isEmpty(accessToken)) {
        window.history.replaceState({}, document.title, '.')
      }
    }

    const setViewerOnInterval = () => {
      const newViewer = auth.getLocalUser()
      if (!isEmpty(newViewer) && !isEqual(newViewer, previousViewer.current)) {
        setViewer(newViewer)
      }
    }

    const clearUserMonitorInterval = () => {
      const intervalPresentForClearing = !isEmpty(viewerMonitorIntervalId)
      if (intervalPresentForClearing) {
        clearInterval(viewerMonitorIntervalId)
      }
    }

    if (viewerIsPresent) {
      loadViewerFromStorage()
      clearAccessToken()
    } else if (noAccessTokenFound) {
      viewerMonitorIntervalId = auth.monitor(setViewerOnInterval)
    } else {
      auth.handleAuthentication().then((viewer: any) => setViewer(viewer))
    }

    return clearUserMonitorInterval
  }, [viewer])

  const values = React.useMemo(
    () => ({
      viewer,
      logout: () => {
        auth.logout()
        window.location.reload()
      },
      setSession: (session: any) => auth.setSession(session),
      isAuthenticated: () => auth.isAuthenticated(),
      authToken: auth.getAuthToken(),
      requestSignInEmail: (email: any) => auth.requestSignInEmail(email),
    }),
    [viewer],
  )

  return values
}

export function ViewerProvider({children}) {
  const values = useAuthedViewer()

  return (
    <ViewerContext.Provider value={{...values}}>
      {children}
    </ViewerContext.Provider>
  )
}
