import {loadStripe} from '@stripe/stripe-js'
import axios from 'utils/configured-axios'
import cookie from '../../utils/cookies'

if (!process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY) {
  throw new Error('no Stripe public key found')
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY)

const stripeCheckoutRedirect = async (priceId: string, email: string) => {
  const referralCookieToken = cookie.get('rc')

  return await axios
    .post(`${process.env.NEXT_PUBLIC_AUTH_DOMAIN}/api/v1/stripe/subscription`, {
      price_id: priceId,
      site: 'egghead.io',
      email: email,
      client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
      success_url: `${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}/confirm/membership?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}/pricing`,
      metadata: {
        ...(!!referralCookieToken && {referralCookieToken}),
      },
    })
    .then(({data}) => {
      stripePromise.then((stripe: any) => {
        if (!stripe) throw new Error('Stripe not loaded 😭')
        stripe
          .redirectToCheckout({
            sessionId: data.id,
          })
          .then((r: any) => console.log(r))
      })
    })
}

export default stripeCheckoutRedirect
