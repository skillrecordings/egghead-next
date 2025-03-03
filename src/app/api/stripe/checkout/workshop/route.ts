import {cookies} from 'next/headers'
import {NextRequest, NextResponse} from 'next/server'
import {stripeAdapter} from '@/adapters/stripe-adapter'
import {add} from 'date-fns'
import {getLastChargeForActiveSubscription} from '@/lib/subscriptions'

export async function POST(req: NextRequest) {
  const allCookies = cookies()
  const authToken = allCookies.get('eh_token_2020_11_22')

  const {email, successPath, metadata, cancelPath} = await req.json()

  let {
    amountPaid = 0,
    stripeCustomerId,
    accountId,
    userId,
  } = await getLastChargeForActiveSubscription(email, authToken?.value)

  // active global coupon?
  // is global > amountPaid? use it

  const discounts = []

  const TWELVE_FOUR_HOURS_FROM_NOW = Math.floor(
    add(new Date(), {hours: 12}).getTime() / 1000,
  )

  const LIVE_WORKSHOP_STRIPE_PRODUCT_ID =
    process.env.NEXT_PUBLIC_LIVE_WORKSHOP_STRIPE_PRODUCT_ID!
  // live mode price hard coded rofl
  const LIVE_WORKSHOP_STRIPE_PRICE_ID =
    process.env.NEXT_PUBLIC_LIVE_WORKSHOP_STRIPE_PRICE_ID!
  const LIVE_WORKSHOP_COUPON_ID =
    process.env.NEXT_PUBLIC_LIVE_WORKSHOP_COUPON_ID!

  if (amountPaid > 0) {
    const coupon = await stripeAdapter.stripe.coupons.retrieve(
      LIVE_WORKSHOP_COUPON_ID,
    )

    if (coupon.valid) {
      discounts.push({
        coupon: coupon.id,
      })
    }
  }

  const defaultSuccessPath = '/confirm/membership'
  const successUrl = `${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}${
    successPath || defaultSuccessPath
  }?session_id={CHECKOUT_SESSION_ID}`

  const sessionUrl = await stripeAdapter.createCheckoutSession({
    discounts,
    line_items: [
      {
        price: LIVE_WORKSHOP_STRIPE_PRICE_ID,
        quantity: Number(1),
      },
    ],
    expires_at: TWELVE_FOUR_HOURS_FROM_NOW,
    mode: 'payment',
    success_url: successUrl,
    cancel_url: `${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}/${cancelPath}`,
    ...(stripeCustomerId
      ? {customer: stripeCustomerId}
      : {customer_creation: 'always', ...(email && {customer_email: email})}),
    metadata: {
      ...metadata,
      accountId,
      userId,
      amountPaid,
    },
    payment_intent_data: {
      metadata,
    },
  })

  return sessionUrl
    ? NextResponse.json({sessionUrl})
    : NextResponse.json({error: 'checkout session failed'})
}
