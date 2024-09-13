import {NextRequest} from 'next/server'

async function createPromoCode(couponId: string) {
  const response = await fetch('https://api.stripe.com/v1/promotion_codes', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(
        `${process.env.STRIPE_SECRET_KEY}:`,
      ).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      coupon: couponId,
    }),
  })

  if (!response.ok) {
    throw new Error(`Error creating promo code: ${response.statusText}`)
  }

  const data = await response.json().catch(() => {
    throw new Error('Failed to parse JSON response from Stripe')
  })

  return data.code
}

export async function POST(req: NextRequest) {
  const {amountPaid} = await req.json()

  console.log('discountTotalTEST', amountPaid)

  const LIFETIME_25000_COUPON_ID = 'SlYpb7e0'
  const LIFETIME_15000_COUPON_ID = 'SlYpb7e0'
  const LIFETIME_9000_COUPON_ID = 'SlYpb7e0'
  const LIFETIME_7000_COUPON_ID = 'SlYpb7e0'
  const LIFETIME_2500_COUPON_ID = 'SlYpb7e0'

  const coupons = new Map([
    [2500, LIFETIME_2500_COUPON_ID],
    [7000, LIFETIME_7000_COUPON_ID],
    [9000, LIFETIME_9000_COUPON_ID],
    [15000, LIFETIME_15000_COUPON_ID],
    [25000, LIFETIME_25000_COUPON_ID],
  ])

  const closestCoupon = Array.from(coupons.keys()).reduce((prev, curr) => {
    return Math.abs(curr - amountPaid) < Math.abs(prev - amountPaid)
      ? curr
      : prev
  })

  const couponId = coupons.get(closestCoupon)

  try {
    if (!couponId) {
      return new Response(JSON.stringify({error: 'Coupon not found'}), {
        status: 400,
      })
    }

    const promoCode = await createPromoCode(couponId)

    return new Response(JSON.stringify(promoCode), {status: 200})
  } catch (error) {
    return new Response(JSON.stringify({error: (error as Error).message}), {
      status: 500,
    })
  }
}
