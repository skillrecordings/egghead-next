'use client'

import * as React from 'react'
import {motion} from 'motion/react'
import {fadeInUp} from '../shared/animations'
import GenericNewsletterSignupForm from '@/components/forms/generic-newsletter-signup'

const SignUpForm = () => {
  return (
    <section id="signup" className="py-16 relative">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={fadeInUp.initial}
          animate={fadeInUp.animate}
          transition={fadeInUp.transition}
          className="max-w-2xl mx-auto"
        >
          <h2 className="mb-4 lg:text-4xl sm:text-3xl text-2xl font-bold text-center dark:text-white text-gray-900">
            Ready to Master Claude Code?
          </h2>
          <p className="mb-8 text-center text-lg opacity-80 mx-auto">
            Request a seat in this hands-on workshop designed to level up your
            development process. Overcome the frustration of complex
            integrations, learn to handle failures gracefully, and discover
            powerful planning strategies to keep you shipping code with
            confidence.
          </p>
          <div className="w-full">
            <GenericNewsletterSignupForm
              submitButtonText="Sign Up for Claude Code Workshop"
              successMessage="Thank you for signing up! We'll notify you when the workshop is available."
              emailPlaceholder="Enter your email"
              namePlaceholder="Your name"
              newsletterKey="claude_code_workshop"
              trackingSource="claude_code_workshop_page"
              showNameField={true}
              className="max-w-lg"
              source="hero"
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default SignUpForm
