import React, {FunctionComponent} from 'react'
import {useRouter} from 'next/router'
import getAccessTokenFromCookie from '../utils/get-access-token-from-cookie'

export type LoginRequiredParams = {
  loginRequired?: boolean
}

const LoginRequired: FunctionComponent<LoginRequiredParams> = ({
  children,
  loginRequired = false,
}) => {
  const token = getAccessTokenFromCookie()
  loginRequired = loginRequired || !token
  const router = useRouter()
  React.useEffect(() => {
    if (loginRequired) {
      router.push('/login')
    }
  }, [loginRequired])
  return <>{!loginRequired && children}</>
}

export default LoginRequired
