import * as React from 'react'
import Eggo from '../../images/eggo.svg'
import Image from 'next/image'
import {useLocalStorage} from 'react-use'
import {format} from 'date-fns'

type InvoiceProps = {
  viewer: any
  transaction: any
}

const Invoice: React.FunctionComponent<InvoiceProps> = ({
  viewer,
  transaction,
}) => {
  const [invoiceInfo, setInvoiceInfo] = useLocalStorage('invoice-info', '')
  return (
    <div className="max-w-screen-md mx-auto pb-16">
      <div className="flex sm:flex-row flex-col items-center justify-between py-5 print:hidden">
        <h2 className="text-lg font-medium leading-tight sm:mb-0 mb-4">
          Your Invoice for egghead.io Pro Membership
        </h2>
        <button
          onClick={() => {
            window.print()
          }}
          className="flex items-center leading-6 px-5 py-3 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors ease-in-out duration-200"
        >
          Download PDF or Print
        </button>
      </div>
      <div className="border border-gray-200 print:border-none rounded-sm">
        <div className="px-10 py-16 print:text-black">
          <div className="grid grid-cols-3 w-full justify-between items-start">
            <div className="col-span-2 flex items-center">
              <div className="w-10 mr-2">
                <Image src={Eggo} alt="" />
              </div>
              <span className="sm:inline-block hidden text-lg font-semibold">
                egghead.io
              </span>
            </div>
            <div>
              <h5 className="uppercase text-xs mb-2 text-gray-500">From</h5>
              egghead.io LLC
              <br />
              337 Garden Oaks Blvd #97429
              <br />
              Houston, TX 77018
              <br />
              972-992-5951
            </div>
          </div>
          <div className="grid grid-cols-3 pb-48 mt-6">
            <div className="col-span-2">
              <h5 className="text-2xl font-bold mb-2">Invoice</h5>
              Invoice ID: <strong>{transaction.transaction.source.id}</strong>
              <br />
              Created:{' '}
              <strong>
                {format(
                  new Date(transaction.transaction.created * 1000),
                  'yyyy/MM/dd',
                )}
              </strong>
            </div>
            <div className="pt-13">
              <h5 className="uppercase text-xs mb-2 text-gray-500">
                Invoice For
              </h5>
              <div className="space-y-2">
                <div>{viewer.full_name}</div>
                <div>{viewer.email}</div>
              </div>
              <br className="print:hidden" />
              <textarea
                className={`form-textarea dark:text-black text-black placeholder-gray-700 border border-gray-200 bg-gray-50 w-full h-full print:p-0 print:border-none resize-none print:bg-transparent ${
                  invoiceInfo ? '' : 'print:hidden'
                }`}
                value={invoiceInfo}
                onChange={(e) => setInvoiceInfo(e.target.value)}
                placeholder="Enter company info here (optional)"
              />
            </div>
          </div>
          <table className="table-auto w-full text-left">
            <thead className="table-header-group">
              <tr className="table-row">
                <th>Description</th>
                <th>Unit Price</th>
                <th>Quantity</th>
                <th className="text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transaction.lineItems.map((lineItem: any) => {
                return (
                  <tr className="table-row" key={lineItem.id}>
                    <td>{lineItem.description}</td>
                    <td>
                      USD{' '}
                      {(
                        (lineItem.price?.unit_amount || lineItem.plan?.amount) /
                        100.0
                      ).toFixed(2)}
                    </td>
                    <td>{lineItem.quantity || 1}</td>
                    <td className="text-right">
                      {lineItem.amount === null
                        ? `USD 0.00`
                        : `USD ${(lineItem.amount / 100.0).toFixed(2)}`}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <div className="flex flex-col items-end mt-16">
            <div>
              <span className="mr-3">Total</span>
              <strong>
                USD {(transaction.transaction.amount / 100.0).toFixed(2)}
              </strong>
            </div>
            <div className="font-bold">
              <span className="mr-3 text-lg">Amount Due</span>
              <strong>
                USD {(transaction.transaction.amount / 100.0).toFixed(2)}
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Invoice
