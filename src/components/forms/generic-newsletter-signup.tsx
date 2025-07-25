import * as React from 'react'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {z} from 'zod'
import {trpc} from '@/app/_trpc/client'
import {track} from '@/utils/analytics'
import {useViewer} from '@/context/viewer-context'

const newsletterSignupSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  name: z.string().optional(),
})

type NewsletterSignupFormData = z.infer<typeof newsletterSignupSchema>

export interface NewsletterConfig {
  // Display text
  submitButtonText?: string
  successMessage?: string
  emailPlaceholder?: string
  namePlaceholder?: string

  // Tracking & identification
  newsletterKey: string // e.g., 'ai_dev_essentials_newsletter', 'claude_code_workshop'
  trackingSource: string // e.g., 'ai_dev_essentials_landing_page', 'claude_code_workshop_page'

  // Analytics functions (optional)
  trackSignup?: (status: 'attempt' | 'success', data: any) => void

  // Style customization
  showNameField?: boolean
  className?: string
  source?: 'hero' | 'footer' | 'inline'

  // Callbacks
  onSuccess?: (email: string) => void
  onError?: (error: string) => void
}

export default function GenericNewsletterSignupForm({
  submitButtonText = 'Subscribe',
  successMessage = 'Thank you for subscribing! Check your email for confirmation.',
  emailPlaceholder = 'Enter your email',
  namePlaceholder = 'Your name (optional)',
  newsletterKey,
  trackingSource,
  trackSignup,
  showNameField = true,
  className = '',
  source = 'inline',
  onSuccess,
  onError,
}: NewsletterConfig) {
  const [isSubmitted, setIsSubmitted] = React.useState(false)
  const [submitMessage, setSubmitMessage] = React.useState('')
  const [submitError, setSubmitError] = React.useState('')

  const {viewer} = useViewer()
  const customerIOIdentify = trpc.customerIO.identify.useMutation()

  const {
    register,
    handleSubmit,
    reset,
    formState: {errors, isSubmitting},
  } = useForm<NewsletterSignupFormData>({
    resolver: zodResolver(newsletterSignupSchema),
  })

  const onSubmit = async (data: NewsletterSignupFormData) => {
    try {
      console.log(
        `INFO: Newsletter subscription attempt for email: ${data.email}`,
      )
      setSubmitError('')
      setSubmitMessage('')

      const {email, name} = data

      // Track signup attempt
      if (trackSignup) {
        trackSignup('attempt', {
          email,
          name,
          source,
        })
      }

      // Identify user with Customer.io via Inngest
      const currentDateTime = Math.floor(Date.now() * 0.001) // Customer.io uses seconds

      const selectedInterests = {
        [newsletterKey]: currentDateTime,
        newsletter_signup_source: currentDateTime,
      }

      try {
        await customerIOIdentify.mutateAsync({
          email,
          selectedInterests,
        })
      } catch (trpcError) {
        console.error(
          'TRPC call failed, falling back to direct API:',
          trpcError,
        )

        // Fallback to direct API call
        const response = await fetch('/api/newsletter/subscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            name,
            source: trackingSource,
          }),
        })

        if (!response.ok) {
          throw new Error('Newsletter subscription failed')
        }
      }

      // Track analytics event
      track('newsletter signup', {
        email,
        source: trackingSource,
        newsletter: newsletterKey,
        timestamp: currentDateTime,
      })

      // Track signup success
      if (trackSignup) {
        trackSignup('success', {
          email,
          name,
          source,
        })
      }

      setIsSubmitted(true)
      setSubmitMessage(successMessage)
      reset()

      console.log(
        `INFO: Newsletter subscription successful for email: ${email}`,
      )

      if (onSuccess) {
        onSuccess(email)
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Something went wrong. Please try again.'

      console.error('ERROR: Newsletter subscription failed:', error)
      setSubmitError(errorMessage)

      if (onError) {
        onError(errorMessage)
      }
    }
  }

  if (isSubmitted && submitMessage) {
    return (
      <div className={`w-full max-w-md mx-auto ${className}`}>
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 text-green-600 dark:text-green-400 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <p className="text-green-800 dark:text-green-200 text-sm">
              {submitMessage}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`w-full max-w-md mx-auto ${className}`}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="email" className="sr-only">
            Email address
          </label>
          <input
            {...register('email')}
            type="email"
            id="email"
            placeholder={emailPlaceholder}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.email.message}
            </p>
          )}
        </div>

        {showNameField && (
          <div>
            <label htmlFor="name" className="sr-only">
              Name (optional)
            </label>
            <input
              {...register('name')}
              type="text"
              id="name"
              placeholder={namePlaceholder}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.name.message}
              </p>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center"
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Subscribing...
            </>
          ) : (
            submitButtonText
          )}
        </button>

        {submitError && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-800 dark:text-red-200 text-sm">
              {submitError}
            </p>
          </div>
        )}
      </form>
    </div>
  )
}
