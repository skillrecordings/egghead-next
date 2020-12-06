const fetcher = (url: RequestInfo) => fetch(url).then((r) => r.json())
export default fetcher
