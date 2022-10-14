import {LAST_RESOURCE_COOKIE_NAME} from 'hooks/use-last-resource'
import {isEmpty} from 'lodash'
import {useRouter} from 'next/router'
import * as React from 'react'
import cookieUtil from 'utils/cookies'

const Redirect = () => {
  const router = useRouter()
  const [wasCalled, setWasCalled] = React.useState(false)

  React.useEffect(() => {
    if (wasCalled) return
    const lastResource = cookieUtil.get(LAST_RESOURCE_COOKIE_NAME)
    if (!isEmpty(lastResource)) {
      setWasCalled(true)
      router.replace(lastResource.path)
    } else {
      setWasCalled(true)
      router.replace('/')
    }
  }, [router, wasCalled])
  return null
}

Redirect.getLayout = (Page: any, pageProps: any) => {
  return <Page {...pageProps} />
}

export default Redirect
