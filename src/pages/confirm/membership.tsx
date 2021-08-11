import * as React from 'react'
import axios from 'axios'
import {useViewer} from 'context/viewer-context'
import {GetServerSideProps} from 'next'
import {useRouter} from 'next/router'
import ConfirmMembership from 'components/pages/confirm/membership/index'
import {track} from 'utils/analytics'
import {useInterval} from 'react-use'
import {AUTH_DOMAIN} from 'utils/auth'

export const getServerSideProps: GetServerSideProps = async function ({req}) {
  return {
    props: {},
  }
}

const TWENTY_FOUR_HOURS_IN_SECONDS = JSON.stringify(24 * 60 * 60)

const useRequestPurchaseAuthToken = (sessionId) => {
  const {viewer, handleAccessTokenAuthentication} = useViewer()

  const requestLimit = 5
  const [requestCount, setRequestCount] = React.useState<number>(0)
  const [authToken, setAuthToken] = React.useState<String | null>(null)

  // Only poll for a new purchase auth token if the following conditions are
  // met:
  const allowPolling =
    !viewer && // no one is currently signed in
    !authToken && // we haven't received an auth token yet
    requestCount < requestLimit && // we haven't tried more than X times yet
    !!sessionId // we have a sessionId to make the request with

  useInterval(
    async () => {
      console.log('Polling for a new purchase auth token')

      try {
        const {data} = await axios.post(
          `${AUTH_DOMAIN}/api/v1/purchase_sessions`,
          {checkout_session_id: sessionId},
        )

        const {auth_token: authToken} = data || {}

        if (authToken) {
          setAuthToken(authToken)

          handleAccessTokenAuthentication(
            authToken,
            TWENTY_FOUR_HOURS_IN_SECONDS,
          )
        }
      } catch (e) {
        // errors, e.g. 404 are expected during polling
      } finally {
        setRequestCount((prevCount) => prevCount + 1)
      }
    },
    allowPolling ? 2000 : null,
  )
}

const ConfirmMembershipPage: React.FC = () => {
  const {query} = useRouter()
  const [session, setSession] = React.useState<any>()
  const {viewer, refreshUser} = useViewer()

  React.useEffect(() => {
    const {session_id} = query
    if (session_id) {
      axios
        .get(`/api/stripe/checkout/session?session_id=${session_id}`)
        .then(({data}) => {
          setSession(data)
          track('checkout: membership confirmed', {
            session_id,
          })
          if (viewer) refreshUser()
        })
    }
  }, [])

  useRequestPurchaseAuthToken(query.session_id)

  if (!session) return null

  return (
    <>
      {session.status === 'paid' && (
        <div className="p-5 dark:bg-gray-900 bg-gray-50 min-h-screen w-full flex flex-col items-center justify-start lg:pt-32 sm:pt-24 pt-16">
          <ConfirmMembership
            session={session}
            alreadyAuthenticated={!!viewer}
          />
        </div>
      )}
    </>
  )
}

export default ConfirmMembershipPage
