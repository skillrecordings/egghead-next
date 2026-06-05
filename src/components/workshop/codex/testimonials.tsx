'use client'
import Image from 'next/image'
import {motion} from 'motion/react'
import {fadeInUp} from '../shared/animations'

type CodexTestimonial = {
  quote: string
  name: string
  image?: string
  link?: string
}

const TESTIMONIALS: CodexTestimonial[] = [
  {
    quote:
      "John's workshop revealed that I was barely scratching the surface. I'd used features like agents and hooks before, but never to this extent. It was top notch! Insightful, straight to the point and brilliantly structured.",
    name: 'Vitor Correa',
    image:
      'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1755729693/people/vitor.png',
  },
  {
    quote:
      'This workshop was a goldmine of practical tips and tools that will take my workflow to the next level.',
    name: 'Jan',
    image:
      'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1756334503/people/uicoded.png',
    link: 'https://x.com/uicoded',
  },
  {
    quote: 'JOHN IS SO SMART!',
    name: 'Kent C. Dodds',
    image:
      'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1734117159/epic-web/conf-2025/kent.jpg',
    link: 'https://x.com/kentcdodds/status/1960833395149431093',
  },
]

function QuoteMark() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 32 32"
      className="h-7 w-7 text-blue-500/60 dark:text-blue-400/50"
      fill="currentColor"
    >
      <path d="M9.5 8C6 8 3.5 11 3.5 14.5c0 3 2 5.3 4.8 5.3.4 0 .8 0 1.1-.1-.7 2.3-2.6 4-5 4.6L5 26c4.6-.6 8.3-4.4 8.3-9.6C13.3 11 11.8 8 9.5 8Zm14 0C20 8 17.5 11 17.5 14.5c0 3 2 5.3 4.8 5.3.4 0 .8 0 1.1-.1-.7 2.3-2.6 4-5 4.6L19 26c4.6-.6 8.3-4.4 8.3-9.6C27.3 11 25.8 8 23.5 8Z" />
    </svg>
  )
}

export default function Testimonials() {
  return (
    <section className="mx-auto max-w-5xl px-5">
      <div className="mb-3 text-center text-sm font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">
        Testimonials
      </div>
      <h2 className="mb-12 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
        What people are saying
      </h2>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {TESTIMONIALS.map((t, i) => (
          <motion.figure
            key={t.name}
            initial={fadeInUp.initial}
            whileInView={fadeInUp.animate}
            viewport={{once: true, margin: '-60px'}}
            transition={{duration: 0.4, delay: i * 0.08}}
            className="flex flex-col rounded-2xl border border-gray-200 bg-white/70 p-6 shadow-sm transition-colors hover:border-blue-400/60 dark:border-gray-800 dark:bg-gray-950/40 dark:hover:border-blue-500/40 sm:p-7"
          >
            <QuoteMark />
            <blockquote className="mt-4 flex-1 text-lg leading-relaxed text-gray-700 dark:text-gray-200">
              {t.quote}
            </blockquote>
            <figcaption className="mt-6 flex items-center gap-3 border-t border-gray-100 pt-5 dark:border-gray-800">
              {t.image && (
                <Image
                  src={t.image}
                  alt={t.name}
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full ring-1 ring-gray-200 dark:ring-gray-700"
                />
              )}
              <span className="text-base font-semibold text-gray-900 dark:text-white">
                {t.link ? (
                  <a
                    href={t.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-gray-300 underline-offset-2 transition-colors hover:decoration-blue-500 dark:decoration-gray-600"
                  >
                    {t.name}
                  </a>
                ) : (
                  t.name
                )}
              </span>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  )
}
