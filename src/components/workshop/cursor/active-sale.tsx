import {AsteriskIcon} from 'lucide-react'
import Link from 'next/link'
import TimeAndLocation from './time-and-location'
import {useCommerceMachine} from '@/hooks/use-commerce-machine'
import {get, isEmpty} from 'lodash'
import WorkshopParityCouponMessage from '@/components/workshop/cursor/parity-coupon-message'
import {Coupon} from '@/types'
import {useState} from 'react'
import {ContactForm} from '@/components/workshop/cursor/team/contact-form'
import {WorkshopDateAndTime} from '@/types'

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
  teamWorkshopFeatures,
  dateAndTime,
}: {
  isPro: boolean
  workshopFeatures: string[]
  teamWorkshopFeatures: string[]
  dateAndTime: WorkshopDateAndTime
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

  const [teamToggleState, setTeamToggleState] = useState(false)

  return (
    <div className="py-12 md:py-24 lg:py-32">
      <section id="pricing" className="w-full bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
            <h2 className="mb-4 lg:text-3xl sm:text-2xl text-xl font-bold text-center dark:text-white text-gray-900 max-w-[25ch]">
              Ready to Take Advantage of AI Development with Cursor?
            </h2>
            <h3 className="sm:text-lg md:text-xl dark:text-gray-200 text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Chosen by 150+ Developers Who Improved their AI Dev Workflows
            </h3>
            <p className="mb-8 text-center text-lg opacity-80 mx-auto">
              Claim a seat in this hands-on workshop designed to level up your
              development process. Overcome the frustration of complex
              integrations, learn to handle failures gracefully, and discover
              powerful planning strategies to keep you shipping code with
              confidence.
            </p>
          </div>
          {teamToggleState ? (
            <ContactForm
              className=" border-2 border-gray-200 dark:border-gray-800 rounded-lg p-6 bg-white dark:bg-gray-800"
              teamWorkshopFeatures={teamWorkshopFeatures}
            />
          ) : (
            <SinglePurchaseUI
              isPro={isPro}
              workshopFeatures={workshopFeatures}
              dateAndTime={dateAndTime}
              paymentLink={paymentLink}
              parityCoupon={parityCoupon}
              isPPPApplied={isPPPApplied}
            />
          )}
        </div>
        <TeamPurchaseSwitch
          teamToggleState={teamToggleState}
          setTeamToggleState={setTeamToggleState}
        />
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

const Price = ({
  isPro,
  parityCoupon,
  isPPPApplied,
}: {
  isPro: boolean
  parityCoupon: Coupon | undefined
  isPPPApplied: boolean
}) => {
  switch (true) {
    case isPPPApplied:
      const discount = parityCoupon?.coupon_discount ?? 0
      const price = (249 - 249 * discount).toFixed(2)
      return (
        <div className="flex items-center justify-center gap-4">
          <p className="text-5xl font-bold">${price}</p>
          <div>
            <p className="flex text-sm font-semibold">SAVE {discount * 100}%</p>
            <p className="text-2xl text-muted-foreground line-through opacity-70">
              $249
            </p>
          </div>
        </div>
      )
    case isPro:
      return (
        <div className="flex items-center justify-center gap-4">
          <p className="text-5xl font-bold">$149</p>
          <div>
            <p className="flex text-sm font-semibold">
              SAVE 40%
              <AsteriskIcon className="-ml-[2px] -mt-1 w-4 h-4" />
            </p>
            <p className="text-2xl text-muted-foreground line-through opacity-70">
              $249
            </p>
          </div>
        </div>
      )
    default:
      return (
        <p className="flex justify-center text-5xl font-bold ">
          $249
          <AsteriskIcon className="-ml-1 mt-3 w-5 h-5" />
        </p>
      )
  }
}

function SinglePurchaseUI({
  isPro,
  workshopFeatures,
  dateAndTime,
  paymentLink,
  parityCoupon,
  isPPPApplied,
}: {
  isPro: boolean
  workshopFeatures: string[]
  dateAndTime: WorkshopDateAndTime
  paymentLink: string
  parityCoupon: Coupon | undefined
  isPPPApplied: boolean
}) {
  return (
    <div className="container px-4 md:px-6">
      <div className="mx-auto max-w-lg pt-12">
        <div className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-800 rounded-lg text-card-foreground shadow-sm">
          <div className="flex flex-col pt-6 pb-4 px-6 space-y-2 text-center">
            <h3 className="text-2xl font-bold text-balance">
              Become More Productive with Cursor
            </h3>
            <Price
              isPro={isPro}
              parityCoupon={parityCoupon}
              isPPPApplied={isPPPApplied}
            />
          </div>
          {dateAndTime && (
            <TimeAndLocation
              date={dateAndTime.date}
              startTime={dateAndTime.startTime}
              timeZone={dateAndTime.timeZone}
              endTime={dateAndTime.endTime}
              showEuTooltip={true}
              isEuFriendly={dateAndTime.isEuFriendly}
            />
          )}
          <div className="p-6 pt-0 grid gap-4">
            <ul className="flex flex-col gap-2 w-fit mx-auto text-md">
              {workshopFeatures.map((feature) => (
                <li className="flex items-center gap-2" key={feature}>
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
  )
}

const TeamPurchaseSwitch = ({
  teamToggleState,
  setTeamToggleState,
}: {
  teamToggleState: boolean
  setTeamToggleState: (state: boolean) => void
}) => {
  return (
    <div className="max-w-screen-md p-8 m-8 sm:mx-auto text-left bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-800 ">
      <h2 className="text-lg font-bold">Need team training?</h2>
      <p className="inline-block mt-5 text-base">
        Learn repeatable, pratcical strategies for shipping code with AI in a
        team setting. Your team will learn how to properly scope and plan work
        to get the most out of AI using real-world examples you can apply
        immediately.
      </p>
      <div className="flex flex-col items-center mt-4">
        <label
          className={`inline-flex items-center px-4 py-3 rounded-md  transition-all ease-in-out duration-150 cursor-pointer border hover:bg-gray-100 dark:hover:bg-gray-700 border-opacity-40 ${
            teamToggleState ? 'border-blue-500' : ' border-gray-300'
          }`}
        >
          <input
            className="form-checkbox"
            name="isTeamTraining"
            type="checkbox"
            checked={teamToggleState}
            onChange={() => setTeamToggleState(!teamToggleState)}
          />
          <span className="ml-4 font-semibold leading-4">
            Activate to contact us about team training
          </span>
        </label>
      </div>
    </div>
  )
}

export default ActiveSale
