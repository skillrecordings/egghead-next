import {NextRequest, NextResponse} from 'next/server'

export async function POST(req: NextRequest) {
  const {
    successPath,
    cancelPath,
    email,
    quantity,
    stripe_price_id,
    coupon,
    site,
    clientId,
    metadata,
  } = await req.json()

  const defaultSuccessPath = '/confirm/membership'
  const basePath = successPath || defaultSuccessPath
  const successUrl = `${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}${basePath}?session_id={CHECKOUT_SESSION_ID}`

  const baseCancelPath = cancelPath || '/pricing'
  const cancelUrl = `${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}${baseCancelPath}`

  try {
    const params = new URLSearchParams({
      success_url: successUrl,
      cancel_url: cancelUrl,
      mode: 'payment',
      customer_email: email,
    })

    // Append metadata as individual key-value pairs
    if (metadata && typeof metadata === 'object') {
      Object.entries(metadata).forEach(([key, value]) => {
        params.append(`metadata[${key}]`, value as string)
      })
    }

    if (coupon) {
      params.append('discounts[0][coupon]', coupon)
    }

    // Properly format line_items
    params.append('line_items[0][price]', stripe_price_id)
    params.append('line_items[0][quantity]', quantity.toString())

    const response = await fetch(
      'https://api.stripe.com/v1/checkout/sessions',
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${process.env.STRIPE_SECRET_KEY}:`,
          ).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      },
    )

    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error(error)
    return NextResponse.json({error: error}, {status: 500})
  }
}
