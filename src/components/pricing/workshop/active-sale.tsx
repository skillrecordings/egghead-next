import React from 'react'
import emailIsValid from '@/utils/email-is-valid'
import {useRouter} from 'next/navigation'
import {useViewer} from '@/context/viewer-context'
import PoweredByStripe from '../powered-by-stripe'
import {twMerge} from 'tailwind-merge'
import slugify from 'slugify'
import Spinner from '@/components/spinner'

const ActiveSale = ({
  lastCharge,
  priceId,
  title,
  plan,
  workshopFeatures,
}: {
  lastCharge: {amountPaid: number}
  priceId: string
  title: string
  plan: {
    price: number
    price_discounted: number
  }
  workshopFeatures: string[]
}) => {
  const {viewer} = useViewer()

  const router = useRouter()

  const [loaderOn, setLoaderOn] = React.useState<boolean>(false)

  const quantity = 1
  const pricesLoading = false

  const amountPaid =
    lastCharge?.amountPaid === 0 ? null : lastCharge?.amountPaid

  const onClickCheckout = async () => {
    console.log('onClickCheckout', priceId)
    if (!priceId) return

    if (emailIsValid(viewer?.email)) {
      const {sessionUrl, error} = await fetch('/api/stripe/checkout/workshop', {
        method: 'POST',
        body: JSON.stringify({
          email: viewer.email,
          successPath: '/confirm/workshop',
          cancelPath: '/workshop',
        }),
      }).then((res) => res.json())
      if (sessionUrl) {
        router.push(sessionUrl)
      } else {
        console.error('error creating checkout session', error)
      }
    } else {
      router.push(
        '/workshop/email?' +
          new URLSearchParams({
            priceId,
            quantity: quantity.toString(),
          }),
      )
      setLoaderOn(true)
    }
  }

  return (
    <div className="flex flex-col items-center py-16">
      <div className="relative p-2 bg-gray-100 rounded-md shadow-lg dark:bg-gray-800 dark:shadow-none">
        <div className="relative z-10 flex flex-col items-center max-w-sm px-5 py-5 text-gray-900 bg-white rounded-sm dark:text-white dark:bg-gray-900 sm:px-8 sm:py-12">
          <PlanTitle className="text-center">{title}</PlanTitle>
          <div className="py-6">
            <PlanPrice
              pricesLoading={pricesLoading}
              plan={plan}
              amountPaid={amountPaid}
            />
          </div>

          <PlanFeatures planFeatures={workshopFeatures} />
          <GetAccessButton
            label="Register Today"
            handleClick={onClickCheckout}
            loaderOn={loaderOn}
            pricesLoading={pricesLoading}
          />
        </div>
      </div>
      <div className="flex sm:flex-row flex-col items-center py-24 sm:space-x-5 sm:space-y-0 space-y-5">
        <PoweredByStripe />
        <div className="text-sm">30 day money back guarantee</div>
      </div>
    </div>
  )
}

export const PlanPrice: React.FunctionComponent<
  React.PropsWithChildren<{
    plan: {price: number; price_discounted?: number}
    pricesLoading: boolean
    amountPaid: number | null
  }>
