import getAccessTokenFromCookie from './getAccessTokenFromCookie'

const configuredAhoy = async () => {
  const isServer = typeof window === 'undefined'
  if (!isServer) {
    const module = await import('ahoy.js')
    const ahoy = module.default
    const {token} = getAccessTokenFromCookie()
    const authorizationHeader = token && {
      authorization: `Bearer ${token}`,
    }
    const headers = {
      'Ahoy-Visit': ahoy.getVisitId(),
      'Ahoy-Visitor': ahoy.getVisitorId(),
      ...authorizationHeader,
    }
    ahoy.configure({
      urlPrefix: '',
      visitsUrl: `${process.env.NEXT_PUBLIC_AUTH_DOMAIN}/ahoy/visits`,
      eventsUrl: `${process.env.NEXT_PUBLIC_AUTH_DOMAIN}/ahoy/events`,
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
    return ahoy
  }
  return Promise.resolve()
}

export default configuredAhoy
