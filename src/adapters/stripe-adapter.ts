import Stripe from 'stripe'

interface PaymentsAdapter {
  createCoupon(params: Stripe.CouponCreateParams): Promise<string>
  createCheckoutSession(
    params: Stripe.Checkout.SessionCreateParams,
  ): Promise<string | null>
  getSubscription(subscriptionId: string): Promise<
    Stripe.Subscription & {
      latest_invoice: Stripe.Invoice & {charge: Stripe.Charge}
    }
  >
  getInvoice(invoiceId: string): Promise<Stripe.Invoice>
}

const STRIPE_VERSION = '2020-08-27'

class StripePaymentAdapter implements PaymentsAdapter {
  stripe: Stripe

  constructor({stripe}: {stripe: Stripe}) {
    if (!stripe) {
      throw new Error('Stripe not found')
    }
    this.stripe = stripe
  }

  async createCoupon(params: Stripe.CouponCreateParams) {
    const coupon = await this.stripe.coupons.create(params)
    return coupon.id
  }
  async createCheckoutSession(params: Stripe.Checkout.SessionCreateParams) {
    const session = await this.stripe.checkout.sessions.create(params)
    return session.url
  }
  async getSubscription(subscriptionId: string) {
    return (await this.stripe.subscriptions.retrieve(subscriptionId, {
      expand: ['latest_invoice.charge'],
    })) as Stripe.Subscription & {
      latest_invoice: Stripe.Invoice & {charge: Stripe.Charge}
    }
  }
  async getInvoice(invoiceId: string) {
    return await this.stripe.invoices.retrieve(invoiceId)
  }
}

export const stripeAdapter = new StripePaymentAdapter({
  stripe: new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: STRIPE_VERSION,
  }),
})
