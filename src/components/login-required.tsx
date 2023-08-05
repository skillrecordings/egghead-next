import React, {FunctionComponent} from 'react'
import {useRouter} from 'next/router'
import getAccessTokenFromCookie from '../utils/get-access-token-from-cookie'

export type LoginRequiredParams = {
  loginRequired?: boolean
}

const LoginRequired: FunctionComponent<
  React.PropsWithChildren<LoginRequiredParams>
> = ({children, loginRequired = false}) => {
  const [mounted, setMounted] = React.useState<boolean>(false)
  const token = getAccessTokenFromCookie()
  loginRequired = loginRequired || !token
  const router = useRouter()
  React.useEffect(() => {
    setMounted(true)
    if (loginRequired) {
      router.push('/login')
    }
  }, [loginRequired])
  return <>{!loginRequired && mounted && children}</>
}

export default LoginRequired
