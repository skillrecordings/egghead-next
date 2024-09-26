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

  const LIFETIME_MEMBERSHIP_STRIPE_PRODUCT_ID =
    process.env.LIFETIME_MEMBERSHIP_STRIPE_PRODUCT_ID!
  // live mode price hard coded rofl
  const LIFETIME_MEMBERSHIP_STRIPE_PRICE_ID =
    process.env.LIFETIME_MEMBERSHIP_STRIPE_PRICE_ID!

  if (amountPaid > 0) {
    const couponName = `Lifetime ${amountPaid}`

    const amount_off_in_cents = amountPaid * 100

    const couponId = await stripeAdapter.createCoupon({
      amount_off: amount_off_in_cents,
      name: couponName,
      max_redemptions: 1,
      redeem_by: TWELVE_FOUR_HOURS_FROM_NOW,
      currency: 'USD',
      applies_to: {
        products: [LIFETIME_MEMBERSHIP_STRIPE_PRODUCT_ID],
      },
    })

    discounts.push({
      coupon: couponId,
    })
  }

  const defaultSuccessPath = '/confirm/membership'
  const successUrl = `${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}${
    successPath || defaultSuccessPath
  }?session_id={CHECKOUT_SESSION_ID}`

  const sessionUrl = await stripeAdapter.createCheckoutSession({
    discounts,
    line_items: [
      {
        price: LIFETIME_MEMBERSHIP_STRIPE_PRICE_ID,
        quantity: Number(1),
      },
    ],
    expires_at: TWELVE_FOUR_HOURS_FROM_NOW,
    mode: 'payment',
    success_url: successUrl,
    cancel_url: `${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}/forever`,
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
