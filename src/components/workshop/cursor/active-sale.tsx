import {AsteriskIcon} from 'lucide-react'
import Link from 'next/link'
import TimeAndLocation from './time-and-location'
import {useCommerceMachine} from '@/hooks/use-commerce-machine'
import {get, isEmpty} from 'lodash'
import WorkshopParityCouponMessage from '@/components/workshop/cursor/parity-coupon-message'
import {Coupon} from '@/types'
import {useState} from 'react'

interface UseWorkshopCouponProps {
  isPro: boolean
}

interface UseWorkshopCouponReturn {
  couponToApply: string
  isPPPApplied: boolean
  pppCouponAvailable: boolean
  countryName: string | undefined
  parityCoupon: Coupon | undefined
  onApplyParityCoupon: () => void
  onDismissParityCoupon: () => void
}

function useWorkshopCoupon({
  isPro,
}: UseWorkshopCouponProps): UseWorkshopCouponReturn {
  const {availableCoupons} = useCommerceMachine()
  const defaultIsProCoupon = isPro
    ? `?prefilled_promo_code=${process.env.NEXT_PUBLIC_LIVE_WORKSHOP_PROMO_CODE}`
    : ''
  const [isPPPApplied, setIsPPPApplied] = useState(false)
  const [couponToApply, setCouponToApply] = useState(defaultIsProCoupon)

  const parityCoupon = availableCoupons?.['ppp']
  const countryCode = get(parityCoupon, 'coupon_region_restricted_to')
  const countryName = get(parityCoupon, 'coupon_region_restricted_to_name')

  const pppCouponAvailable =
    !isEmpty(countryName) && !isEmpty(countryCode) && !isEmpty(parityCoupon)

  const onApplyParityCoupon = () => {
    setIsPPPApplied(true)
    setCouponToApply(`?prefilled_promo_code=${parityCoupon?.coupon_code}`)
  }

  const onDismissParityCoupon = () => {
    setIsPPPApplied(false)
    setCouponToApply(defaultIsProCoupon)
  }

  return {
    couponToApply,
    isPPPApplied,
    pppCouponAvailable,
    countryName,
    parityCoupon,
    onApplyParityCoupon,
    onDismissParityCoupon,
  }
}

const CheckIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-primary"
    >
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  )
}

const ActiveSale = ({
  isPro,
  workshopFeatures,
  dateAndTime,
}: {
  isPro: boolean
  workshopFeatures: string[]
  dateAndTime: {
    date: string
    time: string
  }
}) => {
  const {
    couponToApply,
    isPPPApplied,
    pppCouponAvailable,
    countryName,
    parityCoupon,
    onApplyParityCoupon,
    onDismissParityCoupon,
  } = useWorkshopCoupon({isPro})

  const paymentLink = `${process.env.NEXT_PUBLIC_LIVE_WORKSHOP_STRIPE_PAYMENT_LINK}${couponToApply}`

  return (
    <div className="py-12 md:py-24 lg:py-32 ">
      <section id="pricing" className="w-full bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
            <h2 className="mb-4 lg:text-3xl sm:text-2xl text-xl font-bold text-center dark:text-white text-gray-900 max-w-[25ch]">
              Ready to Take Advantage of AI Development with Cursor?
            </h2>
            <p className="mb-8 text-center sm:text-lg md:text-xl opacity-80 mx-auto">
              Claim a seat in this hands-on workshop designed to level up your
              development process. Overcome the frustration of complex
              integrations, learn to handle failures gracefully, and discover
              powerful planning strategies to keep you shipping code with
              confidence.
            </p>
          </div>
          <div className="mx-auto max-w-lg py-12">
            <div className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-800 rounded-lg text-card-foreground shadow-sm">
              <div className="flex flex-col pt-6 pb-4 px-6 space-y-2 text-center">
                <h3 className="text-2xl font-bold text-balance">
                  Become More Productive with Cursor
                </h3>
                <div className="space-y-1">
                  {isPro ? (
                    <div className="flex items-center justify-center gap-4">
                      <p className="text-5xl font-bold">$119</p>
                      <div>
                        <p className="flex text-sm font-semibold">
                          SAVE 20%
                          <AsteriskIcon className="-ml-[2px] -mt-1 w-4 h-4" />
                        </p>
                        <p className="text-2xl text-muted-foreground line-through opacity-70">
                          $149
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="flex justify-center text-5xl font-bold ">
                      $149
                      <AsteriskIcon className="-ml-1 mt-3 w-5 h-5" />
                    </p>
                  )}
                </div>
              </div>
              <TimeAndLocation
                date={dateAndTime.date}
                time={dateAndTime.time}
              />
              <div className="p-6 pt-0 grid gap-4">
                <ul className="flex flex-col gap-2 w-fit mx-auto text-md">
                  {workshopFeatures.map((feature) => (
                    <li className="flex items-center gap-2">
                      <CheckIcon />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href={paymentLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative inline-flex items-center justify-center rounded-md text-base transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background h-10 py-2 px-4 w-full bg-blue-500 text-white font-semibold"
                >
                  Register Now
                </a>
                <div>
                  <p className="text-xs text-center text-muted-foreground">
                    Limited spots available. Secure yours today!
                  </p>
                  {!isPro ? (
                    <p className="mt-1 text-xs text-center text-muted-foreground underline font-medium">
                      *<Link href="/pricing">Pro users get a 20% discount</Link>
                    </p>
                  ) : (
                    <p className="mt-1 text-xs text-center font-medium opacity-90">
                      *Pro discount applied at checkout
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {pppCouponAvailable && (
        <div className="max-w-screen-md pb-5 mx-auto mt-4">
          <WorkshopParityCouponMessage
            coupon={parityCoupon as Coupon}
            countryName={countryName as string}
            onApply={onApplyParityCoupon}
            onDismiss={onDismissParityCoupon}
            isPPP={isPPPApplied}
          />
        </div>
      )}
    </div>
  )
}

export default ActiveSale
