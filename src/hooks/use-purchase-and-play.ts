import * as React from 'react'
import {useRouter} from 'next/router'
import axios from 'axios'
import {useViewer} from 'context/viewer-context'
import {AUTH_DOMAIN} from 'utils/auth'
import {useMachine} from '@xstate/react'
import {authTokenPollingMachine} from 'machines/auth-token-polling-machine'

const TWENTY_FOUR_HOURS_IN_SECONDS = JSON.stringify(24 * 60 * 60)

const usePurchaseAndPlay = (): [boolean, any] => {
  const {query} = useRouter()
  const {
    viewer,
    handleAccessTokenAuthentication: _handleAccessTokenAuthentication,
  } = useViewer()

  // We want to know if the user was already authenticated when the component
  // loads, not after. Hence capturing that boolean in a ref.
  const alreadyAuthenticated = React.useRef(!!viewer)

  // This polling machine will attempt to fetch a fresh access token for the
  // customer associated with the Stripe Checkout Session ID using the declared
  // service.
  const [current, send] = useMachine(authTokenPollingMachine, {
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

  const {session_id} = query
  // Narrow the type of the session ID
  const stripeCheckoutSessionId =
    session_id instanceof Array ? session_id[0] : session_id

  // Update the stripeCheckoutSessionId if it changes
  // (this is for when it goes from undefined to defined)
  React.useEffect(() => {
    if (stripeCheckoutSessionId !== undefined) {
      send({type: 'UPDATE_SESSION_ID', stripeCheckoutSessionId})
    }
  }, [stripeCheckoutSessionId])

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

  return [alreadyAuthenticated.current, current]
}

export default usePurchaseAndPlay
