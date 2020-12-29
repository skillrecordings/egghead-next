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
  redirectURL?: string
}

const Pricing: FunctionComponent<PricingProps> = ({redirectURL}) => {
  const [needsEmail, setNeedsEmail] = React.useState(false)
  const {viewer} = useViewer()
  const {prices, pricesLoading} = usePricing()

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
      stripeCheckoutRedirect(
        annualPrice.price_id,
        viewer.email,
        viewer.subscription?.stripe_subscription_id,
        redirectURL,
      )
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
          <SelectPlan>
            <div className="py-8 px-6 text-center bg-gray-50 lg:flex-shrink-0 lg:flex lg:flex-col lg:justify-center lg:p-12">
              <p className="text-lg leading-6 font-medium text-gray-900">
                One low price...
              </p>
              <div className="mt-4 flex items-center justify-center text-3xl md:text-5xl leading-none font-extrabold text-gray-900">
                {prices.annualPrice ? (
                  <span>${prices.annualPrice.price}</span>
                ) : (
                  <span>$ ---</span>
                )}
                <span className="ml-3 text-base leading-7 font-medium text-gray-500">
                  USD
                </span>
              </div>

              <div className="mt-6">
                <div className="rounded-md shadow">
                  <button
                    onClick={onClickCheckout}
                    disabled={
                      pricesLoading || !prices.annualPrice || viewer?.is_pro
                    }
                    className={`${
                      pricesLoading || viewer?.is_pro
                        ? 'opacity-40'
                        : 'opacity-100'
                    } w-full flex items-center justify-center px-5 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:shadow-outline transition duration-150 ease-in-out`}
                  >
                    {!pricesLoading && prices.annualPrice
                      ? viewer?.is_pro
                        ? `Already a Member!`
                        : `Get Access`
                      : '--'}
                  </button>
                </div>
              </div>
            </div>
          </SelectPlan>
        )}
        {prices.annualPrice && needsEmail && (
          <EmailForm
            priceId={prices.annualPrice.price_id}
            redirectURL={redirectURL}
          />
        )}
      </div>
    </>
  )
}

export async function getServerSideProps(context: any) {
  let redirectURL = null
  try {
    const referer = context.req.headers.referer
    const refererURL = new URL(referer)
    if (refererURL.origin === process.env.NEXT_PUBLIC_REDIRECT_URI)
      redirectURL = referer
  } catch (_e) {
    // no redirect URL from referer
  }

  return {
    props: {redirectURL}, // will be passed to the page component as props
  }
}

export default Pricing
