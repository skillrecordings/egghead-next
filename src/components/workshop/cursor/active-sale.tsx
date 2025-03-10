import {Button} from '@/ui/button'
import {Calendar, Clock, MapPin, AsteriskIcon} from 'lucide-react'
import Link from 'next/link'

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
}: {
  isPro: boolean
  workshopFeatures: string[]
}) => {
  const paymentLink = `${
    process.env.NEXT_PUBLIC_LIVE_WORKSHOP_STRIPE_PAYMENT_LINK
  }${
    isPro
      ? `?prefilled_promo_code=${process.env.NEXT_PUBLIC_LIVE_WORKSHOP_PROMO_CODE}`
      : ''
  }`

  return (
    <div>
      <section
        id="pricing"
        className="w-full py-12 md:py-24 lg:py-32 bg-muted/50"
      >
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
              <TimeAndLocation />
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
    </div>
  )
}

const TimeAndLocation = () => {
  return (
    <div className="px-6 pb-4 flex flex-col  text-md text-muted-foreground  md:gap-2 opacity-80 items-center justify-center">
      <div className="flex items-center gap-1">
        <Calendar className="h-5 w-5" />
        <span>March 11, 2025</span>
      </div>
      <div className="flex items-center gap-1">
        <Clock className="h-5 w-5" />
        <span>9:00 AM - 2:00 PM (PST)</span>
      </div>
      <div className="flex items-center gap-1">
        <MapPin className="h-5 w-5" />
        <span>Zoom</span>
      </div>
    </div>
  )
}

export default ActiveSale
