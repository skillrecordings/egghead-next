import * as React from 'react'
import {loadPrices, Prices} from 'lib/prices'
import queryString from 'query-string'

export const usePricing = (options: {mock: any} = {mock: false}) => {
  const {mock} = options
  const [prices, setPrices] = React.useState<Prices>({})
  const [quantity, setQuantity] = React.useState<number>(1)
  const [pricesLoading, setPricesLoading] = React.useState(true)
  React.useEffect(() => {
    const run = async (options: {
      quantity: number
      en?: string
      dc?: string
    }) => {
      const newPrices = await loadPrices(options, mock)
      setPrices(newPrices)
      setPricesLoading(false)
    }
    setPricesLoading(true)
    run({quantity, ...queryString.parse(window.location.search)})
  }, [mock, quantity])

  return {prices, pricesLoading, quantity, setQuantity}
}

export default usePricing
