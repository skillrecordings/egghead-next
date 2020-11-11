import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('no Stripe secret key found')
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27',
})

export async function loadPrice(priceId: string) {
  const price = await stripe.prices.retrieve(priceId)

  return price
}
