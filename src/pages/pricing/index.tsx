import * as React from 'react'
import {FunctionComponent, SyntheticEvent} from 'react'
import {useViewer} from 'context/viewer-context'

import stripeCheckoutRedirect from 'api/stripe/stripe-checkout-redirect'
import SelectPlan from 'components/pricing/select-plan'
import EmailForm from 'components/pricing/email-form'
import emailIsValid from 'utils/email-is-valid'
import {track} from 'utils/analytics'
import {usePricing, Prices} from 'hooks/use-pricing'

type PricingProps = {
  annualPrice: {
    id: string
    recurring: {
      interval: 'year'
    }
    unit_amount: number
  }
}

const Pricing: FunctionComponent<PricingProps> = () => {
  const [needsEmail, setNeedsEmail] = React.useState(false)
  const {viewer} = useViewer()
  const prices: Prices = usePricing()

  const onClickCheckout = async (event: SyntheticEvent) => {
    event.preventDefault()

    if (!prices.annualPrice) return

    const {annualPrice} = prices
    await track('checkout: selected plan', {
      priceId: annualPrice.price_id,
    })

    if (emailIsValid(viewer?.email)) {
      await track('checkout: valid email present', {
        priceId: annualPrice.price_id,
      })
      await track('checkout: redirect to stripe', {
        priceId: annualPrice.price_id,
      })
      stripeCheckoutRedirect(annualPrice.price_id, viewer.email)
    } else {
      await track('checkout: get email', {
        priceId: annualPrice.price_id,
      })
      setNeedsEmail(true)
    }
  }
  return (
    <>
      <div className="">
        {!needsEmail && (
          <div className="pt-12 sm:pt-16 lg:pt-20">
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h2 className="text-3xl leading-9 font-extrabold text-gray-900 sm:text-4xl sm:leading-10 lg:text-5xl lg:leading-none">
                  Your egghead membership pays for itself.
                </h2>
                <h3 className="text-2xl leading-9 font-extrabold text-gray-900 sm:text-3xl sm:leading-10 lg:text-4xl lg:leading-none">
                  Over and over again.
                </h3>
                <p className="max-w-3xl m-auto mt-4 text-center text-xl leading-7 text-gray-600">
                  Build your professional developer portfolio and learn the
                  skills you need to climb the career ladder as a badass web
                  developer
                </p>
              </div>
            </div>
          </div>
        )}
        {!needsEmail && (
          <SelectPlan prices={prices} onClickCheckout={onClickCheckout} />
        )}
        {prices.annualPrice && needsEmail && (
          <EmailForm priceId={prices.annualPrice.price_id} />
        )}
      </div>
    </>
  )
}

export default Pricing
