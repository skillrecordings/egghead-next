import {LAST_RESOURCE_COOKIE_NAME} from 'hooks/use-last-resource'
import {isEmpty} from 'lodash'
import {useRouter} from 'next/router'
import * as React from 'react'
import cookieUtil from 'utils/cookies'

const Redirect = () => {
  const router = useRouter()

  React.useEffect(() => {
    const lastResource = cookieUtil.get(LAST_RESOURCE_COOKIE_NAME)
    if (!isEmpty(lastResource)) {
      router.replace(lastResource.path)
    } else {
      router.replace('/')
    }
  }, [])
  return null
}

Redirect.getLayout = (Page: any, pageProps: any) => {
  return <Page {...pageProps} />
}

export default Redirect
