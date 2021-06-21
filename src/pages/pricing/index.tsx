import * as React from 'react'
import {FunctionComponent, SyntheticEvent} from 'react'
import {useViewer} from 'context/viewer-context'
import stripeCheckoutRedirect from 'api/stripe/stripe-checkout-redirect'
import emailIsValid from 'utils/email-is-valid'
import {track} from 'utils/analytics'
import {usePricing} from 'hooks/use-pricing'
import {first, get} from 'lodash'
import {StripeAccount} from 'types'
import {useRouter} from 'next/router'
import SelectPlanNew from 'components/pricing/select-plan-new'
import PoweredByStripe from 'components/pricing/powered-by-stripe'
import Testimonials from 'components/pricing/testimonials'
import testimonialsData from 'components/pricing/testimonials/data'

type PricingProps = {
  annualPrice: {
    id: string
    recurring: {
      interval: 'year'
    }
    unit_amount: number
  }
  redirectURL?: string
}

const Pricing: FunctionComponent<PricingProps> & {getLayout: any} = () => {
  const {viewer, authToken} = useViewer()
  const {prices, pricesLoading, quantity, setQuantity} = usePricing()
  const [priceId, setPriceId] = React.useState<string>()
  const router = useRouter()

  React.useEffect(() => {
    track('visited pricing')
    if (router?.query?.stripe === 'cancelled') {
      track('checkout: cancelled from stripe')
    }
  }, [])

  const onClickCheckout = async (event: SyntheticEvent) => {
    event.preventDefault()

    if (!priceId) return
    const account = first<StripeAccount>(get(viewer, 'accounts'))
    await track('checkout: selected plan', {
      priceId: priceId,
    })

    if (emailIsValid(viewer?.email)) {
      await track('checkout: valid email present', {
        priceId: priceId,
      })
      await track('checkout: redirect to stripe', {
        priceId,
      })
      stripeCheckoutRedirect({
        priceId,
        email: viewer.email,
        stripeCustomerId: account?.stripe_customer_id,
        authToken,
        quantity,
      })
    } else {
      await track('checkout: get email', {
        priceId: priceId,
      })
      router.push(`/pricing/email?priceId=${priceId}&quantity=${quantity}`)
    }
  }
  return (
    <>
      <div className="dark:bg-gray-900 bg-gray-50 dark:text-white text-gray-900 px-5">
        <header className="text-center py-16 flex flex-col items-center">
          <h1 className="md:text-4xl text-2xl font-extrabold leading-tighter max-w-screen-md">
            Build your Developer Project Portfolio and{' '}
            <span className="dark:text-yellow-300 text-yellow-500">
              Get a Better Job
            </span>{' '}
            as a Web Developer
          </h1>
          <h2 className="text-lg font-light max-w-2xl pt-8 leading-tight dark:text-gray-200 text-gray-700">
            Learn the skills you need to advance your career and build
            real-world business focused professional projects on the job and for
            your portfolio
          </h2>
        </header>
        <main className="flex flex-col items-center">
          <div className="p-2 relative dark:bg-gray-800 bg-gray-100 rounded-md dark:shadow-none shadow-lg">
            <SelectPlanNew
              prices={prices}
              pricesLoading={pricesLoading}
              handleClickGetAccess={onClickCheckout}
              quantityAvailable={true}
              onQuantityChanged={(quantity: number) => {
                setQuantity(quantity)
              }}
              onPriceChanged={(priceId: string) => {
                setPriceId(priceId)
              }}
            />
          </div>
          <div className="py-24 flex items-center space-x-5">
            <PoweredByStripe />
            <div className="text-sm">30 day money back guarantee</div>
          </div>
          <Testimonials testimonials={testimonialsData} />
        </main>
      </div>
    </>
  )
}

Pricing.getLayout = (Page: any, pageProps: any) => {
  return <Page {...pageProps} />
}

export default Pricing
