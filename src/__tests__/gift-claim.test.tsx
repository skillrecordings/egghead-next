/** @jest-environment jsdom */

import * as React from 'react'
import {act, fireEvent, render, screen, waitFor} from '@testing-library/react'
import type {AxiosError} from 'axios'
import GiftClaim from '@/pages/gifts/claim/[guid]'
import axios from '@/utils/configured-axios'
import {useRouter} from 'next/router'
import {useViewer} from '@/context/viewer-context'
import {logEvent} from '@/utils/structured-log'

jest.mock('@/lib/logging', () => ({
  withSSRLogging: (handler: unknown) => handler,
}))
jest.mock('@/utils/auth', () => ({getTokenFromCookieHeaders: jest.fn()}))
jest.mock('@/lib/gifts', () => ({getGift: jest.fn()}))
jest.mock('@/utils/configured-axios', () => ({
  __esModule: true,
  default: {post: jest.fn(), isAxiosError: jest.fn()},
}))
jest.mock('next/router', () => ({useRouter: jest.fn()}))
jest.mock('@/context/viewer-context', () => ({useViewer: jest.fn()}))
jest.mock('@/utils/structured-log', () => ({logEvent: jest.fn()}))
jest.mock('next/legacy/image', () => () => null)
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({
    children,
    onClick,
  }: {
    children: React.ReactNode
    onClick?: React.MouseEventHandler
  }) => <a onClick={onClick}>{children}</a>,
}))

const post = jest.mocked(axios.post)
const push = jest.fn()
const refreshUser = jest.fn()
const gift = {
  claim_url: '/gifts/test-gift/claim',
  claimed: false,
  duration_months: 12,
}
const claimError =
  "This gift has expired or can't be claimed. Email support@egghead.io and we'll sort it out."

beforeEach(() => {
  jest.clearAllMocks()
  jest
    .mocked(useRouter)
    .mockReturnValue({push} as unknown as ReturnType<typeof useRouter>)
  jest.mocked(useViewer).mockReturnValue({
    viewer: {email: 'recipient@example.com', is_pro: false},
    refreshUser,
  } as unknown as ReturnType<typeof useViewer>)
  jest
    .mocked(axios.isAxiosError)
    .mockImplementation(
      (error: unknown): error is AxiosError =>
        typeof error === 'object' && error !== null && 'isAxiosError' in error,
    )
  refreshUser.mockResolvedValue(undefined)
  push.mockResolvedValue(true)
})

it('waits for the claim and viewer refresh before navigating to learn', async () => {
  let finishClaim: () => void = () => {
    throw new Error('claim not started')
  }
  let finishRefresh: () => void = () => {
    throw new Error('refresh not started')
  }
  post.mockImplementationOnce(
    () =>
      new Promise((resolve) => {
        finishClaim = () => resolve({data: {}})
      }),
  )
  refreshUser.mockImplementationOnce(
    () =>
      new Promise<void>((resolve) => {
        finishRefresh = resolve
      }),
  )
  render(<GiftClaim gift={gift} />)
  fireEvent.click(screen.getByText(/^Claim Your Membership/))

  expect(post).toHaveBeenCalledTimes(1)
  expect(post).toHaveBeenCalledWith(gift.claim_url)
  expect(screen.getByRole('button')).toBeDisabled()
  fireEvent.click(screen.getByRole('button'))
  expect(post).toHaveBeenCalledTimes(1)
  expect(refreshUser).not.toHaveBeenCalled()
  expect(push).not.toHaveBeenCalled()

  await act(async () => finishClaim())
  expect(refreshUser).toHaveBeenCalledTimes(1)
  expect(push).not.toHaveBeenCalled()

  await act(async () => finishRefresh())
  await waitFor(() =>
    expect(push).toHaveBeenCalledWith({
      pathname: '/learn/',
      query: {
        message: 'You have claimed the membership coupon.',
        type: 'claimed',
      },
    }),
  )
  expect(screen.queryByRole('alert')).not.toBeInTheDocument()
})

it.each([403, 404, 410, 500])(
  'stays on the page and shows the claim error for HTTP %s',
  async (status) => {
    post.mockRejectedValueOnce({isAxiosError: true, response: {status}})
    render(<GiftClaim gift={gift} />)
    fireEvent.click(screen.getByText(/^Claim Your Membership/))

    expect(await screen.findByRole('alert')).toHaveTextContent(claimError)
    expect(push).not.toHaveBeenCalled()
    expect(refreshUser).not.toHaveBeenCalled()
    expect(screen.getByRole('button')).toBeEnabled()
    expect(logEvent).toHaveBeenCalledWith('warn', 'gift.claim.failed', {status})
  },
)

