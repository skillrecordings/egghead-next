import {NextRequest, NextResponse} from 'next/server'
import {stripeAdapter} from '@/adapters/stripe-adapter'
import {add} from 'date-fns'
import {getLastChargeForActiveSubscription} from '@/lib/subscriptions'

export async function POST(req: NextRequest) {
  const {email, successPath, metadata, cancelPath} = await req.json()

  let {amountPaid, stripeCustomerId, accountId, userId} =
    await getLastChargeForActiveSubscription(email)

  // active global coupon?
  // is global > amountPaid? use it

  const discounts = []

  const TWELVE_FOUR_HOURS_FROM_NOW = Math.floor(
    add(new Date(), {hours: 12}).getTime() / 1000,
  )

  const LIFETIME_MEMBERSHIP_COST_IN_CENTS = 50000
  // live mode product hard coded rofl
  const LIFETIME_MEMBERSHIP_STRIPE_PRODUCT_ID = 'prod_QbmCKJ3ZPXAzDg'
  // live mode price hard coded rofl
  const LIFETIME_MEMBERSHIP_STRIPE_PRICE_ID = 'price_1PkYdi2nImeJXwdJuOfdYJvo'

  if (amountPaid > 0) {
    const couponName = `Lifetime ${(amountPaid / 100).toFixed(2)}`

    const amount_off_in_cents = LIFETIME_MEMBERSHIP_COST_IN_CENTS - amountPaid

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
    cancel_url:
      cancelPath ??
      `${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}/pricing?stripe=cancelled`,
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
    ? NextResponse.redirect(sessionUrl, {status: 303})
    : NextResponse.json(
        {error: 'checkout session failed'},
        {
          status: 500,
        },
      )
}
