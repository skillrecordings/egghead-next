const parseCookie = (str: string) =>
  str
    .split(';')
    .map((v: string) => v.split('='))
    .reduce((acc: {[x: string]: string}, v: string[]) => {
      acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim())
      return acc
    }, {})

export default parseCookie
