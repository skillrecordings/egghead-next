const prettifyUrl = (fullUrl: string) => {
  let url = fullUrl
  url = url.substr(-1) === '/' ? url.substr(0, url.length - 1) : fullUrl
  url = url.replace('http://', '').replace('https://', '').replace('www.', '')
  return url
}

export default prettifyUrl
