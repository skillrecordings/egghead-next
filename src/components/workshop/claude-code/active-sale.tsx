import {AsteriskIcon} from 'lucide-react'
import Link from 'next/link'
import TimeAndLocation from '../shared/time-and-location'
import {useCommerceMachine} from '@/hooks/use-commerce-machine'
import {get, isEmpty} from 'lodash'
import WorkshopParityCouponMessage from '@/components/workshop/shared/parity-coupon-message'
import {Coupon} from '@/types'
import {useState, useMemo, useEffect} from 'react'
import {ContactForm} from '@/components/workshop/claude-code/contact-form'
import {LiveWorkshop} from '@/types'
import Spinner from '@/components/spinner'

interface UseWorkshopCouponProps {
  hasProDiscount: boolean
  workshop: LiveWorkshop
}

interface UseWorkshopCouponReturn {
  couponToApply: {
    queryParam: string
    type:
      | 'earlyBird-member'
      | 'earlyBird-non-member'
      | 'member'
      | 'non-member'
      | 'ppp'
  }
  isPPPApplied: boolean
  pppCouponAvailable: boolean
  countryName: string | undefined
  parityCoupon: Coupon | undefined
  onApplyParityCoupon: () => void
  onDismissParityCoupon: () => void
}

function useWorkshopCoupon({
  hasProDiscount,
  workshop,
}: UseWorkshopCouponProps): UseWorkshopCouponReturn {
  const {availableCoupons} = useCommerceMachine()

  const baseCoupon = useMemo(() => {
    switch (true) {
      case hasProDiscount && workshop?.isEarlyBird:
        return {
          queryParam: `?prefilled_promo_code=${workshop?.stripeEarlyBirdMemberCouponCode}`,
          type: 'earlyBird-member' as const,
        }
      case workshop?.isEarlyBird:
        return {
          queryParam: `?prefilled_promo_code=${workshop?.stripeEarlyBirdCouponCode}`,
          type: 'earlyBird-non-member' as const,
        }
      case hasProDiscount:
        return {
          queryParam: `?prefilled_promo_code=${workshop?.stripeMemberCouponCode}`,
          type: 'member' as const,
        }
      default:
        return {
          queryParam: ``,
          type: 'non-member' as const,
        }
    }
  }, [
    hasProDiscount,
    workshop?.isEarlyBird,
    workshop?.stripeEarlyBirdMemberCouponCode,
    workshop?.stripeEarlyBirdCouponCode,
    workshop?.stripeMemberCouponCode,
  ])

  const [isPPPApplied, setIsPPPApplied] = useState(false)
  const [couponToApply, setCouponToApply] =
    useState<UseWorkshopCouponReturn['couponToApply']>(baseCoupon)

  useEffect(() => {
    if (!isPPPApplied) {
      console.log(
        'Effect running: Updating couponToApply based on new baseCoupon',
        baseCoupon,
      )
      setCouponToApply(baseCoupon)
    } else {
      console.log('Effect running: PPP is applied, not updating couponToApply')
    }
  }, [baseCoupon, isPPPApplied])

  const parityCoupon = availableCoupons?.['ppp']
  const countryCode = get(parityCoupon, 'coupon_region_restricted_to')
  const countryName = get(parityCoupon, 'coupon_region_restricted_to_name')

  const pppCouponAvailable =
    !isEmpty(countryName) && !isEmpty(countryCode) && !isEmpty(parityCoupon)

  const onApplyParityCoupon = () => {
    setIsPPPApplied(true)
    setCouponToApply({
      queryParam: `?prefilled_promo_code=${parityCoupon?.coupon_code}`,
      type: 'ppp' as const,
    })
  }

  const onDismissParityCoupon = () => {
    setIsPPPApplied(false)
    setCouponToApply(baseCoupon)
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
  hasProDiscount,
  workshopFeatures,
  teamWorkshopFeatures,
  workshop,
  isLiveWorkshopLoading,
}: {
  hasProDiscount: boolean
  workshopFeatures: string[]
  teamWorkshopFeatures: string[]
  workshop: LiveWorkshop
  isLiveWorkshopLoading: boolean
}) => {
  const {
    couponToApply,
    isPPPApplied,
    pppCouponAvailable,
    countryName,
    parityCoupon,
    onApplyParityCoupon,
    onDismissParityCoupon,
  } = useWorkshopCoupon({hasProDiscount, workshop})

  const paymentLink = `${workshop?.stripePaymentLink}${couponToApply.queryParam}`

  const [teamToggleState, setTeamToggleState] = useState(false)

  return (
    <div className="lg:py-20">
      <section id="pricing" className="w-full bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
            <h2 className="mt-10 sm:mt-20 mb-10 lg:text-3xl sm:text-2xl text-xl font-bold dark:text-white text-center text-balance">
              Stop Wrestling with Brittle Prompts. <br />
              Start Engineering AI You Can Command.
            </h2>
            <h3 className="text-lg md:text-xl dark:text-gray-200 text-gray-700 max-w-3xl mx-auto leading-relaxed font-medium">
              Chosen by 150+ Developers Who Improved their AI Dev Workflows
            </h3>
            <p className="mb-8 text-center text-lg opacity-80 mx-auto">
              This workshop is for developers and engineers who are ready to
              move beyond the hype and build real, reliable, and robust systems
              with AI. If you're comfortable with TypeScript and want to become
              the AI architect your team needs, this is for you.
              <br />
              <br />
              Your transformation into a Claude Code power user starts here.
              <br />
              <br />
              The previous workshop sold out in 7 days. Don’t join the
              wait-list, secure your spot today.
            </p>
          </div>
          {teamToggleState ? (
            <ContactForm
              className=" border-2 border-gray-200 dark:border-gray-800 rounded-lg p-6 bg-white dark:bg-gray-800"
              teamWorkshopFeatures={teamWorkshopFeatures}
            />
          ) : (
            <SinglePurchaseUI
              couponToApply={couponToApply}
              workshopFeatures={workshopFeatures}
              workshop={workshop}
              paymentLink={paymentLink}
              parityCoupon={parityCoupon}
              isLiveWorkshopLoading={isLiveWorkshopLoading}
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
  isLiveWorkshopLoading,
  parityCoupon,
  couponToApply,
  workshop,
}: {
  parityCoupon: Coupon | undefined
  couponToApply: {
    queryParam: string
    type: string
  }
  workshop: LiveWorkshop
  isLiveWorkshopLoading: boolean
}) => {
  if (isLiveWorkshopLoading) {
    return (
      <div className="flex items-center justify-center gap-4">
        <Spinner size={12} className="text-black dark:text-white" />
      </div>
    )
  }
  switch (true) {
    case couponToApply.type === 'ppp':
      const discount = parityCoupon?.coupon_discount ?? 0
      const price = (
        Number(workshop?.workshopPrice) -
        Number(workshop?.workshopPrice) * discount
      ).toFixed(2)
      return (
        <div className="flex flex-col items-center justify-center gap-1">
          <div className="flex items-center justify-center gap-4">
            <p className="text-5xl font-bold">${price}</p>
            <div>
              <p className="flex text-sm font-semibold">
                SAVE {discount * 100}%
              </p>
              <p className="text-2xl text-muted-foreground line-through opacity-70">
                ${Number(workshop?.workshopPrice)}
              </p>
            </div>
          </div>
          <p className="text-xs font-medium text-green-600 dark:text-green-400 flex items-center gap-1">
            <CheckIcon /> Purchasing Power Parity Discount Applied
          </p>
        </div>
      )
    case couponToApply.type === 'earlyBird-member':
      const earlyBirdMemberPrice = (
        Number(workshop?.workshopPrice) -
        Number(workshop?.stripeEarlyBirdMemberDiscount)
      ).toFixed(2)
      const earlyBirdMemberDiscount = Math.round(
        (Number(workshop?.stripeEarlyBirdMemberDiscount) /
          Number(workshop?.workshopPrice)) *
          100,
      )
      return (
        <div className="flex flex-col items-center justify-center gap-1">
          <div className="flex items-center justify-center gap-4">
            <p className="text-5xl font-bold">${earlyBirdMemberPrice}</p>
            <div>
              <p className="flex text-sm font-semibold">
                SAVE {earlyBirdMemberDiscount}%
                <AsteriskIcon className="-ml-[2px] -mt-1 w-4 h-4" />
              </p>
              <p className="text-2xl text-muted-foreground line-through opacity-70">
                ${Number(workshop?.workshopPrice)}
              </p>
            </div>
          </div>
          <p className="text-xs font-medium text-green-600 dark:text-green-400 flex items-center gap-1">
            <CheckIcon /> Early Bird Member Discount Applied
          </p>
        </div>
      )
    case couponToApply.type === 'earlyBird-non-member':
      const earlyBirdNonMemberPrice = (
        Number(workshop?.workshopPrice) -
        Number(workshop?.stripeEarlyBirdNonMemberDiscount)
      ).toFixed(2)
      const earlyBirdNonMemberDiscount = Math.round(
        (Number(workshop?.stripeEarlyBirdNonMemberDiscount) /
          Number(workshop?.workshopPrice)) *
          100,
      )
      return (
        <div className="flex flex-col items-center justify-center gap-1">
          <div className="flex items-center justify-center gap-4">
            <p className="text-5xl font-bold">${earlyBirdNonMemberPrice}</p>
            <div>
              <p className="flex text-sm font-semibold">
                SAVE {earlyBirdNonMemberDiscount}%
                <AsteriskIcon className="-ml-[2px] -mt-1 w-4 h-4" />
              </p>
              <p className="text-2xl text-muted-foreground line-through opacity-70">
                ${Number(workshop?.workshopPrice)}
              </p>
            </div>
          </div>
          <p className="text-xs font-medium text-green-600 dark:text-green-400 flex items-center gap-1">
            <CheckIcon /> Early Bird Discount Applied
          </p>
        </div>
      )
    case couponToApply.type === 'member':
      const memberPrice = (
        Number(workshop?.workshopPrice) - Number(workshop?.stripeMemberDiscount)
      ).toFixed(2)
      const memberDiscount = Math.round(
        (Number(workshop?.stripeMemberDiscount) /
          Number(workshop?.workshopPrice)) *
          100,
      )
      return (
        <div className="flex flex-col items-center justify-center gap-1">
          <div className="flex items-center justify-center gap-4">
            <p className="text-5xl font-bold">${memberPrice}</p>
            <div>
              <p className="flex text-sm font-semibold">
                SAVE {memberDiscount}%
                <AsteriskIcon className="-ml-[2px] -mt-1 w-4 h-4" />
              </p>
              <p className="text-2xl text-muted-foreground line-through opacity-70">
                ${Number(workshop?.workshopPrice)}
              </p>
            </div>
          </div>
          <p className="text-xs font-medium text-green-600 dark:text-green-400 flex items-center gap-1">
            <CheckIcon /> Member Discount Applied
          </p>
        </div>
      )
    default:
      return (
        <p className="flex justify-center text-5xl font-bold ">
          ${Number(workshop?.workshopPrice)}
        </p>
      )
  }
}

function SinglePurchaseUI({
  couponToApply,
  workshopFeatures,
  workshop,
  paymentLink,
  parityCoupon,
  isLiveWorkshopLoading,
}: {
  couponToApply: {
    queryParam: string
    type: string
  }
  workshopFeatures: string[]
  workshop: LiveWorkshop
  paymentLink: string
  parityCoupon: Coupon | undefined
  isLiveWorkshopLoading: boolean
}) {
  return (
    <div className="container px-4 md:px-6">
      <div className="mx-auto max-w-lg pt-12">
        <div className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-800 rounded-lg text-card-foreground shadow-sm">
          <div className="flex flex-col pt-6 pb-4 px-6 space-y-2 text-center">
            <h3 className="text-2xl font-bold text-balance">
              Transform into a Claude Code Power User
            </h3>
            <Price
              isLiveWorkshopLoading={isLiveWorkshopLoading}
              parityCoupon={parityCoupon}
              couponToApply={couponToApply}
              workshop={workshop}
            />
          </div>
          {workshop && (
            <TimeAndLocation
              date={workshop.date}
              startTime={workshop.startTime}
              timeZone={workshop.timeZone}
              endTime={workshop.endTime}
              showEuTooltip={true}
              isEuFriendly={workshop.isEuFriendly}
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
              {couponToApply.type !== 'non-member' && (
                <p className="mt-1 text-xs text-center font-medium opacity-90">
                  *Discount applied at checkout
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
