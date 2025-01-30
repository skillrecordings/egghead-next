'use client'

import {forwardRef} from 'react'
import {motion} from 'framer-motion'
import {Widget} from '@typeform/embed-react'
import {fadeInUp} from './animations'

export interface SignUpFormRef {
  focus: () => void
}

const SignUpForm = forwardRef<SignUpFormRef>((props, ref) => {
  return (
    <section id="signup" className="py-32 relative">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={fadeInUp.initial}
          animate={fadeInUp.animate}
          transition={fadeInUp.transition}
          className="max-w-2xl mx-auto"
        >
          <h2 className="mb-4 text-3xl font-bold text-center dark:text-white text-gray-900">
            Ready to Transform Your Cursor Workflow?
          </h2>
          <p className="mb-8 text-center text-gray-500 dark:text-gray-400 mx-auto">
            Request a seat in this 5-day, hands-on workshop designed to level up
            your development process. Overcome the frustration of complex
            integrations, learn to handle failures gracefully, and discover
            powerful planning strategies to keep you shipping code with
            confidence.
          </p>
          <div className="aspect-[16/9] w-full">
            <Widget id="Qe8W3N2B" className="w-full h-48" />
          </div>
        </motion.div>
      </div>
    </section>
  )
})

SignUpForm.displayName = 'SignUpForm'

export default SignUpForm
