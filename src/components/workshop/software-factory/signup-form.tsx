'use client'
import {motion} from 'motion/react'
import {fadeInUp} from '../shared/animations'
import GenericNewsletterSignupForm from '@/components/forms/generic-newsletter-signup'

export default function SignUpForm() {
  return (
    <section className="relative border-t border-gray-200 bg-white py-16 dark:border-gray-800 dark:bg-gray-900 sm:py-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-blue-50/40 to-transparent dark:from-blue-500/[0.04]"
      />
      <div className="relative mx-auto max-w-2xl px-5">
        <motion.div
          initial={fadeInUp.initial}
          whileInView={fadeInUp.animate}
          viewport={{once: true}}
          transition={fadeInUp.transition}
        >
          <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Reserve your spot
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-lg leading-relaxed text-gray-600 dark:text-gray-400 sm:text-xl">
            Join John Lindquist for a hands-on day mastering the workflows that
            separate agent power users from everyone else. Drop your email and
            we'll let you know when the next workshop opens.
          </p>
          <div className="mt-8">
            <GenericNewsletterSignupForm
              submitButtonText="Reserve your spot"
              successMessage="Thank you for signing up! We'll notify you when the Agentic Software Factory workshop is available."
              emailPlaceholder="Enter your email"
              namePlaceholder="Your name"
              newsletterKey="software_factory_workshop"
              trackingSource="software_factory_workshop_page"
              showNameField={true}
              className="mx-auto max-w-lg"
              source="hero"
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
