import React, {FunctionComponent} from 'react'
import {GetServerSideProps} from 'next'
import {getTokenFromCookieHeaders} from 'utils/auth'
import LoginRequired, {LoginRequiredParams} from 'components/login-required'
import isEmpty from 'lodash/isEmpty'
import axios from 'axios'
import {useRouter} from 'next/router'
import {Viewer} from 'types'

type CombinedEggheadDiscordUserData = {
  eggheadUser?: Viewer
  discordMember?: any
  discordUser?: {
    username: string
    discriminator: string
    email: string
  }
}

const CallbackPage: FunctionComponent<LoginRequiredParams> = ({
  loginRequired,
}) => {
  const [syncingAccount, setSyncingAccount] = React.useState(true)
  const [userData, setUserData] =
    React.useState<CombinedEggheadDiscordUserData>({})
  const router = useRouter()

  React.useEffect(() => {
    async function connectUser() {
      const accessCode = router.query.code

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
      <div>
        {syncingAccount ? (
          <>
            <h1>
              <span role="img" aria-label="recycle">
                ♻️
              </span>{' '}
              Currently syncing your egghead account to the egghead Discord
              server. Please wait!
            </h1>
          </>
        ) : (
          <>
            {userData && (
              <div className="flex flex-col space-y-3">
                <h1>
                  Your Discord account{' '}
                  {userData.discordUser &&
                    `(${userData.discordUser.username}#${userData.discordUser.discriminator} - ${userData.discordUser.email})`}{' '}
                  has been updated. Here is a link to
                  [discord](https://discord.com/channels/@me)
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
        <div className="pt-16">
          <h2 className="text-2xl font-bold">FAQ</h2>
          <div>
            <h3 className="text-lg font-bold">
              The egghead Discord doesn't show up in my server list?
            </h3>
            <p>
              The authorization flow uses the Discord account currently logged
              in to the browser. Sometimes this is different than the account
              logged into the Discord app.
            </p>
          </div>
        </div>
      </div>
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
