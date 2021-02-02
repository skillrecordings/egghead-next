import {find} from 'lodash'
import axios from 'utils/configured-axios'
import {pickBy} from 'lodash'

export type Prices = {
  monthlyPrice?: {
    price_id: string
    price: number
  }
  quarterlyPrice?: {
    price_id: string
    price: number
  }
  annualPrice?: {
    price_id: string
    price: number
  }
}

export const mockPrices = {
  mode: 'individual',
  stripeKey: 'pk_test_OOTSSmhjHw8HQBJKPe51fst1',
  subscribeUrl: null,
  hi: 'hi',
  plans: [
    {
      name: 'Basic Yearly',
      url: '/koudoku/subscriptions/new?plan=6844fcab',
      type: 'individual',
      interval: 'year',
      price: 99,
      price_id: 'plan_Gdg3bUlyhSyIBy',
      billing: 'per year/billed yearly',
      tier: 'basic',
      guid: '6844fcab',
      features: ['Stream of premium content'],
    },
    {
      name: 'Pro Yearly',
      url: '/koudoku/subscriptions/new?plan=3c5f32ec',
      type: 'individual',
      interval: 'year',
      price: 150,
      price_id: 'plan_CosBMNsT9wz4as',
      billing: 'per year/billed yearly',
      tier: 'pro',
      guid: '3c5f32ec',
      features: [
        'Stream of premium content',
        'Offline viewing (download)',
        'Commenting',
        'RSS feed',
        'Enhanced Transcripts',
        'Live Events Discounts',
        'Downloads',
        'Playback Speed Control',
        'Community Access',
      ],
    },
    {
      name: 'Pro Monthly',
      url:
        '/koudoku/subscriptions/new?plan=21593caa-eb09-4241-86b1-2fc49266ee10',
      type: 'individual',
      interval: 'month',
      price: 40,
      price_id: 'egh-monthly',
      billing: 'per month/billed monthly',
      tier: 'pro',
      guid: '21593caa-eb09-4241-86b1-2fc49266ee10',
      features: [
        'Stream of premium content',
        'Offline viewing (download)',
        'Commenting',
        'RSS feed',
        'Enhanced Transcripts',
        'Live Events Discounts',
        'Downloads',
        'Playback Speed Control',
        'Community Access',
      ],
    },
    {
      name: 'Pro Quarterly',
      url: '/koudoku/subscriptions/new?plan=4857ae6d',
      type: 'individual',
      interval: 'quarter',
      price: 100,
      price_id: 'plan_Fv4BOArJkpaejn',
      billing: 'per month/billed monthly',
      tier: 'pro',
      guid: '4857ae6d',
      features: [
        'Stream of premium content',
        'Offline viewing (download)',
        'Commenting',
        'RSS feed',
        'Enhanced Transcripts',
        'Live Events Discounts',
        'Downloads',
        'Playback Speed Control',
        'Community Access',
      ],
    },
    {
      name: 'Pro Team',
      url: '/enterprise_pricing',
      type: 'team',
      interval: 'year',
      price: 250,
      price_id: 'enterprise_flex_quant_yearly_250',
      billing: 'per user/billed annually',
      guid: 'f2c6342a',
      per_user_price: '250.0',
      features: [
        'All Individual Features',
        'Team Management',
        'Team Analytics',
      ],
    },
  ],
}

export async function loadPrices(
  params: {
    en?: string
    dc?: string
  } = {},
  mock: boolean = false,
): Promise<Prices> {
  let {data: pricingData} = await axios.get(
    `${process.env.NEXT_PUBLIC_AUTH_DOMAIN}/api/v1/pricing`,
    {
      params,
    },
  )

  if (mock) {
    pricingData = mockPrices
  }

  const annualPrice = find(pricingData.plans, {
    interval: 'year',
    type: 'individual',
    tier: 'pro',
  })

  const monthlyPrice = find(pricingData.plans, {
    interval: 'month',
    type: 'individual',
    tier: 'pro',
  })

  const quarterlyPrice = find(pricingData.plans, {
    interval: 'quarter',
    type: 'individual',
    tier: 'pro',
  })

  if (!annualPrice?.price_id) throw new Error('no annual price to load 😭')

  return pickBy({annualPrice, quarterlyPrice, monthlyPrice})
}