> = ({plan, pricesLoading, amountPaid}) => {
  const price = plan.price
  const displayPrice = amountPaid ? price - amountPaid : price
  const discount_percentage = amountPaid
    ? Math.round((amountPaid * 100) / price)
    : 0
  return (
    <div className={`flex flex-col items-center`}>
      <div className="flex items-end leading-none">
        <span className="self-start mt-1">USD</span>
        <span className="text-4xl font-light">$</span>
        <span className="self-stretch text-4xl font-extrabold">
          {amountPaid ? (
            <div className="flex items-end">
              <div className={`relative ${pricesLoading ? 'opacity-60' : ''}`}>
                {pricesLoading && (
                  <Spinner className="absolute text-current" size={6} />
                )}
                {displayPrice}
              </div>
              <div className="flex flex-col items-start ml-2">
                <div className="relative text-xl opacity-90 before:h-[2px] before:rotate-[-19deg] before:absolute before:bg-current before:w-full flex justify-center items-center text-center">
                  &nbsp;{price}&nbsp;
                </div>
                <div className="text-sm font-semibold text-blue-600 uppercase dark:text-amber-400">
                  save {discount_percentage}%
                </div>
              </div>
            </div>
          ) : (
            <div className={`relative ${pricesLoading ? 'opacity-60' : ''}`}>
              {displayPrice}
              <span className="inline-block text-sm text-gray-500 -translate-y-7 translate-x-1">
                00
              </span>
            </div>
          )}
        </span>
      </div>

      {amountPaid && (
        <>
          <div className="text-sm font-medium pt-2">Member Pricing</div>
          <div className="text-sm font-semibold uppercase text-blue-600  dark:text-amber-400">
            ${amountPaid}.00 credit applied
          </div>
        </>
      )}
    </div>
  )
}

const GetAccessButton: React.FunctionComponent<
  React.PropsWithChildren<{
    label: string
    handleClick: () => void
    loaderOn: boolean
    pricesLoading: boolean
  }>
> = ({label, handleClick, loaderOn, pricesLoading}) => {
  return (
    <button
      disabled={pricesLoading}
      className={`w-full px-5 py-2 h-[60px] flex justify-center items-center mt-8 font-semibold text-center text-white transition-all duration-300 ease-in-out bg-blue-600 rounded-md ${
        pricesLoading
          ? 'opacity-60 cursor-default'
          : 'hover:bg-blue-700 hover:scale-105'
      }`}
      onClick={(event) => {
        event.preventDefault()
        handleClick()
      }}
      type="button"
    >
      {loaderOn || pricesLoading ? (
        <Spinner className="absolute text-white" size={6} />
      ) : (
        label
      )}
    </button>
  )
}

const DEFAULT_FEATURES = [
  'Full day of intensive training',
  'Hour long break for lunch',
  'Prompt and .cursorrules used by John Lindquist',
]

const PlanFeatures: React.FunctionComponent<
  React.PropsWithChildren<{
    planFeatures?: string[]
  }>
> = ({planFeatures = DEFAULT_FEATURES}) => {
  const CheckIcon = () => (
    <svg
      className="flex-shrink-0 inline-block mt-1 text-blue-500"
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
    >
      <path
        fill="currentColor"
        d="M6.00266104,15 C5.73789196,15 5.48398777,14.8946854 5.29679603,14.707378 L0.304822855,9.71382936 C0.0452835953,9.46307884 -0.0588050485,9.09175514 0.0325634765,8.74257683 C0.123932001,8.39339851 0.396538625,8.12070585 0.745606774,8.02930849 C1.09467492,7.93791112 1.46588147,8.04203262 1.71655287,8.30165379 L5.86288579,12.4482966 L14.1675324,0.449797837 C14.3666635,0.147033347 14.7141342,-0.0240608575 15.0754425,0.00274388845 C15.4367507,0.0295486344 15.7551884,0.250045268 15.9074918,0.578881992 C16.0597953,0.907718715 16.0220601,1.29328389 15.8088932,1.58632952 L6.82334143,14.5695561 C6.65578773,14.8145513 6.38796837,14.9722925 6.09251656,15 C6.06256472,15 6.03261288,15 6.00266104,15 Z"
      />
    </svg>
  )

  return (
    <ul>
      {planFeatures.map((feature: string) => {
        return (
          <li className="flex py-2 font-medium" key={slugify(feature)}>
            <CheckIcon />
            <span className="ml-2 leading-tight">{feature}</span>
          </li>
        )
      })}
    </ul>
  )
}

export const PlanTitle: React.FunctionComponent<
  React.PropsWithChildren<{className?: string}>
> = ({children, className}) => (
  <h2
    className={twMerge(
      `text-xl font-bold text-gray-900 dark:text-white`,
      className,
    )}
  >
    {children}
  </h2>
)

export default ActiveSale
