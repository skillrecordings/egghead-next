import * as React from 'react'
import {Suspense} from 'react'

import {format, fromUnixTime} from 'date-fns'
import {MailIcon, Receipt} from 'lucide-react'
import Stripe from 'stripe'
import Image from 'next/image'
import {InvoiceCustomText} from '@/components/workshop/shared/invoices/invoice-custom-text'
import {InvoicePrintButton} from '@/components/workshop/shared/invoices/invoice-print-button'
import {Button} from '@/ui'

export const WorkshopInvoice = ({
  charge,
  productName,
}: {
  charge: Stripe.Charge
  productName: string
}) => {
  const customer = charge.billing_details as Stripe.Charge.BillingDetails
  const formatUsd = (amount: number) => {
    return Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }
  const created = fromUnixTime(charge.created)
  const date = format(created, 'MMMM d, y')
  const amount = charge.amount / 100

  const emailData = `mailto:?subject=${encodeURIComponent(
    `Invoice for ${productName}`,
  )}&body=${encodeURIComponent(
    `Invoice for ${productName} purchase: ${process.env.NEXT_PUBLIC_URL}/workshop/invoice/${charge.id}`,
  )}`

  return (
    <div className="container border-x px-5">
      <main className="mx-auto w-full max-w-screen-md">
        <div className="flex flex-col justify-between pb-5 pt-10 print:hidden">
          <h1 className="font-text text-center text-lg font-medium leading-tight sm:text-left sm:text-xl">
            Your Invoice for {productName}
          </h1>
          <div className="flex flex-col items-center gap-2 pt-3 sm:flex-row">
            <Suspense>
              <InvoicePrintButton />
            </Suspense>
            {emailData && (
              <Button asChild variant="secondary">
                <a href={emailData}>
                  <span className="pr-2">Send via email</span>
                  <MailIcon aria-hidden="true" className="w-5" />
                </a>
              </Button>
            )}
            {charge.receipt_url && (
              <Button asChild variant="secondary">
                <a
                  href={charge.receipt_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="pr-2">View Stripe Receipt</span>
                  <Receipt aria-hidden="true" className="w-5" />
                </a>
              </Button>
            )}
          </div>
        </div>
        <div className="rounded-t-md border bg-white pr-12 text-gray-900 print:border-none print:shadow-none">
          <div className="px-10 py-16">
            <div className="flex w-full grid-cols-3 flex-col items-start justify-between gap-8 sm:grid sm:gap-0">
              <div className="col-span-2 flex items-center">
                <span className="font-text pl-2 text-2xl font-bold">
                  <Image
                    src="https://res.cloudinary.com/dg3gyk0gu/image/upload/v1567198446/og-image-assets/eggo.png"
                    alt="egghead.io"
                    width={100}
                    height={100}
                  />
                </span>
              </div>
              <div>
                <h2 className="mb-2 text-xs uppercase text-gray-500">From</h2>
                <span className="font-semibold">{productName}</span>
                <br />
                egghead.io
                <br />
                12333 Sowden Rd
                <br />
                Ste. B, PMB #97429
                <br />
                Houston, TX 77080-2059
                <br />
                972-992-5951
              </div>
            </div>
            <div className="grid grid-cols-3 gap-5 pb-52">
              <div className="col-span-2">
                <p className="mb-2 text-2xl font-bold">Invoice</p>
                Invoice ID: <strong>{charge.id}</strong>
                <br />
                Created: <strong>{date}</strong>
                <br />
                Status:{' '}
                <strong>
                  {charge.status === 'succeeded'
                    ? charge.refunded
                      ? 'Refunded'
                      : 'Paid'
                    : 'Pending'}
                </strong>
              </div>
              <div className="pt-12">
                <h2 className="mb-2 text-xs uppercase text-gray-500">
                  Invoice For
                </h2>
                <div>
                  {customer.name}
                  <br />
                  {customer.email}
                </div>
                <Suspense>
                  <InvoiceCustomText />
                </Suspense>
              </div>
            </div>
            <h2 className="sr-only">Purchase details</h2>
            <table className="w-full table-auto text-left">
              <thead className="table-header-group">
                <tr className="table-row">
                  <th scope="col">Description</th>
                  <th scope="col">Unit Price</th>
                  <th scope="col">Quantity</th>
                  <th scope="col" className="text-right">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="table-row">
                  <td>{productName}</td>
                  <td>
                    {charge.currency.toUpperCase()} {formatUsd(amount)}
                  </td>
                  <td>1</td>
                  <td className="text-right">
                    {amount === null
                      ? `${charge.currency.toUpperCase()} 0.00`
                      : `${charge.currency.toUpperCase()} ${formatUsd(amount)}`}
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="flex flex-col items-end py-16">
              <div>
                <span className="mr-3">Total</span>
                <strong className="text-lg">
                  {charge.currency.toUpperCase()} {formatUsd(amount)}
                </strong>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
