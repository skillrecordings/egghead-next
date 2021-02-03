import * as React from 'react'
import {FunctionComponent} from 'react'
import SelectPlanNew from 'components/pricing/select-plan-new'
import Testimonials from 'components/pricing/testimonials'
import testimonialsData from './testimonials/data'
import PoweredByStripe from './powered-by-stripe'

const QUANTITY_PRICING_ENABLED =
  process.env.NEXT_PUBLIC_FF_QUANTITY_PRICING_AVAILABLE !== 'false'

type PricingProps = {
  viewer: any
  authToken: string
  prices:
    | any
    | {
        annualPrice: {
          id: string
          recurring: {
            interval: 'year'
          }
          unit_amount: number
        }
      }
  pricesLoading: boolean
  needsEmail: boolean
  setNeedsEmail: React.Dispatch<React.SetStateAction<boolean>>
  redirectURL?: string
  dark?: boolean
  quantityAvailable?: boolean
}

const PricingPage: FunctionComponent<PricingProps> = ({
  dark,
  prices,
  pricesLoading,
  quantityAvailable = true,
  // viewer,
  // authToken,
  // needsEmail,
  // setNeedsEmail,
  // redirectURL,
}) => {
  // TODO: pricing is a sequence of states that covers multiple steps which
  // should be appropriately captured in a state machine.

  return (
    <div className={`${dark ? 'dark' : ''} dark:bg-gray-900 bg-white-50`}>
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
              handleClickGetAccess={() => {}}
              quantityAvailable={QUANTITY_PRICING_ENABLED && quantityAvailable}
            />
          </div>
          <div className="py-24 flex items-center space-x-5">
            <PoweredByStripe />
            <div className="text-sm">30 day money back guarantee</div>
          </div>
          <Testimonials testimonials={testimonialsData} />
        </main>
      </div>
    </div>
  )
}

export default PricingPage
