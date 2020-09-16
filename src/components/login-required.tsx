import React, {FunctionComponent} from 'react'
import {useRouter} from 'next/router'

export type LoginRequiredParams = {
  loginRequired: boolean
}

const LoginRequired: FunctionComponent<LoginRequiredParams> = ({
  children,
  loginRequired,
}) => {
  const router = useRouter()
  React.useEffect(() => {
    if (loginRequired) {
      router.push('/login')
    }
  }, [])
  return <>{!loginRequired && children}</>
}

export default LoginRequired
