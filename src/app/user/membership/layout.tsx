import {Suspense} from 'react'
import Invoices from '@/components/invoices'
import WorkshopTransactions from '@/components/workshop-transactions'
import Spinner from '@/components/spinner'

export default async function MembershipPageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="w-full">
      <h2 className="pb-3 md:pb-4 text-lg font-medium md:font-normal md:text-xl leading-none">
        Membership
      </h2>
      <div className="min-h-[200px] flex justify-center items-center">
        {children}
      </div>
      <Invoices headingAs="h3" />
      <Suspense
        fallback={
          <div className="mt-16">
            <h3 className="text-lg font-medium md:font-normal md:text-xl leading-none mb-4">
              Workshop Transactions
            </h3>
            <div className="flex justify-center">
              <Spinner className="w-6 h-6 text-gray-600" />
            </div>
          </div>
        }
      >
        <WorkshopTransactions headingAs="h3" />
      </Suspense>
    </div>
  )
}
