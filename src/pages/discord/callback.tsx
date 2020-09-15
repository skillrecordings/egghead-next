import React, {FunctionComponent} from 'react'
import {GetServerSideProps} from 'next'
import {getTokenFromCookieHeaders} from 'utils/auth'
import LoginRequired, {LoginRequiredParams} from 'components/login-required'
import isEmpty from 'lodash/isEmpty'
import queryString from 'query-string'
import get from 'lodash/get'
import axios from 'axios'
import {Router, useRouter} from 'next/router'
import {Viewer} from 'interfaces/viewer'

type CombinedEggheadDiscordUserData = {
  eggheadUser?: Viewer
  discordMember?: any
  discordUser?: {
    username: string
    discriminator: string
  }
}

const CallbackPage: FunctionComponent<LoginRequiredParams> = ({
  loginRequired,
}) => {
  const [syncingAccount, setSyncingAccount] = React.useState(true)
  const [userData, setUserData] = React.useState<
    CombinedEggheadDiscordUserData
  >({})
  const router = useRouter()

  React.useEffect(() => {
    async function connectUser() {
      const queryHash = queryString.parse(window.location.search)
      const accessCode = get(queryHash, 'code')

      if (!accessCode) {
        router.push('/discord')
        return
      }

      if (!isEmpty(accessCode)) {
        window.history.replaceState({}, document.title, '/discord/callback')
      }

      await axios
        .post('/api/discord', {code: accessCode})
        .then(({data}) => setUserData(() => data))

      setSyncingAccount(false)
    }
    connectUser()
  }, [])

  return (
    <LoginRequired loginRequired={loginRequired}>
      {syncingAccount ? (
        <>
          <h1>
            Currently syncing your egghead account to the egghead Discord
            server.
          </h1>
        </>
      ) : (
        <>
          {userData && (
            <div className="flex flex-col space-y-3">
              <h1>
                Your Discord account{' '}
                {userData.discordUser &&
                  `(${userData.discordUser.username}#${userData.discordUser.discriminator})`}{' '}
                has been updated.
              </h1>
              {userData.discordMember.guildId ===
                process.env.NEXT_PUBLIC_DISCORD_GUILD_ID && (
                <div>We added you to the egghead Discord!</div>
              )}
              {userData.eggheadUser && (
                <div>
                  We found your egghead account!{' '}
                  {userData.eggheadUser.is_pro
                    ? 'You have a pro membership 🎉'
                    : `You are not a pro member on ${userData.eggheadUser.email}`}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </LoginRequired>
  )
}

export default CallbackPage

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
