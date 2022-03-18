import Link from 'next/link'
import React, {FunctionComponent} from 'react'
import {GetServerSideProps} from 'next'
import {getTokenFromCookieHeaders} from 'utils/auth'
import LoginRequired, {LoginRequiredParams} from 'components/login-required'

const Discord: FunctionComponent<LoginRequiredParams> = ({loginRequired}) => {
  return (
    <LoginRequired loginRequired={loginRequired}>
      {process.env.NEXT_PUBLIC_DISCORD_AUTHORIZE && (
        <div className="grid place-items-center h-96">
          <p className="prose lg:prose-xl text-white text-center">
            This will authorize egghead to see your Discord identity and email.
            If you are currently logged in and a PRO member of egghead you will
            be invited added to the egghead Discord server as a member. If you
            aren't a PRO member, you will still be added to the server.
          </p>

          <Link href={process.env.NEXT_PUBLIC_DISCORD_AUTHORIZE}>
            <a className="transition text-center duration-150 ease-in-out bg-blue-500 hover:bg-blue-700 text-white font-semibold py-3 px-5 rounded">
              Sync your Discord to egghead
            </a>
          </Link>
        </div>
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
