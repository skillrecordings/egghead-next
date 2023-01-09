import * as React from 'react'
import axios from 'utils/configured-axios'
import {isEmpty} from 'lodash'
import {format, parseISO} from 'date-fns'
import Spinner from 'components/spinner'
import Link from 'next/link'

type HeadingProps = React.ComponentPropsWithoutRef<any> & {
  headingAs?: 'h1' | 'h2' | 'h3' | 'h4' | 'p'
}

const Invoices: React.FunctionComponent<HeadingProps> = ({headingAs}) => {
  const [transactions, setTransactions] = React.useState([])
  const [transactionsLoading, setTransactionsLoading] = React.useState(true)

  const Heading = headingAs ?? 'p'

  React.useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_AUTH_DOMAIN}/api/v1/transactions`)
      .then(({data}) => {
        setTransactionsLoading(false)
        setTransactions(data)
      })
      .catch((error) => console.log({error}))
  }, [])

  return transactionsLoading ? (
    <div className="flex justify-center">
      <Spinner className="w-6 h-6 text-gray-600" />
    </div>
  ) : isEmpty(transactions) ? (
    <Heading className="text-lg font-medium md:font-normal md:text-xl leading-none text-center">
      No Transactions
    </Heading>
  ) : (
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
                  <div>egghead membership: ${transaction.amount / 100}</div>
                  <div>
                    {format(parseISO(transaction.created_at), 'yyyy/MM/dd')}
                  </div>
                  <div>
                    <Link
                      href={`/invoices/${transaction.stripe_transaction_id}`}
                    >
                      <a className="w-full px-2 py-1 font-semibold text-center text-white transition-all duration-150 ease-in-out bg-blue-600 rounded-md shadow-lg md:w-auto hover:bg-indigo-600 hover:scale-105">
                        full invoice
                      </a>
                    </Link>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export default Invoices
