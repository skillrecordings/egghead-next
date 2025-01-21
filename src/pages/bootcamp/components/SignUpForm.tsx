'use client'

import {useState} from 'react'
import {Button} from './ui/button'
import {Input} from './ui/input'
import {motion} from 'framer-motion'
import {nanoid} from 'nanoid'
import useCio from '@/hooks/use-cio'

export default function SignUpForm() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const {cioIdentify} = useCio()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (isSubmitting) return

    setIsSubmitting(true)
    const subscriberId = nanoid()

    try {
      console.log('Submitting email:', email)
      await cioIdentify(subscriberId, {
        email,
        created_at: Math.floor(Date.now() / 1000),
        source: 'landing_page_waitlist',
      })

      setEmail('')
      console.log('Successfully submitted email')
    } catch (error) {
      console.error('Failed to submit:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="signup" className="py-32 relative">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{opacity: 1, y: 20}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true}}
          className="max-w-2xl mx-auto"
        >
          <h2 className="mb-4 text-3xl font-bold text-center text-white">
            Ready to Build a Team of AI Devs?
          </h2>
          <p className="mb-8 text-center text-gray-400 mx-auto">
            Secure your spot in this unique, 20-day cohort-based workshop.
            You&apos;ll learn alongside a supportive community of developers,
            all on the same journey to master AI. Enter your email below and be
            the first to know when registration opens.
          </p>
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex space-x-2">
              <Input
                type="email"
                placeholder="Enter your email to stay informed"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting}
                className="flex-grow bg-[#0A0A0A] border-gray-800 text-white placeholder:text-gray-500"
              />
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-gray-50 dark:bg-gray-800/50  dark:text-white text-black font-semibold transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Joining...' : 'Join Waitlist'}
              </Button>
            </div>
          </form>
          <p className="mt-4 text-center text-sm text-gray-500">
            We&apos;ll send you all the details—no spam, just practical info on
            how to join.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
