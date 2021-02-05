import {loadStripe} from '@stripe/stripe-js'
import axios from 'utils/configured-axios'
import cookie from '../../utils/cookies'

if (!process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY) {
  throw new Error('no Stripe public key found')
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY)

const stripeCheckoutRedirect = async (
  priceId: string,
  email: string,
  stripeCustomerId?: string,
  redirectURL?: string,
  authToken?: string,
) => {
  const referralCookieToken = cookie.get('rc')

  const identifier = stripeCustomerId
    ? {
        stripe_customer_id: stripeCustomerId,
      }
    : {
        email,
      }

  return await axios
    .post(`${process.env.NEXT_PUBLIC_AUTH_DOMAIN}/api/v1/stripe/subscription`, {
      ...identifier,
      price_id: priceId,
      site: 'egghead.io',
      client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
      success_url: `${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}/confirm/membership?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}/pricing`,
      metadata: {
        ...(!!referralCookieToken && {referralCookieToken}),
        ...(!!redirectURL && {redirectURL}),
        email,
        authToken,
      },
    })
    .then(({data}) => {
      if (data.error) {
        console.error(data.error)
        throw new Error(data.error)
      } else {
        stripePromise.then((stripe: any) => {
          if (!stripe) throw new Error('Stripe not loaded 😭')
          stripe
            .redirectToCheckout({
              sessionId: data.id,
            })
            .then((r: any) => console.log(r))
        })
      }
    })
}

export default stripeCheckoutRedirect
