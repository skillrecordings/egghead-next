import {find} from 'lodash'
import axios from '@/utils/configured-axios'
import {pickBy} from 'lodash'
import {Prices, PricingData} from '@/types'

export const mockPrices = {
  mode: 'individual',
  stripeKey: 'pk_test_OOTSSmhjHw8HQBJKPe51fst1',
  subscribeUrl: '',
  quantity: 1,
  applied_coupon: null,
  coupon_code_errors: [],
  available_coupons: {},
  plans: [
    {
      name: 'Monthly',
      price: 25,
      interval: 'month',
      interval_count: 1,
      stripe_price_id: 'price_1IOrdj2nImeJXwdJkJ8bmJbm',
    },
    {
      name: 'Quarterly',
      price: 70,
      interval: 'month',
      interval_count: 3,
      stripe_price_id: 'price_1IOrcv2nImeJXwdJcA6WG6XI',
    },
    {
      name: 'Yearly',
      price: 250,
      interval: 'year',
      interval_count: 1,
      stripe_price_id: 'price_1IIzGg2nImeJXwdJXW0biUQR',
    },
  ],
}

export async function loadPricingData(
  params: {
    quantity: number
    coupon?: string
    en?: string
    dc?: string
  } = {quantity: 1},
  mock: boolean = false,
): Promise<PricingData> {
  // Use the Next.js API proxy when running client-side to forward geolocation headers
  // for PPP (Purchasing Power Parity) pricing
  const isClientSide = typeof window !== 'undefined'
  const endpoint = isClientSide
    ? '/api/pricing'
    : `${process.env.NEXT_PUBLIC_AUTH_DOMAIN}/api/v1/next/pricing`

  let {data: pricingData} = await axios.get(endpoint, {
    params,
  })

  return pricingData
}

export async function loadPrices(
  params: {
    quantity: number
    en?: string
    dc?: string
  } = {quantity: 1},
  mock: boolean = false,
): Promise<Prices> {
  // Use the Next.js API proxy when running client-side to forward geolocation headers
  // for PPP (Purchasing Power Parity) pricing
  const isClientSide = typeof window !== 'undefined'
  const endpoint = isClientSide
    ? '/api/pricing'
    : `${process.env.NEXT_PUBLIC_AUTH_DOMAIN}/api/v1/next/pricing`

  let {data: pricingData} = await axios.get(endpoint, {
    params,
  })
  if (mock) {
    pricingData = mockPrices
  }

  const annualPrice = find(pricingData.plans, {
    interval: 'year',
  })

  const monthlyPrice = find(pricingData.plans, {
    interval: 'month',
    interval_count: 1,
  })

  const quarterlyPrice = find(pricingData.plans, {
    interval: 'month',
    interval_count: 3,
  })

  if (!annualPrice?.stripe_price_id)
    throw new Error('no annual price to load 😭')

  return pickBy({annualPrice, quarterlyPrice, monthlyPrice})
}
