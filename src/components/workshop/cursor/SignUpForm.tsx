'use client'

import {useState, useRef, forwardRef, useImperativeHandle} from 'react'
import {Button} from './ui/button'
import {Input} from './ui/input'
import {motion} from 'framer-motion'
import useCio from '@/hooks/use-cio'
import {trpc} from '@/app/_trpc/client'
import {fadeInUp} from './animations'

export interface SignUpFormRef {
  focus: () => void
}

const SignUpForm = forwardRef<SignUpFormRef>((props, ref) => {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const {subscriber} = useCio()
  const emailInputRef = useRef<HTMLInputElement>(null)
  const identify = trpc.customerIO.identify.useMutation({
    onSuccess: (data) => {
      console.log('IDENTIFY', data)
    },
    onError: (error) => {
      console.log('ERROR', error)
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (isSubmitting) return

    setIsSubmitting(true)
    let subscriberId = subscriber?.id

    try {
      console.log('Submitting email:', email)
      const currentDateTime = Math.floor(Date.now() * 0.001)

      if (!subscriberId) {
        identify.mutateAsync({
          email,
          selectedInterests: {cursor_5day_workshop_waitlist: currentDateTime},
        })
      } else {
        identify.mutateAsync({
          id: subscriberId,
          selectedInterests: {cursor_5day_workshop_waitlist: currentDateTime},
        })
      }

      setEmail('')
      console.log('Successfully submitted email')
    } catch (error) {
      console.error('Failed to submit:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  useImperativeHandle(ref, () => ({
    focus: () => {
      emailInputRef.current?.focus()
    },
  }))

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
            Secure your seat in this 5-day, hands-on workshop designed to level
            up your development process. Overcome the frustration of complex
            integrations, learn to handle failures gracefully, and discover
            powerful planning strategies to keep you shipping code with
            confidence.
          </p>
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex space-x-2">
              <Input
                ref={emailInputRef}
                type="email"
                placeholder="Enter your email to join the waitlist"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting}
                className="flex-grow bg-gray-50 dark:bg-gray-800/50 dark:border-gray-800 border-gray-200 text-gray-900 dark:text-white placeholder:text-gray-500"
              />
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-500 text-white font-semibold transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Joining...' : 'Join Waitlist'}
              </Button>
            </div>
          </form>
          <p className="mt-4 text-center text-sm text-gray-500">
            We&apos;ll only send you essential info about the course—no spam.
          </p>
        </motion.div>
      </div>
    </section>
  )
})

SignUpForm.displayName = 'SignUpForm'

export default SignUpForm
