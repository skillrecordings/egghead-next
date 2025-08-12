'use client'

import * as React from 'react'
import {format, parseISO} from 'date-fns'
import {trpc} from '@/app/_trpc/client'

type HeadingProps = React.ComponentPropsWithoutRef<any> & {
  headingAs?: 'h1' | 'h2' | 'h3' | 'h4' | 'p'
}

const WorkshopTransactions: React.FunctionComponent<
  React.PropsWithChildren<HeadingProps>
> = ({headingAs}) => {
  const {data: workshopTransactions, status} =
    trpc.stripe.workshopTransactionsForCurrent.useQuery()

  const Heading = headingAs ?? 'p'

  const getWorkshopInvoiceUrl = (chargeId: string, workshopType: string) => {
    // Map workshop types to their invoice paths
    const workshopPaths: Record<string, string> = {
      'claude-code': '/workshop/claude-code/invoice',
      cursor: '/workshop/cursor/invoice',
      // Add more workshop types as needed
    }

    const path = workshopPaths[workshopType] || '/workshop/claude-code/invoice'
    return `${path}/${chargeId}`
  }

  if (status === 'loading') {
    return null
  }

  if (!workshopTransactions || workshopTransactions.length === 0) {
    return null
  }

  return (
    <main className="mt-16">
      <div className="flex flex-col space-y-8">
        <Heading className="text-lg font-medium md:font-normal md:text-xl leading-none">
          Workshop Transactions
        </Heading>
        <div>
          <ul className="space-y-6">
            {workshopTransactions.map((transaction: any) => {
              return (
                <li key={transaction.id}>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
                    <div className="flex-1">
                      <div className="font-medium">
                        {transaction.product_name}
                      </div>
                      <div className="text-sm text-gray-600">
                        ${(transaction.amount / 100).toFixed(2)}
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      {format(parseISO(transaction.created_at), 'yyyy/MM/dd')}
                    </div>
                    <div>
                      <a
                        className="w-full px-2 py-1 font-semibold text-center text-white transition-all duration-150 ease-in-out bg-blue-600 rounded-md shadow-lg md:w-auto hover:bg-indigo-600 hover:scale-105"
                        href={getWorkshopInvoiceUrl(
                          transaction.charge_id,
                          transaction.workshop_type,
                        )}
                      >
                        view invoice
                      </a>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </main>
  )
}

export default WorkshopTransactions
