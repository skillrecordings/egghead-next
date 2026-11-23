import {NextRequest} from 'next/server'
import {cookies} from 'next/headers'
import {POST} from '@/app/api/stripe/checkout/lifetime/route'
import {getLastChargeForActiveSubscription} from '@/lib/subscriptions'
import {stripeAdapter} from '@/adapters/stripe-adapter'

jest.mock('next/headers', () => ({cookies: jest.fn()}))
jest.mock('@/lib/logging', () => ({
  withAppApiLogging: (handler: unknown) => handler,
}))
jest.mock('@/lib/subscriptions', () => ({
  getLastChargeForActiveSubscription: jest.fn(),
}))
jest.mock('@/adapters/stripe-adapter', () => ({
  stripeAdapter: {createCoupon: jest.fn(), createCheckoutSession: jest.fn()},
}))

beforeEach(() => jest.clearAllMocks())

it.each([
  JSON.stringify({email: 'recipient@example.com'}),
  JSON.stringify({email: "recipient@example.com') OR 1=1 --"}),
  '{}',
  'null',
  'not JSON',
  '',
])(
  'returns 410 for body %p without reading it or calling downstream services',
  async (body) => {
    const request = new NextRequest(
      'https://example.com/api/stripe/checkout/lifetime',
      {method: 'POST', body},
    )
    const readBody = jest.spyOn(request, 'json')
    const response = await POST(request)

    expect(response.status).toBe(410)
    expect(await response.json()).toEqual({error: 'Lifetime sales are closed'})
    expect(readBody).not.toHaveBeenCalled()
    expect(cookies).not.toHaveBeenCalled()
    expect(getLastChargeForActiveSubscription).not.toHaveBeenCalled()
    expect(stripeAdapter.createCoupon).not.toHaveBeenCalled()
    expect(stripeAdapter.createCheckoutSession).not.toHaveBeenCalled()
  },
)
