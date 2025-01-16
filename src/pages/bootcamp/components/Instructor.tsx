'use client'
import {motion} from 'framer-motion'
import {fadeInUp} from './animations'

export default function Instructor() {
  return (
    <section className="py-32 relative">
      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.div {...fadeInUp} className="max-w-3xl mx-auto">
          <h2 className="mb-8 text-3xl font-bold text-white">
            Meet Your Instructor, John Lindquist
          </h2>
          <p className="mb-8 text-lg text-gray-400">
            John Lindquist is a recognized leader in developer education. He
            founded egghead.io—an innovative platform that has guided thousands
            of coders from novices to industry experts. With years of practical
            teaching experience and a genuine passion for helping others
            succeed, John will provide the clarity and support you need to
            master AI development.
          </p>
          <p className="text-md text-gray-500">
            Join John and a supportive community of developers as you build the
            skills needed to create impactful AI solutions.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
