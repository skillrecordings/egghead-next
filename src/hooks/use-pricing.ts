import * as React from 'react'
import {loadPrices, Prices} from 'lib/prices'
import queryString from 'query-string'

export const usePricing = (options: {mock: any} = {mock: false}) => {
  const {mock} = options
  const [prices, setPrices] = React.useState<Prices>({})
  const [pricesLoading, setPricesLoading] = React.useState(true)
  React.useEffect(() => {
    const run = async (options: {en?: string; dc?: string}) => {
      const newPrices = await loadPrices(options, mock)
      setPrices(newPrices)
      setPricesLoading(false)
    }
    run(queryString.parse(window.location.search))
  }, [mock])

  return {prices, pricesLoading}
}

export default usePricing
