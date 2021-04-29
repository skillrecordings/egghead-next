import * as React from 'react'
import axios from 'axios'

type SubscriptionData = {
  portalUrl?: string
  subscription?: any
  price?: any
  product?: any
  latestInvoice?: any
  upcomingInvoice?: any
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
  ] = React.useState<SubscriptionData>({})

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
