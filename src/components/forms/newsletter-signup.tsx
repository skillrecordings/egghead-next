import * as React from 'react'
import GenericNewsletterSignupForm from './generic-newsletter-signup'
import {trackNewsletterSignup} from '@/utils/analytics/ai-dev-essentials'

interface NewsletterSignupFormProps {
  className?: string
  source?: 'hero' | 'footer' | 'inline'
  onSuccess?: (email: string) => void
  onError?: (error: string) => void
}

export default function NewsletterSignupForm(props: NewsletterSignupFormProps) {
  return (
    <GenericNewsletterSignupForm
      {...props}
      submitButtonText="Subscribe to AI Dev Essentials"
      newsletterKey="ai_dev_essentials_newsletter"
      trackingSource="ai_dev_essentials_landing_page"
      trackSignup={trackNewsletterSignup}
    />
  )
}
