import * as React from 'react'
import {loadPrices} from 'lib/prices'
import queryString from 'query-string'

export type Prices = {
  annualPrice?: any
}

export const usePricing = () => {
  const [prices, setPrices] = React.useState<Prices>({})
  React.useEffect(() => {
    const run = async (options: {en?: string; dc?: string}) => {
      const prices = await loadPrices(options)
      setPrices(prices)
    }
    run(queryString.parse(window.location.search))
  }, [])

  return prices
}

export default usePricing
