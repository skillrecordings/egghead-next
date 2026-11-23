/** @jest-environment jsdom */
import * as React from 'react'
import {fireEvent, render, screen, waitFor} from '@testing-library/react'
import Email from '@/pages/pricing/email'
import PricingWidget from '@/components/pricing/pricing-widget'
import {useViewer} from '@/context/viewer-context'
import {redirectToSubscriptionCheckout} from '@/api/stripe/stripe-checkout-redirect'
import toast from 'react-hot-toast'

jest.mock('@/context/viewer-context', () => ({useViewer: jest.fn()}))
jest.mock('@/api/stripe/stripe-checkout-redirect', () => ({
  redirectToSubscriptionCheckout: jest.fn(),
}))
jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {error: jest.fn()},
}))
jest.mock('@/utils/analytics', () => ({track: jest.fn()}))
jest.mock('next/router', () => ({useRouter: () => ({push: jest.fn()})}))
jest.mock('next/navigation', () => ({
  useRouter: () => ({push: jest.fn()}),
  useSearchParams: () => new URLSearchParams(),
}))
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
jest.mock('@/components/pricing/stepper', () => () => null)
jest.mock('@/components/spinner', () => () => null)
jest.mock('@/components/pricing/powered-by-stripe', () => () => null)
jest.mock('@/components/pricing/parity-coupon-message', () => () => null)
jest.mock('react-markdown', () => ({
  __esModule: true,
  default: ({children}: {children: React.ReactNode}) => <>{children}</>,
}))
jest.mock('@/components/pricing/select-plan-new', () => ({
  __esModule: true,
  default: ({handleClickGetAccess}: {handleClickGetAccess: () => void}) => (
    <button onClick={handleClickGetAccess}>Get access</button>
  ),
}))
jest.mock('@/hooks/use-commerce-machine', () => ({
  useCommerceMachine: () => ({
    state: {matches: () => true, context: {}},
    send: ({onClickCheckout}: {onClickCheckout: () => void}) =>
      onClickCheckout(),
    priceId: 'test-price',
    quantity: 1,
    availableCoupons: {},
  }),
}))

const checkout = jest.mocked(redirectToSubscriptionCheckout)

beforeEach(() => {
  jest.clearAllMocks()
  checkout.mockResolvedValue(undefined)
})

it('sends a typed email directly to checkout without an account-status nudge', async () => {
  render(<Email priceId="test-price" coupon={undefined} />)
  fireEvent.change(screen.getByRole('textbox', {name: 'Email address'}), {
    target: {value: 'known-pro@example.com'},
  })
  fireEvent.click(screen.getByRole('button', {name: 'Proceed to Payment'}))
  await waitFor(() =>
    expect(checkout).toHaveBeenCalledWith({
      priceId: 'test-price',
      email: 'known-pro@example.com',
      quantity: 1,
      coupon: undefined,
    }),
  )
  expect(screen.queryByText(/already got a pro account/)).toBeNull()
})

it.each([
  {is_pro: true, is_instructor: false},
  {is_pro: false, is_instructor: true},
])(
  'uses the signed-in viewer state for the existing-access nudge %j',
  async (flags) => {
    // SAFETY: this fixture supplies the viewer fields used by PricingWidget.
    jest.mocked(useViewer).mockReturnValue({
      viewer: {email: 'viewer@example.com', ...flags},
      authToken: 'viewer-token',
    } as ReturnType<typeof useViewer>)
    render(<PricingWidget />)
    fireEvent.click(screen.getByRole('button', {name: 'Get access'}))
    expect(toast.error).toHaveBeenCalledWith(
      expect.stringContaining('You already have pro access'),
      expect.any(Object),
    )
    expect(checkout).not.toHaveBeenCalled()
  },
)

it('lets a signed-in free viewer proceed to checkout with their token', () => {
  // SAFETY: this fixture supplies the viewer fields used by PricingWidget.
  jest.mocked(useViewer).mockReturnValue({
    viewer: {email: 'viewer@example.com', is_pro: false, is_instructor: false},
    authToken: 'viewer-token',
  } as ReturnType<typeof useViewer>)
  render(<PricingWidget />)
  fireEvent.click(screen.getByRole('button', {name: 'Get access'}))
  expect(checkout).toHaveBeenCalledWith({
    priceId: 'test-price',
    email: 'viewer@example.com',
    authToken: 'viewer-token',
    quantity: 1,
    coupon: undefined,
  })
  expect(toast.error).not.toHaveBeenCalled()
})
