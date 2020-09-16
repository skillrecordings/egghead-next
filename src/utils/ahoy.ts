import getAccessTokenFromCookie from './getAccessTokenFromCookie'

const configuredAhoy = () => {
  const isServer = typeof window === 'undefined'
  let ahoy
  if (!isServer) {
    const token = getAccessTokenFromCookie()
    ahoy = window.ahoy = window.ahoy || {}
    const headers = {
      ...(token && {Authorization: `Bearer ${token}`}),
      'Ahoy-Visit': ahoy.getVisitId(),
      'Ahoy-Visitor': ahoy.getVisitorId(),
    }
    ahoy.configure({
      urlPrefix: '',
      visitsUrl: `/api/visits`,
      eventsUrl: `/api/events`,
      page: null,
      platform: 'Web',
      useBeacon: true,
      startOnReady: true,
      trackVisits: true,
      cookies: true,
      cookieDomain: process.env.NEXT_PUBLIC_DEPLOYMENT_URL,
      headers,
      withCredentials: false,
    })
  }
  return ahoy
}

export default configuredAhoy
