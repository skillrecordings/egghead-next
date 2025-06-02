import React from 'react'
import {render, screen, fireEvent, waitFor} from '@testing-library/react'
import '@testing-library/jest-dom'
import NewsletterSignupForm from '../newsletter-signup'
import {track} from '@/utils/analytics'
import useCio from '@/hooks/use-cio'
import {useViewer} from '@/context/viewer-context'
import {requestSignInEmail} from '@/utils/request-signin-email'

// Mock dependencies
jest.mock('@/utils/analytics')
jest.mock('@/hooks/use-cio')
jest.mock('@/context/viewer-context')
jest.mock('@/utils/request-signin-email')
jest.mock('@/app/_trpc/client', () => ({
  trpc: {},
}))

const mockTrack = track as jest.MockedFunction<typeof track>
const mockUseCio = useCio as jest.MockedFunction<typeof useCio>
const mockUseViewer = useViewer as jest.MockedFunction<typeof useViewer>
const mockRequestSignInEmail = requestSignInEmail as jest.MockedFunction<
  typeof requestSignInEmail
>

// Mock console methods
const consoleSpy = jest.spyOn(console, 'log').mockImplementation()
const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()

describe('NewsletterSignupForm', () => {
  const mockCioIdentify = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()

    mockUseCio.mockReturnValue({
      subscriber: null,
      cioIdentify: mockCioIdentify,
    })

    mockUseViewer.mockReturnValue({
      viewer: null,
    })

    mockRequestSignInEmail.mockResolvedValue({
      contact_id: 'test-contact-id',
    })

    mockCioIdentify.mockResolvedValue(undefined)
  })

  afterAll(() => {
    consoleSpy.mockRestore()
    consoleErrorSpy.mockRestore()
  })

  it('renders form with email and name inputs', () => {
    render(<NewsletterSignupForm />)

    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument()
    expect(
      screen.getByPlaceholderText('Your name (optional)'),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', {name: /subscribe to ai dev essentials/i}),
    ).toBeInTheDocument()
  })

  it('validates email format correctly', async () => {
    render(<NewsletterSignupForm />)

    const emailInput = screen.getByPlaceholderText('Enter your email')
    const submitButton = screen.getByRole('button', {
      name: /subscribe to ai dev essentials/i,
    })

    // Test invalid email
    fireEvent.change(emailInput, {target: {value: 'invalid-email'}})
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(
        screen.getByText('Please enter a valid email address'),
      ).toBeInTheDocument()
    })

    // Test empty email
    fireEvent.change(emailInput, {target: {value: ''}})
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument()
    })
  })

  it('handles successful form submission', async () => {
    const onSuccess = jest.fn()
    render(<NewsletterSignupForm onSuccess={onSuccess} />)

    const emailInput = screen.getByPlaceholderText('Enter your email')
    const nameInput = screen.getByPlaceholderText('Your name (optional)')
    const submitButton = screen.getByRole('button', {
      name: /subscribe to ai dev essentials/i,
    })

    fireEvent.change(emailInput, {target: {value: 'test@example.com'}})
    fireEvent.change(nameInput, {target: {value: 'John Doe'}})
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(
        screen.getByText(
          'Thank you for subscribing! Check your email for confirmation.',
        ),
      ).toBeInTheDocument()
    })

    expect(mockRequestSignInEmail).toHaveBeenCalledWith('test@example.com')
    expect(mockCioIdentify).toHaveBeenCalledWith(
      'test-contact-id',
      expect.objectContaining({
        email: 'test@example.com',
        first_name: 'John Doe',
        ai_dev_essentials_newsletter: expect.any(Number),
        newsletter_signup_source: 'ai_dev_essentials_landing_page',
      }),
    )
    expect(mockTrack).toHaveBeenCalledWith(
      'newsletter signup',
      expect.objectContaining({
        email: 'test@example.com',
        source: 'ai_dev_essentials_landing_page',
      }),
    )
    expect(onSuccess).toHaveBeenCalledWith('test@example.com')
  })

  it('handles form submission without name', async () => {
    render(<NewsletterSignupForm />)

    const emailInput = screen.getByPlaceholderText('Enter your email')
    const submitButton = screen.getByRole('button', {
      name: /subscribe to ai dev essentials/i,
    })

    fireEvent.change(emailInput, {target: {value: 'test@example.com'}})
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(
        screen.getByText(
          'Thank you for subscribing! Check your email for confirmation.',
        ),
      ).toBeInTheDocument()
    })

    expect(mockCioIdentify).toHaveBeenCalledWith(
      'test-contact-id',
      expect.objectContaining({
        email: 'test@example.com',
        ai_dev_essentials_newsletter: expect.any(Number),
        newsletter_signup_source: 'ai_dev_essentials_landing_page',
      }),
    )

    // Should not include first_name when name is not provided
    const cioCall = mockCioIdentify.mock.calls[0][1]
    expect(cioCall).not.toHaveProperty('first_name')
  })

  it('displays loading state during submission', async () => {
    // Make the cioIdentify function take some time to resolve
    mockCioIdentify.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100)),
    )

    render(<NewsletterSignupForm />)

    const emailInput = screen.getByPlaceholderText('Enter your email')
    const submitButton = screen.getByRole('button', {
      name: /subscribe to ai dev essentials/i,
    })

    fireEvent.change(emailInput, {target: {value: 'test@example.com'}})
    fireEvent.click(submitButton)

    // Check for loading state
    expect(screen.getByText('Subscribing...')).toBeInTheDocument()
    expect(submitButton).toBeDisabled()

    await waitFor(() => {
      expect(
        screen.getByText(
          'Thank you for subscribing! Check your email for confirmation.',
        ),
      ).toBeInTheDocument()
    })
  })

  it('handles submission errors correctly', async () => {
    const onError = jest.fn()
    const errorMessage = 'Network error'
    mockCioIdentify.mockRejectedValue(new Error(errorMessage))

    render(<NewsletterSignupForm onError={onError} />)

    const emailInput = screen.getByPlaceholderText('Enter your email')
    const submitButton = screen.getByRole('button', {
      name: /subscribe to ai dev essentials/i,
    })

    fireEvent.change(emailInput, {target: {value: 'test@example.com'}})
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument()
    })

    expect(onError).toHaveBeenCalledWith(errorMessage)
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'ERROR: Newsletter subscription failed:',
      expect.any(Error),
    )
  })

  it('prevents duplicate submissions', async () => {
    render(<NewsletterSignupForm />)

    const emailInput = screen.getByPlaceholderText('Enter your email')
    const submitButton = screen.getByRole('button', {
      name: /subscribe to ai dev essentials/i,
    })

    fireEvent.change(emailInput, {target: {value: 'test@example.com'}})
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(
        screen.getByText(
          'Thank you for subscribing! Check your email for confirmation.',
        ),
      ).toBeInTheDocument()
    })

    // Form should be replaced with success message, no longer showing input fields
    expect(
      screen.queryByPlaceholderText('Enter your email'),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', {name: /subscribe to ai dev essentials/i}),
    ).not.toBeInTheDocument()
  })

  it('uses existing subscriber ID when available', async () => {
    mockUseCio.mockReturnValue({
      subscriber: {id: 'existing-subscriber-id', email: 'existing@example.com'},
      cioIdentify: mockCioIdentify,
    })

    render(<NewsletterSignupForm />)

    const emailInput = screen.getByPlaceholderText('Enter your email')
    const submitButton = screen.getByRole('button', {
      name: /subscribe to ai dev essentials/i,
    })

    fireEvent.change(emailInput, {target: {value: 'test@example.com'}})
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(
        screen.getByText(
          'Thank you for subscribing! Check your email for confirmation.',
        ),
      ).toBeInTheDocument()
    })

    expect(mockRequestSignInEmail).not.toHaveBeenCalled()
    expect(mockCioIdentify).toHaveBeenCalledWith(
      'existing-subscriber-id',
      expect.objectContaining({
        email: 'existing@example.com',
      }),
    )
  })

  it('uses viewer contact ID when available', async () => {
    mockUseViewer.mockReturnValue({
      viewer: {contact_id: 'viewer-contact-id', email: 'viewer@example.com'},
    })

    render(<NewsletterSignupForm />)

    const emailInput = screen.getByPlaceholderText('Enter your email')
    const submitButton = screen.getByRole('button', {
      name: /subscribe to ai dev essentials/i,
    })

    fireEvent.change(emailInput, {target: {value: 'test@example.com'}})
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(
        screen.getByText(
          'Thank you for subscribing! Check your email for confirmation.',
        ),
      ).toBeInTheDocument()
    })

    expect(mockRequestSignInEmail).not.toHaveBeenCalled()
    expect(mockCioIdentify).toHaveBeenCalledWith(
      'viewer-contact-id',
      expect.objectContaining({
        email: 'viewer@example.com',
      }),
    )
  })

  it('logs subscription attempts and results', async () => {
    render(<NewsletterSignupForm />)

    const emailInput = screen.getByPlaceholderText('Enter your email')
    const submitButton = screen.getByRole('button', {
      name: /subscribe to ai dev essentials/i,
    })

    fireEvent.change(emailInput, {target: {value: 'test@example.com'}})
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(
        screen.getByText(
          'Thank you for subscribing! Check your email for confirmation.',
        ),
      ).toBeInTheDocument()
    })

    expect(consoleSpy).toHaveBeenCalledWith(
      'INFO: Newsletter subscription attempt for email: test@example.com',
    )
    expect(consoleSpy).toHaveBeenCalledWith(
      'INFO: Newsletter subscription successful for email: test@example.com',
    )
  })

  it('applies custom className correctly', () => {
    const customClass = 'custom-form-class'
    render(<NewsletterSignupForm className={customClass} />)

    const formContainer = screen
      .getByPlaceholderText('Enter your email')
      .closest('div')
    expect(formContainer).toHaveClass(customClass)
  })

  it('resets form after successful submission', async () => {
    render(<NewsletterSignupForm />)

    const emailInput = screen.getByPlaceholderText('Enter your email')
    const nameInput = screen.getByPlaceholderText('Your name (optional)')
    const submitButton = screen.getByRole('button', {
      name: /subscribe to ai dev essentials/i,
    })

    fireEvent.change(emailInput, {target: {value: 'test@example.com'}})
    fireEvent.change(nameInput, {target: {value: 'John Doe'}})
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(
        screen.getByText(
          'Thank you for subscribing! Check your email for confirmation.',
        ),
      ).toBeInTheDocument()
    })

    // Form should be replaced with success message, so inputs are no longer in DOM
    expect(
      screen.queryByDisplayValue('test@example.com'),
    ).not.toBeInTheDocument()
    expect(screen.queryByDisplayValue('John Doe')).not.toBeInTheDocument()
  })
})
