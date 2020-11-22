const configuredAhoy = async () => {
  const isServer = typeof window === 'undefined'
  if (!isServer) {
    const module = await import('ahoy.js')
    const ahoy = module.default
    const headers = {
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
    return ahoy
  }
  return Promise.resolve()
}

export default configuredAhoy
