import cookie from '@/utils/cookies'

export const redirectToLifetimeCheckout = async (options: {
  priceId: string
  email: string
  stripeCustomerId?: string
  authToken?: string
  quantity?: number
  coupon?: string
  successPath?: string
  cancelPath?: string
}) => {
  const {priceId, email, authToken, coupon, quantity = 1} = options
  const referralCookieToken = cookie.get('rc')

  return await fetch(
    `${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}/api/stripe/checkout/lifetime`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        quantity,
        stripe_price_id: priceId,
        coupon,

        metadata: {
          ...(!!referralCookieToken && {referralCookieToken}),
          email,
          authToken,
        },
      }),
    },
  )
}
