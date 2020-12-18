import * as React from 'react'
import {FunctionComponent, SyntheticEvent} from 'react'

import axios from 'axios'
import {useViewer} from 'context/viewer-context'
import {GetServerSideProps} from 'next'
import {loadPrice} from 'lib/stripe/price'
import stripeCheckoutRedirect from 'api/stripe/stripe-checkout-redirect'
import SelectPlan from 'components/pricing/select-plan'
import EmailForm from 'components/pricing/email-form'
import emailIsValid from 'utils/email-is-valid'

export const getServerSideProps: GetServerSideProps = async function ({res}) {
  res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')

  const {data: pricingData} = await axios.get(
    `${process.env.NEXT_PUBLIC_AUTH_DOMAIN}/api/v1/pricing`,
  )
  // TODO: Is finding the annual plan by name reliable?
  const proYearly: {price_id: string} | undefined = pricingData.plans.find(
    (plan: any) => plan.name === 'Pro Yearly',
  )

  if (!proYearly?.price_id) throw new Error('no annual price to load 😭')

  const price = await loadPrice(proYearly.price_id)

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
  const onClickCheckout = (event: SyntheticEvent) => {
    event.preventDefault()
    if (emailIsValid(viewer?.email)) {
      stripeCheckoutRedirect(annualPrice.id, viewer.email)
    } else {
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
                  Simple no-tricks pricing
                </h2>
                <p className="mt-4 text-xl leading-7 text-gray-600">
                  If you're not satisfied, contact us within the first 14 days
                  and we'll send you a full refund.
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
