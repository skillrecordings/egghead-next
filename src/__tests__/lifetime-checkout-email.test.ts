import {NextRequest} from 'next/server'
import {POST} from '@/app/api/stripe/checkout/lifetime/route'
import {getLastChargeForActiveSubscription} from '@/lib/subscriptions'
import {stripeAdapter} from '@/adapters/stripe-adapter'

jest.mock('next/headers', () => ({
  cookies: jest.fn(async () => ({get: () => undefined})),
}))
jest.mock('@/lib/logging', () => ({
  withAppApiLogging: (handler: unknown) => handler,
}))
jest.mock('@/utils/structured-log', () => ({logEvent: jest.fn()}))
jest.mock('@/lib/subscriptions', () => ({
  getLastChargeForActiveSubscription: jest.fn(),
}))
jest.mock('@/adapters/stripe-adapter', () => ({
  stripeAdapter: {createCoupon: jest.fn(), createCheckoutSession: jest.fn()},
}))

beforeEach(() => jest.clearAllMocks())

it.each([
  undefined,
  null,
  42,
  {},
  '',
  'not-an-email',
  "recipient@example.com') OR 1=1 --",
])(
  'rejects malformed email %p before lookup or Stripe calls',
  async (email) => {
    const response = await POST(
      new NextRequest('https://example.com/api/stripe/checkout/lifetime', {
        method: 'POST',
        body: JSON.stringify({email}),
      }),
    )
    expect(response.status).toBe(400)
    expect(await response.json()).toEqual({error: 'A valid email is required'})
    expect(getLastChargeForActiveSubscription).not.toHaveBeenCalled()
    expect(stripeAdapter.createCoupon).not.toHaveBeenCalled()
    expect(stripeAdapter.createCheckoutSession).not.toHaveBeenCalled()
  },
)

it('allows a valid email to use the existing checkout path', async () => {
  jest.mocked(getLastChargeForActiveSubscription).mockResolvedValue({
    amountPaid: 0,
    stripeSubscriptionId: null,
    stripeCustomerId: null,
    email: 'recipient@example.com',
    userId: null,
    accountId: null,
  })
  jest
    .mocked(stripeAdapter.createCheckoutSession)
    .mockResolvedValue('https://checkout.stripe.com/test')
  const response = await POST(
    new NextRequest('https://example.com/api/stripe/checkout/lifetime', {
      method: 'POST',
      body: JSON.stringify({email: 'recipient@example.com'}),
    }),
  )
  expect(response.status).toBe(200)
  expect(getLastChargeForActiveSubscription).toHaveBeenCalledWith(
    'recipient@example.com',
    undefined,
  )
  expect(stripeAdapter.createCheckoutSession).toHaveBeenCalledWith(
    expect.objectContaining({customer_email: 'recipient@example.com'}),
  )
})
