'use client'
import {motion} from 'framer-motion'
import Image from 'next/image'
import {fadeInUp} from './animations'

export default function Instructor() {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.div {...fadeInUp} className="max-w-3xl mx-auto">
          <div className="mx-auto flex w-full max-w-3xl flex-col-reverse items-center justify-between gap-10 px-6 sm:gap-20 md:flex-row">
            <div>
              <h2 className="mb-8 text-3xl font-bold dark:text-white flex flex-col items-center sm:items-start">
                <span className="font-heading dark:text-primary text-sm uppercase tracking-widest">
                  Your Instructor
                </span>
                <span className="font-heading text-3xl font-semibold sm:text-4xl">
                  John Lindquist
                </span>
              </h2>
              <p className="mb-8 text-lg text-gray-500 dark:text-gray-400 text-left">
                John Lindquist is your guide through the complexities of
                AI-driven development. As the founder of egghead.io, he has
                helped thousands of developers navigate new technologies with
                clarity and confidence. Now, he’s here to show you exactly how
                to transform frustrating moments into opportunities for deeper
                learning and success—using the full power of Cursor’s Chat,
                Composer, and Bugfinding modes.
              </p>
            </div>
            <Image
              src="https://res.cloudinary.com/dg3gyk0gu/image/upload/v1683164538/assets/john.webp"
              alt="John Lindquist"
              width={300}
              height={300}
              className="rounded-lg"
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
