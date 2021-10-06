import * as React from 'react'
import {commerceMachine, PricingData} from 'machines/commerce-machine'
import {Prices} from 'lib/prices'
import {useMachine} from '@xstate/react'
import pickBy from 'lodash/pickBy'
import find from 'lodash/find'

const extractPricesFromPricingData = (pricingData: PricingData): Prices => {
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

export const useCommerceMachine = () => {
  const memoizedCommerceMachine = React.useMemo(() => {
    return commerceMachine
  }, [])

  const [state, send] = useMachine(memoizedCommerceMachine)

  // derived values
  const prices = state.matches('pricesLoaded')
    ? extractPricesFromPricingData(state.context.pricingData)
    : {}
  const quantity = state.context.quantity
  const priceId = state.context.priceId
  const availableCoupons = state?.context?.pricingData?.available_coupons

  return {
    state,
    send,
    prices,
    priceId,
    quantity,
    availableCoupons,
  }
}
