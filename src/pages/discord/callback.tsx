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

const CallbackPage: FunctionComponent<
  React.PropsWithChildren<LoginRequiredParams>
> = ({loginRequired}) => {
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
      <div className=" max-w-screen-lg mx-auto mt-6">
        <h1 className=" text-2xl block w-2/3 mx-auto">Discord Info</h1>
        {syncingAccount ? (
          <>
            <p className="text-center text-xl pt-16">
              <span role="img" aria-label="recycle">
                ♻️
              </span>{' '}
              Currently syncing your egghead account to the egghead Discord
              server.
            </p>
            <p className="text-center text-xl">Please wait!</p>
          </>
        ) : (
          <>
            {userData && (
              <div className="flex flex-col space-y-3">
                <p className="text-center pt-16">
                  Your Discord account (
                  <span className="font-bold">
                    {userData.discordUser &&
                      `(${userData.discordUser.username}#${userData.discordUser.discriminator} - ${userData.discordUser.email})`}{' '}
                  </span>
                  ) has been updated. Here is a link to{' '}
                  <a
                    className="underline"
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://discord.com/channels/@me"
                  >
                    discord.
                  </a>
                </p>
                {userData.discordMember.guildId ===
                  process.env.NEXT_PUBLIC_DISCORD_GUILD_ID && (
                  <div>We added you to the egghead Discord!</div>
                )}
                {userData.eggheadUser && (
                  <p className="text-center">
                    We found your egghead account!{' '}
                    {userData.eggheadUser.is_pro
                      ? 'You have a pro membership 🎉'
                      : `You are not a pro member on ${userData.eggheadUser.email}`}
                  </p>
                )}
              </div>
            )}
          </>
        )}
        <div className="pt-16 w-2/3 mx-auto">
          <h2 className="text-2xl font-semibold">FAQ</h2>
          <div>
            <h3 className="text-lg font-bold mt-4">
              The egghead Discord doesn't show up in my server list?
            </h3>
            <p className="mt-4">
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
