/** @jsx jsx */
import {jsx} from '@emotion/core'
import React from 'react'

import {loadStripe} from '@stripe/stripe-js'
import Axios from 'axios'
import {pickBy} from 'lodash'

const stripePromise = loadStripe('pk_test_OOTSSmhjHw8HQBJKPe51fst1')

export default function Home() {
  const [stripe, setStripe] = React.useState<any>()

  React.useEffect(() => {
    stripePromise.then((stripe) => setStripe(stripe))
  }, [stripePromise])

  async function createSession() {
    const sessionId = await Axios.post(
      'http://egghead.af:5000/api/v1/stripe/session',
      pickBy({
        sellables: [
          {
            site: `epic_react`,
            sellable_id: 'epic-react-pro-e28f',
            sellable: 'playlist',
            quantity: 1,
          },
        ],
        client_id: `4118545974333dd5a03999d7b141ec809b9e83725630934e907e7205a9ac83cf`,
        site: `epic_react`,
        success_url: 'http://localhost:3000',
        cancel_url: 'http://localhost:3000',
      }),
    ).then(({data}) => data.id)

    stripe.redirectToCheckout({
      sessionId,
    })
  }

  return <button onClick={createSession}>do it</button>
}
