'use client'
import {motion} from 'framer-motion'
import {fadeInUp} from './animations'

export default function Conclusion() {
  return (
    <section className="py-32 relative">
      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.div {...fadeInUp} className="max-w-3xl mx-auto">
          <h2 className="mb-4 text-3xl font-bold text-center text-white">
            Ready to Join Our AI Mastery Workshop?
          </h2>
          <p className="mb-8 text-center text-gray-400 mx-auto">
            Secure your spot in this unique, 20-day immersive training
            experience. You&apos;ll learn alongside a focused cohort of
            developers, all committed to mastering practical AI implementation.
            Enter your email below to be first in line when registration opens
            for our next intensive.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
