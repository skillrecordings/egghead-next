import * as React from 'react'

import Stripe from 'stripe'
import {WorkshopInvoice} from '@/components/workshop/shared/invoices/workshop-invoice'
import {withSSRLogging} from '@/lib/logging'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2020-08-27',
})

export const getServerSideProps = withSSRLogging(async (context) => {
  const {merchantChargeId} = context.params as {merchantChargeId: string}
  const charge = await stripe.charges.retrieve(merchantChargeId, {
    expand: ['customer', 'balance_transaction'],
  })

  return {
    props: {
      charge,
    },
  }
})

const Invoice = ({charge}: {charge: Stripe.Charge}) => {
  return (
    <WorkshopInvoice
      charge={charge}
      productName="Live Claude Code Workshop by John Lindquist"
    />
  )
}

export default Invoice
