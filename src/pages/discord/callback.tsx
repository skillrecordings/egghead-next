import React, {FunctionComponent} from 'react'
import {GetServerSideProps} from 'next'
import {getTokenFromCookieHeaders} from 'utils/auth'
import LoginRequired, {LoginRequiredParams} from 'components/login-required'
import isEmpty from 'lodash/isEmpty'
import queryString from 'query-string'
import get from 'lodash/get'
import axios from 'axios'
import {Router, useRouter} from 'next/router'

const CallbackPage: FunctionComponent<LoginRequiredParams> = ({
  loginRequired,
}) => {
  const [syncingAccount, setSyncingAccount] = React.useState(true)
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
        .then(({data}) => data)

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
          <h1>Your Discord account has been updated.</h1>
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
