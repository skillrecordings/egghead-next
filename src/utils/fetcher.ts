import getAccessTokenFromCookie from './getAccessTokenFromCookie'

const fetcher = (url: RequestInfo) => {
  const token = getAccessTokenFromCookie()

  const authorizationHeader = token && {
    authorization: `Bearer ${token}`,
  }

  const headers = new Headers({
    ...authorizationHeader,
  })

  const request = new Request(url, {
    method: 'GET',
    headers,
    mode: 'cors',
    cache: 'default',
  })

  return fetch(request).then((r) => r.json())
}
export default fetcher
