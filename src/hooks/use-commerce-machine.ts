import * as React from 'react'
import {
  commerceMachine,
  PricingData,
  PricingPlan,
} from 'machines/commerce-machine'
import {Prices} from 'lib/prices'
import {useMachine} from '@xstate/react'
import pickBy from 'lodash/pickBy'
import find from 'lodash/find'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'

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

type Options = {
  initialPlan: 'annualPrice' | 'monthlyPrice' | 'quarterlyPrice'
}

export const useCommerceMachine = (
  options: Options = {initialPlan: 'annualPrice'},
) => {
  const memoizedCommerceMachine = React.useMemo(() => {
    return commerceMachine
  }, [])

  const {initialPlan} = options

  const [state, send] = useMachine(memoizedCommerceMachine)

  const placeholderAnnualPlan = {
    name: 'Yearly',
    interval: 'year',
    stripe_price_id: null,
  }

  // derived values
  const prices = state.matches('pricesLoaded')
    ? extractPricesFromPricingData(state.context.pricingData)
    : {annualPrice: placeholderAnnualPlan}
  const quantity = state.context.quantity
  const priceId = state.context.priceId
  const availableCoupons = state?.context?.pricingData?.available_coupons

  // keep track of the selected plan type (annual, quarterly, monthly)
  const defaultPlanKey = initialPlan
  const [planKey, setPlanKey] = React.useState<string>(defaultPlanKey)
  const currentPlan: PricingPlan = get(prices, planKey, placeholderAnnualPlan)

  // update priceId in the machine whenever a new plan is selected
  const currentPlanPriceId = currentPlan?.stripe_price_id
  React.useEffect(() => {
    if (currentPlanPriceId) {
      send({type: 'SWITCH_PRICE', priceId: currentPlanPriceId})
    }
  }, [currentPlanPriceId, send])

  // keep the planKey in sync with the selected priceId
  React.useEffect(() => {
    // find the plan (and plan key) that matches the current `priceId`
    const [newPlanKey, planForPriceId] = Object.entries(prices).find(
      (entry) => {
        const [_, plan] = entry
        const {stripe_price_id}: {stripe_price_id: string} = plan
        return priceId === stripe_price_id
      },
    ) || [defaultPlanKey]

    if (!isEmpty(planForPriceId)) {
      setPlanKey(newPlanKey)
    }
  }, [priceId, prices])

  return {
    state,
    send,
    prices,
    priceId,
    quantity,
    availableCoupons,
    currentPlan,
  }
}
