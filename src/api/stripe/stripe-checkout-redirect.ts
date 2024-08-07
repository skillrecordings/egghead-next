import {loadStripe} from '@stripe/stripe-js'
import axios from '@/utils/configured-axios'
import cookie from '../../utils/cookies'

if (!process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY) {
  throw new Error('no Stripe public key found')
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY)

// make a Stripe checkout session for a one-off Sellable Purchase
export const redirectToStandardCheckout = async (options: {
  priceId: string
  email: string
  stripeCustomerId?: string
  authToken?: string
  quantity?: number
  coupon?: string
  successPath?: string
  cancelPath?: string
}) => {
  const {
    priceId,
    email,
    authToken,
    coupon,
    quantity = 1,
    successPath,
    cancelPath,
  } = options
  const referralCookieToken = cookie.get('rc')

  console.log({priceId, email})

  const defaultSuccessPath = '/confirm/membership'
  const basePath = successPath || defaultSuccessPath
  const successUrl = `${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}${basePath}?session_id={CHECKOUT_SESSION_ID}`

  const baseCancelPath = cancelPath || '/pricing'
  const cancelUrl = `${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}${baseCancelPath}?stripe=cancelled`

  // TODO: if the only difference between this function and
  // `redirectToSubscriptionCheckout` is the URL path, then extract all
  // the duplicated details to avoid drift.
  return await axios
    .post(`${process.env.NEXT_PUBLIC_AUTH_DOMAIN}/api/v1/stripe/session`, {
      email,
      quantity,
      stripe_price_id: priceId,
      coupon,
      site: 'egghead.io',
      client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        ...(!!referralCookieToken && {referralCookieToken}),
        email,
        authToken,
        // TODO: add something to metadata to signal lifetime purchase?
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

export const redirectToSubscriptionCheckout = async (options: {
  priceId: string
  email: string
  stripeCustomerId?: string
  authToken?: string
  quantity?: number
  coupon?: string
  successPath?: string
}) => {
  const {priceId, email, authToken, coupon, quantity = 1, successPath} = options
  const referralCookieToken = cookie.get('rc')

  const defaultSuccessPath = '/confirm/membership'
  const successUrl = `${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}${
    successPath || defaultSuccessPath
  }?session_id={CHECKOUT_SESSION_ID}`

  return await axios
    .post(`${process.env.NEXT_PUBLIC_AUTH_DOMAIN}/api/v1/stripe/subscription`, {
      email,
      quantity,
      price_id: priceId,
      coupon,
      site: 'egghead.io',
      client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
      success_url: successUrl,
      cancel_url: `${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}/pricing?stripe=cancelled`,
      metadata: {
        ...(!!referralCookieToken && {referralCookieToken}),
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
