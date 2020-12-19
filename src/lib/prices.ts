import {find} from 'lodash'
import axios from 'axios'

type Prices = {
  annualPrice: {
    price_id: string
    price: number
  }
}

export async function loadPrices(): Promise<Prices> {
  const {data: pricingData} = await axios.get(
    `${process.env.NEXT_PUBLIC_AUTH_DOMAIN}/api/v1/pricing`,
  )

  const annualPrice = find(pricingData.plans, {
    interval: 'year',
    type: 'individual',
    tier: 'pro',
  })

  if (!annualPrice?.price_id) throw new Error('no annual price to load 😭')

  return {annualPrice}
}
