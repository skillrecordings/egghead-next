import * as React from 'react'
import {FunctionComponent} from 'react'
import SelectPlanNew from 'components/pricing/select-plan-new'
import Testimonials from 'components/pricing/testimonials'
import testimonialsData from './testimonials/data'
import PoweredByStripe from './powered-by-stripe'

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
}

const PricingPage: FunctionComponent<PricingProps> = ({
  dark,
  prices,
  pricesLoading,
  // viewer,
  // authToken,
  // needsEmail,
  // setNeedsEmail,
  // redirectURL,
}) => {
  return (
    <div className={`${dark ? 'dark' : ''} dark:bg-gray-900 bg-white-50 p-5`}>
      <div className="dark:bg-gray-900 bg-gray-50 dark:text-white text-gray-900 px-5">
        <header className="text-center py-16 flex flex-col items-center">
          <h1 className="md:text-4xl text-2xl font-extrabold leading-tighter max-w-screen-md">
            Build your Developer Portfolio and{' '}
            <span className="dark:text-yellow-300 text-yellow-500">Shine</span>{' '}
            in Tech
          </h1>
          <h2 className="text-lg font-light max-w-md pt-8 leading-tight dark:text-gray-200 text-gray-700">
            Becoming an egghead Pro Member will unlock all of the premium
            courses and content on egghead.io.
          </h2>
        </header>
        <main className="flex flex-col items-center">
          <SelectPlanNew
            prices={prices}
            pricesLoading={pricesLoading}
            handleClickGetAccess={() => {}}
          />
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
