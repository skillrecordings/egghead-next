import Link from 'next/link'
import React, {FunctionComponent} from 'react'
import {GetServerSideProps} from 'next'
import {getTokenFromCookieHeaders} from 'utils/auth'
import LoginRequired, {LoginRequiredParams} from 'components/login-required'

const Discord: FunctionComponent<LoginRequiredParams> = ({loginRequired}) => {
  return (
    <LoginRequired loginRequired={loginRequired}>
      {process.env.NEXT_PUBLIC_DISCORD_AUTHORIZE && (
        <Link href={process.env.NEXT_PUBLIC_DISCORD_AUTHORIZE}>
          <a>Sync your Discord to egghead</a>
        </Link>
      )}
    </LoginRequired>
  )
}

export default Discord

export const getServerSideProps: GetServerSideProps = async function ({req}) {
  const {loginRequired} = getTokenFromCookieHeaders(
    req.headers.cookie as string,
  )

  return {
    props: {
      loginRequired,
    },
  }
}
