import * as React from 'react'
import {loadPrices} from 'lib/prices'
import queryString from 'query-string'

export type Prices = {
  annualPrice?: any
}

export const usePricing = () => {
  const [prices, setPrices] = React.useState<Prices>({})
  const [pricesLoading, setPricesLoading] = React.useState(true)
  React.useEffect(() => {
    const run = async (options: {en?: string; dc?: string}) => {
      const newPrices = await loadPrices(options)
      setPrices(newPrices)
      setPricesLoading(false)
    }
    run(queryString.parse(window.location.search))
  }, [])

  return {prices, pricesLoading}
}

export default usePricing
