import * as React from 'react'
import {FunctionComponent, SyntheticEvent} from 'react'

import {useViewer} from 'context/viewer-context'
import {GetServerSideProps} from 'next'
import {loadPrice} from 'lib/stripe/price'
import stripeCheckoutRedirect from 'api/stripe/stripe-checkout-redirect'
import SelectPlan from 'components/pricing/select-plan'
import EmailForm from 'components/pricing/email-form'
import emailIsValid from 'utils/email-is-valid'
import {track} from 'utils/analytics'

export const getServerSideProps: GetServerSideProps = async function ({res}) {
  res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')

  if (!process.env.NEXT_PUBLIC_STRIPE_ANNUAL_PRICE_ID)
    throw new Error('no annual price to load 😭')

  const price = await loadPrice(process.env.NEXT_PUBLIC_STRIPE_ANNUAL_PRICE_ID)

  return {
    props: {
      annualPrice: price,
    },
  }
}

type PricingProps = {
  annualPrice: {
    id: string
    recurring: {
      interval: 'year'
    }
    unit_amount: number
  }
}

const Pricing: FunctionComponent<PricingProps> = ({annualPrice}) => {
  const [needsEmail, setNeedsEmail] = React.useState(false)
  const {viewer} = useViewer()
  const onClickCheckout = async (event: SyntheticEvent) => {
    event.preventDefault()
    await track('checkout: selected plan', {
      priceId: annualPrice.id,
    })

    if (emailIsValid(viewer?.email)) {
      await track('checkout: valid email present', {
        priceId: annualPrice.id,
      })
      await track('checkout: redirect to stripe', {
        priceId: annualPrice.id,
      })
      stripeCheckoutRedirect(annualPrice.id, viewer.email)
    } else {
      await track('checkout: get email', {
        priceId: annualPrice.id,
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
          <SelectPlan
            price={annualPrice.unit_amount / 100}
            onClickCheckout={onClickCheckout}
          />
        )}
        {needsEmail && <EmailForm priceId={annualPrice.id} />}
      </div>
    </>
  )
}

export default Pricing
