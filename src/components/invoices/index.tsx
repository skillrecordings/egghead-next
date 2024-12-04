'use client'

import * as React from 'react'
import {format, parseISO} from 'date-fns'
import {trpc} from '@/app/_trpc/client'

type HeadingProps = React.ComponentPropsWithoutRef<any> & {
  headingAs?: 'h1' | 'h2' | 'h3' | 'h4' | 'p'
}

const Invoices: React.FunctionComponent<
  React.PropsWithChildren<HeadingProps>
> = ({headingAs}) => {
  const {data: transactions, status} =
    trpc.user.transactionsForCurrent.useQuery()

  const Heading = headingAs ?? 'p'

  return (
    <main className="mt-16">
      {status === 'loading' ? (
        <div></div>
      ) : (
        <div>
          {!transactions ? null : (
            <div className="flex flex-col space-y-8">
              <Heading className="text-lg font-medium md:font-normal md:text-xl leading-none">
                Transactions
              </Heading>
              <div>
                <ul className="space-y-6">
                  {transactions.map((transaction: any) => {
                    return (
                      <li key={transaction.stripe_transaction_id}>
                        <div className="flex space-x-4">
                          <div>
                            egghead membership: ${transaction.amount / 100}
                          </div>
                          <div>
                            {format(
                              parseISO(transaction.created_at),
                              'yyyy/MM/dd',
                            )}
                          </div>
                          <div>
                            <a
                              className="w-full px-2 py-1 font-semibold text-center text-white transition-all duration-150 ease-in-out bg-blue-600 rounded-md shadow-lg md:w-auto hover:bg-indigo-600 hover:scale-105"
                              href={`/invoices/${transaction.stripe_transaction_id}`}
                            >
                              full invoice
                            </a>
                          </div>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  )
}

export default Invoices
