import * as React from 'react'
import {useViewer} from '@/context/viewer-context'
import {useRouter, useSearchParams} from 'next/navigation'
import {handleCheckout} from '@/utils/checkout'

interface LifetimePriceProviderProps {
  children: React.ReactNode
}

export const LifetimePriceContext = React.createContext<any>(null)

const LifetimePriceProvider: React.FC<LifetimePriceProviderProps> = ({
  children,
}) => {
  const {viewer, authToken} = useViewer()
  const router = useRouter()
  const params = useSearchParams()
  const stripeParam = params?.get('stripe')
  const lifetimePlan = {price: 500} // TODO: Make this dynamic
  const planFeatures = [
    'Forever Yours',
    'Only Pay Once',
    'Access to all future content',
    'Full access to all the premium courses',
    'Closed captions for every video',
    'Commenting and support',
    'Enhanced Transcripts',
    'RSS course feeds',
  ]

  const [loaderOn, setLoaderOn] = React.useState<boolean>(false)

  const priceId =
    process.env.NEXT_PUBLIC_STRIPE_LIFETIME_MEMBERSHIP_PRICE_ID || ''
  const quantity = 1
  const pricesLoading = false

  const onClickCheckout = async () => {
    await handleCheckout(
      priceId,
      quantity,
      viewer,
      authToken,
      router,
      setLoaderOn,
      true,
    )
  }

  return (
    <LifetimePriceContext.Provider
      value={{
        loaderOn,
        pricesLoading,
        lifetimePlan,
        planFeatures,
        onClickCheckout,
      }}
    >
      {children}
    </LifetimePriceContext.Provider>
  )
}

export default LifetimePriceProvider
