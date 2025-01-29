'use client'
import {motion} from 'framer-motion'
import {fadeInUp} from './animations'

export default function Conclusion() {
  return (
    <section className="py-32 relative">
      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.div {...fadeInUp} className="max-w-3xl mx-auto">
          <h2 className="mb-4 text-3xl font-bold text-center text-white">
            Ready to Join the 5-Day Cursor Mastery Workshop?
          </h2>
          <p className="mb-8 text-center text-gray-400 mx-auto">
            Don’t let frustration hold you back. Secure your spot in an
            immersive program focused on turning setbacks into breakthroughs.
            Over 5 action-packed days, you’ll harness Chat, Composer,
            Bugfinding, and multi-file analysis—building real-world confidence
            you can apply to any project. Enter your email below to join the
            waitlist and transform your entire dev workflow.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
