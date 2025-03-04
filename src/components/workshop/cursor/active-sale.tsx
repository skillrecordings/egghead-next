import {Button} from '@/ui/button'
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

  console.log(paymentLink)
  return (
    <div>
      <section
        id="pricing"
        className="w-full py-12 md:py-24 lg:py-32 bg-muted/50"
      >
        <div className="container px-4 md:px-6">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Workshop Pricing
            </h2>
            <p className="max-w-[85%] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Streamline your development cycle with Cursor
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
                        <p className="text-sm font-semibold text-yellow-500">
                          SAVE 20%
                        </p>
                        <p className="text-2xl text-muted-foreground line-through opacity-70">
                          $149
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-5xl font-bold">$149</p>
                  )}
                </div>
              </div>
              <div className="p-6 pt-0 grid gap-4">
                <ul className="flex flex-col gap-2 w-fit mx-auto">
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
                <p className="text-xs text-center text-muted-foreground">
                  Limited spots available. Secure yours today!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ActiveSale
