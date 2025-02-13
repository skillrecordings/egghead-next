'use client'
import {motion} from 'framer-motion'
import Image from 'next/image'
import {fadeInUp} from './animations'
import {Tweet} from 'react-tweet'

export default function Instructor() {
  return (
    <section className="md:py-24 sm:py-16 py-5 relative">
      <div className="mx-auto px-4 text-center relative z-10">
        <motion.div {...fadeInUp} className="max-w-screen-lg mx-auto">
          <div className="mx-auto flex w-full  flex-col md:items-start items-center justify-between gap-10 px-6 sm:gap-16 md:flex-row">
            <div className="flex flex-shrink-0 flex-col items-center gap-8">
              <Image
                src="https://res.cloudinary.com/dg3gyk0gu/image/upload/v1683164538/assets/john.webp"
                alt="John Lindquist"
                width={300}
                height={300}
                className="rounded-lg sm:max-w-full max-w-32"
              />

              {/* <Tweet id="1884674424374214692" /> */}
            </div>
            <div>
              <h2 className="mb-8 text-3xl font-bold dark:text-white flex flex-col items-center md:items-start">
                <span className="opacity-80 text-xs uppercase">
                  Your Instructor
                </span>
                <span className="font-heading text-3xl font-semibold sm:text-4xl">
                  John Lindquist
                </span>
              </h2>
              <p className="mb-8 text-lg opacity-90 md:text-left text-center">
                John Lindquist is your guide through the complexities of
                AI-driven development. As the founder of egghead.io, he has
                helped thousands of developers navigate new technologies with
                clarity and confidence. Now, he's here to show you exactly how
                to transform frustrating moments into opportunities for deeper
                learning and success—using the full power of Cursor's Chat,
                Composer, and Bugfinding modes.
              </p>
            </div>
          </div>
          <blockquote className="my-16">
            <p className="text-xl font-semibold tracking-tight italic">
              "John is the cursor god"
            </p>
            <div className="opacity-50">— Sunil Pai</div>
          </blockquote>
        </motion.div>
      </div>
    </section>
  )
}