it('shows the rate-limit message for HTTP 429 without navigating', async () => {
  post.mockRejectedValueOnce({isAxiosError: true, response: {status: 429}})
  render(<GiftClaim gift={gift} />)
  fireEvent.click(screen.getByText(/^Claim Your Membership/))

  expect(await screen.findByRole('alert')).toHaveTextContent(
    'Too many tries. Wait a minute and try again.',
  )
  expect(push).not.toHaveBeenCalled()
  expect(refreshUser).not.toHaveBeenCalled()
})

it.each([
  ['viewer refresh', () => refreshUser.mockRejectedValueOnce(new Error('x'))],
  ['navigation', () => push.mockRejectedValueOnce(new Error('x'))],
])(
  'reports the gift as claimed and blocks a second claim if %s fails after the POST',
  async (_step, fail) => {
    fail()
    post.mockResolvedValueOnce({data: {}})
    render(<GiftClaim gift={gift} />)
    fireEvent.click(screen.getByText(/^Claim Your Membership/))

    expect(await screen.findByRole('status')).toHaveTextContent(
      'Your gift is claimed. Refresh the page to start watching.',
    )
    expect(screen.getByText('Refresh the page')).toHaveAttribute(
      'href',
      '/learn/',
    )
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(screen.getByRole('button')).toBeDisabled()
    fireEvent.click(screen.getByRole('button'))
    expect(post).toHaveBeenCalledTimes(1)
    expect(logEvent).not.toHaveBeenCalledWith(
      'warn',
      'gift.claim.failed',
      expect.anything(),
    )
  },
)

it('shows the first error message from the Rails response', async () => {
  post.mockRejectedValueOnce({
    isAxiosError: true,
    response: {
      status: 400,
      data: {errors: ['You already have an active membership.', 'Other']},
    },
  })
  render(<GiftClaim gift={gift} />)
  fireEvent.click(screen.getByText(/^Claim Your Membership/))

  expect(await screen.findByRole('alert')).toHaveTextContent(
    /^You already have an active membership\.$/,
  )
  expect(screen.getByRole('button')).toBeEnabled()
})

it('renders the Rails error message as plain text', async () => {
  const html = '<img src=x onerror="alert(1)"><b>bold</b>'
  post.mockRejectedValueOnce({
    isAxiosError: true,
    response: {status: 400, data: {errors: [html]}},
  })
  render(<GiftClaim gift={gift} />)
  fireEvent.click(screen.getByText(/^Claim Your Membership/))

  const alert = await screen.findByRole('alert')
  expect(alert).toHaveTextContent(html)
  expect(alert.querySelector('img, b')).toBeNull()
})

it.each([
  ['an empty errors array', {errors: []}],
  ['no errors key', {}],
  ['non-string errors', {errors: [{message: 'nope'}, '  ']}],
])('falls back to the generic claim error for %s', async (_label, data) => {
  post.mockRejectedValueOnce({
    isAxiosError: true,
    response: {status: 400, data},
  })
  render(<GiftClaim gift={gift} />)
  fireEvent.click(screen.getByText(/^Claim Your Membership/))

  expect(await screen.findByRole('alert')).toHaveTextContent(claimError)
})

it('keeps the rate-limit message for HTTP 429 even with Rails errors', async () => {
  post.mockRejectedValueOnce({
    isAxiosError: true,
    response: {status: 429, data: {errors: ['Something else']}},
  })
  render(<GiftClaim gift={gift} />)
  fireEvent.click(screen.getByText(/^Claim Your Membership/))

  expect(await screen.findByRole('alert')).toHaveTextContent(
    'Too many tries. Wait a minute and try again.',
  )
})

it('does not promise pro members that the gift stacks on their membership', () => {
  jest.mocked(useViewer).mockReturnValue({
    viewer: {email: 'pro@example.com', is_pro: true},
    refreshUser,
  } as unknown as ReturnType<typeof useViewer>)
  render(<GiftClaim gift={gift} />)

  expect(screen.queryByText(/on top of your existing membership/)).toBeNull()
  expect(
    screen.getByText(/can't be applied to an account that already has an/),
  ).toBeInTheDocument()
})

it('handles a network failure and allows retrying the claim', async () => {
  post
    .mockRejectedValueOnce(new Error('network unavailable'))
    .mockResolvedValueOnce({data: {}})
  render(<GiftClaim gift={gift} />)
  const button = screen.getByText(/^Claim Your Membership/)
  fireEvent.click(button)

  expect(await screen.findByRole('alert')).toHaveTextContent(claimError)
  expect(push).not.toHaveBeenCalled()
  fireEvent.click(button)

  await waitFor(() => expect(push).toHaveBeenCalledTimes(1))
  expect(post).toHaveBeenCalledTimes(2)
  expect(screen.queryByRole('alert')).not.toBeInTheDocument()
})
