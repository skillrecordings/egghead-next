import * as React from 'react'
import Eggo from '../../images/eggo.svg'
import {useLocalStorage} from 'react-use'
import {format, parseISO} from 'date-fns'

type InvoiceProps = {
  viewer: any
}

const Invoice: React.FunctionComponent<InvoiceProps> = ({viewer}) => {
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
        <div className="px-10 py-16">
          <div className="grid grid-cols-3 w-full justify-between items-start">
            <div className="col-span-2 flex items-center">
              <Eggo className="w-10 mr-2" />
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
          <div className="grid grid-cols-3 pb-64">
            <div className="col-span-2">
              <h5 className="text-2xl font-bold mb-2">Invoice</h5>
              Invoice ID: <strong>{viewer.subscription.id}</strong>
              <br />
              Created:{' '}
              <strong>
                {format(parseISO(viewer.subscription.created_at), 'yyyy/MM/dd')}
              </strong>
            </div>
            <div className="pt-13">
              <h5 className="uppercase text-xs mb-2 text-gray-500">
                Invoice For
              </h5>
              <div>
                {viewer.full_name}
                <br />
                {viewer.email}
              </div>
              <br className="print:hidden" />
              <textarea
                className={`form-textarea placeholder-gray-700 border border-gray-200 bg-gray-50 w-full h-full print:p-0 print:border-none print:bg-transparent ${
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
              <tr className="table-row">
                <td>
                  {viewer.subscription.title} (from{' '}
                  {format(parseISO(viewer.subscription.created_at), 'MMM do y')}{' '}
                  to{' '}
                  {format(parseISO(viewer.subscription.end_date), 'MMM do y')})
                </td>
                <td>
                  USD{' '}
                  {viewer.subscription.price /
                    (viewer.subscription.quantity || 1)}
                  .00
                </td>
                <td>{viewer.subscription.quantity || 1}</td>
                <td className="text-right">
                  {viewer.subscription.price === null
                    ? `USD 0.00`
                    : `USD ${viewer.subscription.price}.00`}
                </td>
              </tr>
            </tbody>
          </table>
          <div className="flex flex-col items-end py-16">
            <div>
              <span className="mr-3">Total</span>
              <strong>USD {viewer.subscription.price}.00</strong>
            </div>
            <div className="font-bold">
              <span className="mr-3 text-lg">Amount Due</span>
              <strong>USD {viewer.subscription.price}.00</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Invoice
