/** @jest-environment jsdom */
import * as React from 'react'
import {fireEvent, render, screen} from '@testing-library/react'
import ForeverEmail from '@/pages/forever/email'
import ActiveSale from '@/components/pricing/lifetime/active-sale'
import {useRouter as usePagesRouter} from 'next/router'
import {useRouter as useAppRouter} from 'next/navigation'
import {useViewer} from '@/context/viewer-context'

jest.mock('next/router', () => ({useRouter: jest.fn()}))
jest.mock('next/navigation', () => ({useRouter: jest.fn()}))
jest.mock('@/context/viewer-context', () => ({useViewer: jest.fn()}))
jest.mock('@/utils/structured-log', () => ({logEvent: jest.fn()}))
jest.mock('@/utils/analytics', () => ({track: jest.fn()}))
jest.mock('@/lib/logging', () => ({
  withSSRLogging: (handler: unknown) => handler,
}))
jest.mock('@/utils/honeycomb-tracer', () => ({
  __esModule: true,
  default: jest.fn(),
}))
jest.mock('@/utils/tracing-js/dist/src/index', () => ({
  setupHttpTracing: jest.fn(),
}))
jest.mock('@/api/stripe/stripe-checkout-redirect', () => ({
  redirectToStandardCheckout: jest.fn(),
}))
jest.mock('@/components/pricing/stepper', () => () => null)
jest.mock('@/components/spinner', () => () => null)
jest.mock('@/components/pricing/powered-by-stripe', () => () => null)
jest.mock('react-markdown', () => ({
  __esModule: true,
  default: ({children}: {children: React.ReactNode}) => <>{children}</>,
}))

const push = jest.fn()
const mockFetch = jest.fn()
const originalFetch = global.fetch
const originalPrice =
  process.env.NEXT_PUBLIC_STRIPE_LIFETIME_MEMBERSHIP_PRICE_ID
beforeEach(() => {
  jest.clearAllMocks()
  global.fetch = mockFetch
  process.env.NEXT_PUBLIC_STRIPE_LIFETIME_MEMBERSHIP_PRICE_ID = 'test-price'
  jest
    .mocked(usePagesRouter)
    .mockReturnValue({push} as unknown as ReturnType<typeof usePagesRouter>)
  jest
    .mocked(useAppRouter)
    .mockReturnValue({push} as unknown as ReturnType<typeof useAppRouter>)
  jest
    .mocked(useViewer)
    .mockReturnValue({viewer: {email: 'recipient@example.com'}} as ReturnType<
      typeof useViewer
    >)
})
afterEach(() => {
  global.fetch = originalFetch
  if (originalPrice === undefined)
    delete process.env.NEXT_PUBLIC_STRIPE_LIFETIME_MEMBERSHIP_PRICE_ID
  else
    process.env.NEXT_PUBLIC_STRIPE_LIFETIME_MEMBERSHIP_PRICE_ID = originalPrice
})

it('the forever form shows sales closed on 410, even with an unreadable response body', async () => {
  const json = jest.fn().mockRejectedValue(new Error('unreadable body'))
  mockFetch.mockResolvedValueOnce({status: 410, ok: false, json})
  render(<ForeverEmail priceId="test-price" coupon={undefined} />)
  fireEvent.change(screen.getByRole('textbox', {name: 'Email address'}), {
    target: {value: 'recipient@example.com'},
  })
  fireEvent.click(screen.getByRole('button', {name: 'Proceed to Payment'}))

  expect(await screen.findByRole('alert')).toHaveTextContent(
    'Lifetime sales are closed',
  )
  expect(
    screen.queryByText('Redirecting to Stripe payments'),
  ).not.toBeInTheDocument()
  expect(push).not.toHaveBeenCalled()
  expect(json).not.toHaveBeenCalled()
})

it('the active sale shows sales closed on 410 without navigating or reading the body', async () => {
  const json = jest.fn().mockRejectedValue(new Error('unreadable body'))
  mockFetch.mockResolvedValueOnce({status: 410, ok: false, json})
  render(<ActiveSale />)
  fireEvent.click(screen.getByRole('button', {name: /Get Lifetime/}))

  expect(await screen.findByRole('alert')).toHaveTextContent(
    'Lifetime sales are closed',
  )
  expect(push).not.toHaveBeenCalled()
  expect(json).not.toHaveBeenCalled()
})

it('the active sale handles a network failure without an unhandled rejection', async () => {
  mockFetch.mockRejectedValueOnce(new Error('network unavailable'))
  render(<ActiveSale />)
  fireEvent.click(screen.getByRole('button', {name: /Get Lifetime/}))
  expect(await screen.findByRole('alert')).toHaveTextContent(
    'Unable to start checkout. Please try again.',
  )
  expect(push).not.toHaveBeenCalled()
})
