import * as React from 'react'
import axios from 'axios'
import {useViewer} from 'context/viewer-context'
import {GetServerSideProps} from 'next'
import {useRouter} from 'next/router'
import ConfirmMembership from 'components/pages/confirm/membership/index'
import {track} from 'utils/analytics'
import {AUTH_DOMAIN} from 'utils/auth'
import {useMachine} from '@xstate/react'
import {authTokenPollingMachine} from 'machines/auth-token-polling-machine'

// TODO: Not sure why this is here. Can it be removed?
export const getServerSideProps: GetServerSideProps = async function ({req}) {
  return {
    props: {},
  }
}

const TWENTY_FOUR_HOURS_IN_SECONDS = JSON.stringify(24 * 60 * 60)

const ConfirmMembershipPage: React.FC = () => {
  const {query} = useRouter()
  const [session, setSession] = React.useState<any>()
  const {
    viewer,
    refreshUser,
    handleAccessTokenAuthentication: _handleAccessTokenAuthentication,
  } = useViewer()

  // We want to know if the user was already authenticated when the component
  // loads, not after. Hence capturing that boolean in a ref.
  const alreadyAuthenticated = React.useRef(!!viewer)

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

  const {session_id} = query
  // Narrow the type of the session ID
  const stripeCheckoutSessionId =
    session_id instanceof Array ? session_id[0] : session_id

  // This polling machine will attempt to fetch a fresh access token for the
  // customer associated with the Stripe Checkout Session ID using the declared
  // service.
  const [current, _send] = useMachine(authTokenPollingMachine, {
    context: {stripeCheckoutSessionId},
    services: {
      requestAuthToken: async (context) => {
        const {data} = await axios.post(
          `${AUTH_DOMAIN}/api/v1/purchase_sessions`,
          {checkout_session_id: context.stripeCheckoutSessionId},
        )

        const {auth_token: authToken} = data || {}

        if (authToken) {
          return Promise.resolve({authToken})
        } else {
          return Promise.reject()
        }
      },
    },
  })

  // Memoize the function so that it doesn't re-trigger the useEffect over and
  // over.
  const handleAccessTokenAuthentication = React.useCallback(
    (authToken, expiration) => {
      _handleAccessTokenAuthentication(authToken, expiration)
    },
    [],
  )

  // Once we have an authToken, update the viewer-context
  React.useEffect(() => {
    if (current.context.authToken) {
      handleAccessTokenAuthentication(
        current.context.authToken,
        TWENTY_FOUR_HOURS_IN_SECONDS,
      )
    }
  }, [current.context.authToken, handleAccessTokenAuthentication])

  if (!session) return null

  return (
    <>
      {session.status === 'paid' && (
        <div className="-m-5 dark:bg-gray-900 bg-gray-50 min-h-screen">
          <div className="max-w-screen-sm mx-auto p-5 w-full flex flex-col items-center justify-start sm:py-16 py-8">
            <ConfirmMembership
              session={session}
              alreadyAuthenticated={alreadyAuthenticated.current}
              currentState={current}
            />
          </div>
        </div>
      )}
    </>
  )
}

export default ConfirmMembershipPage
