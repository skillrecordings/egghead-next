'use client'
import Image from 'next/image'
import {motion} from 'motion/react'

interface Testimonial {
  name: string
  quote: string
  avatar: string
}

const defaultTestimonials: Testimonial[] = [
  {
    name: 'Kent C. Dodds',
    quote: 'One‑shot OAuth in minutes.',
    avatar:
      'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1734117159/epic-web/conf-2025/kent.jpg',
  },
  {
    name: 'David Wells',
    quote: '🔥 Highly recommend.',
    avatar:
      'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1748905126/assets/david-wells.jpg',
  },
  {
    name: 'Sunil Pai',
    quote: 'John is the Cursor god.',
    avatar:
      'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1744410010/assets/sunil.jpg',
  },
]

interface TestimonialBarProps {
  testimonials?: Testimonial[]
}

export default function TestimonialBar({
  testimonials = defaultTestimonials,
}: TestimonialBarProps) {
  return (
    <motion.section
      initial={{opacity: 0, y: 20}}
      animate={{opacity: 1, y: 0}}
      transition={{delay: 0.4, duration: 0.5}}
      className="not-prose relative bg-gray-50 dark:bg-gray-800/50 py-6 px-4 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 text-center md:text-left">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{opacity: 0, x: -20}}
              animate={{opacity: 1, x: 0}}
              transition={{delay: 0.5 + index * 0.1}}
              className="flex items-center gap-3"
            >
              <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 opacity-80">
                <Image
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="text-sm">
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {testimonial.name}
                </p>
                <p className="text-gray-600 dark:text-gray-300 italic">
                  "{testimonial.quote}"
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      {/* Separator dots on mobile */}
      <div className="flex md:hidden justify-center gap-2 mt-4">
        {testimonials.map((_, i) => (
          <div
            key={i}
            className="w-1 h-1 bg-gray-400 dark:bg-gray-600 rounded-full"
          />
        ))}
      </div>
    </motion.section>
  )
}
