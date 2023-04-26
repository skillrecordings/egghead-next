import * as React from 'react'
import {Stripe} from 'stripe'

export const recur = (price?: Stripe.Price) => {
  if (!price || !price.recurring) return ''

  const {
    recurring: {interval, interval_count},
  } = price

  if (interval === 'month' && interval_count === 3) return 'quarter'
  if (interval === 'month' && interval_count === 6) return '6-months'
  if (interval === 'month' && interval_count === 1) return 'month'
  if (interval === 'year' && interval_count === 1) return 'year'
}
