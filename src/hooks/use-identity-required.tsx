import React, {FunctionComponent} from 'react'
import {useRouter} from 'next/router'
import getAccessTokenFromCookie from '../utils/get-access-token-from-cookie'
import getCioIdFromCookie from '../utils/get-cio-id-from-cookie'

const useIdentityRequired = () => {
  const token = getAccessTokenFromCookie()
  const cioId = getCioIdFromCookie()
  const loginRequired = !(cioId || token)
  const router = useRouter()

  React.useEffect(() => {
    if (loginRequired) {
      router.push('/login')
    }
  }, [loginRequired])
}

export default useIdentityRequired
