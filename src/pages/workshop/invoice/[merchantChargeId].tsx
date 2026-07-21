import * as React from 'react'

import Stripe from 'stripe'
import {WorkshopInvoice} from '@/components/workshop/shared/invoices/workshop-invoice'
import {withSSRLogging} from '@/lib/logging'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2020-08-27',
})

/**
 * Resolves the purchased product name from the charge's checkout session so
 * this route works for any workshop sold via a Stripe Payment Link.
 */
const getProductNameForCharge = async (
  charge: Stripe.Charge,
): Promise<string> => {
  try {
    const paymentIntentId =
      typeof charge.payment_intent === 'string'
        ? charge.payment_intent
        : charge.payment_intent?.id

    if (paymentIntentId) {
      const sessions = await stripe.checkout.sessions.list({
        payment_intent: paymentIntentId,
        limit: 1,
        expand: ['data.line_items'],
      })
      const lineItemDescription =
        sessions.data[0]?.line_items?.data[0]?.description
      if (lineItemDescription) {
        return lineItemDescription
      }
    }
  } catch (error) {
    console.error(
      `Error resolving product name for charge ${charge.id}: ${error}`,
    )
  }

  return charge.description || 'egghead Workshop'
}

export const getServerSideProps = withSSRLogging(async (context) => {
  const {merchantChargeId} = context.params as {merchantChargeId: string}
  const charge = await stripe.charges.retrieve(merchantChargeId, {
    expand: ['customer', 'balance_transaction'],
  })
  const productName = await getProductNameForCharge(charge)

  return {
    props: {
      charge,
      productName,
    },
  }
})

const Invoice = ({
  charge,
  productName,
}: {
  charge: Stripe.Charge
  productName: string
}) => {
  return <WorkshopInvoice charge={charge} productName={productName} />
}

export default Invoice
