import * as React from 'react'
import axios from 'axios'

const useSubscriptionDetails = ({
  stripeCustomerId,
  slug,
}: {
  stripeCustomerId: string
  slug: string
}) => {
  const [loading, setLoading] = React.useState<boolean>(true)
  const [subscriptionData, setSubscriptionData] = React.useState<any>()
  const recur = (price: any) => {
    if (price === undefined) return ''

    const {
      recurring: {interval, interval_count},
    } = price

    if (interval === 'month' && interval_count === 3) return 'quarter'
    if (interval === 'month' && interval_count === 6) return '6-months'
    if (interval === 'month' && interval_count === 1) return 'month'
    if (interval === 'year' && interval_count === 1) return 'year'
  }

  React.useEffect(() => {
    if (stripeCustomerId) {
      setLoading(true)

      axios
        .get(`/api/stripe/billing/session`, {
          params: {
            customer_id: stripeCustomerId,
            account_slug: slug,
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
  }, [stripeCustomerId, slug])

  return {subscriptionData, recur, loading}
}

export default useSubscriptionDetails
