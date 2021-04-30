import * as React from 'react'
import axios from 'axios'

type SubscriptionData = {
  portalUrl?: string
  billingScheme: 'tiered' | 'per_unit'
  subscription?: any
  price?: any
  product?: any
  latestInvoice?: any
  upcomingInvoice?: any
}

export const recur = (price: any) => {
  if (price === undefined) return ''

  const {
    recurring: {interval, interval_count},
  } = price

  if (interval === 'month' && interval_count === 3) return 'quarter'
  if (interval === 'month' && interval_count === 6) return '6-months'
  if (interval === 'month' && interval_count === 1) return 'month'
  if (interval === 'year' && interval_count === 1) return 'year'
}

const useSubscriptionDetails = ({
  stripeCustomerId,
}: {
  stripeCustomerId?: string
}): {subscriptionData: SubscriptionData; loading: boolean} => {
  const [loading, setLoading] = React.useState<boolean>(true)
  const [
    subscriptionData,
    setSubscriptionData,
  ] = React.useState<SubscriptionData>({billingScheme: 'per_unit'})

  React.useEffect(() => {
    if (stripeCustomerId) {
      setLoading(true)

      axios
        .get(`/api/stripe/billing/session`, {
          params: {
            customer_id: stripeCustomerId,
          },
        })
        .then(({data}) => {
          if (data) {
            setSubscriptionData(data)
          }
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [stripeCustomerId])

  return {subscriptionData, loading}
}

export default useSubscriptionDetails
