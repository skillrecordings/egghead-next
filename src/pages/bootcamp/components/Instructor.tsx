'use client'
import {motion} from 'framer-motion'
import Image from 'next/image'
import {fadeInUp} from './animations'

export default function Instructor() {
  return (
    <section className="py-32 relative">
      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.div {...fadeInUp} className="max-w-3xl mx-auto">
          <div className="mx-auto flex w-full max-w-3xl flex-col-reverse items-center justify-between gap-10 px-6 sm:gap-20 md:flex-row">
            <div>
              <h2 className="mb-8 text-3xl font-bold text-white flex flex-col items-center sm:items-start">
                <span className="font-heading dark:text-primary text-sm uppercase tracking-widest">
                  {' '}
                  Your Instructor
                </span>
                <span className="font-heading text-3xl font-semibold sm:text-4xl">
                  John Lindquist
                </span>
              </h2>
              <p className="mb-8 text-lg text-gray-400 text-left bg-white dark:bg-gray-900/80">
                John Lindquist is a recognized leader in developer education. He
                founded egghead.io—an innovative platform that has guided
                thousands of coders from novices to industry experts. With years
                of practical teaching experience and a genuine passion for
                helping others succeed, John will provide the clarity and
                support you need to master AI development.
              </p>
              <p className="text-md text-gray-500 text-left bg-white dark:bg-gray-900/80">
                Join John and a supportive community of developers as you build
                the skills needed to create impactful AI solutions.
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
