'use client'
import Link from 'next/link'
import Image from 'next/image'
import {motion} from 'motion/react'
import {Button} from '@/ui'
import {fadeInUp, scaleIn} from '../shared/animations'

function scrollToSignup(e: React.MouseEvent<HTMLAnchorElement>) {
  e.preventDefault()
  document.querySelector('#signup')?.scrollIntoView({behavior: 'smooth'})
}

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white dark:bg-gray-900">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-blue-50/40 to-transparent dark:from-blue-500/[0.04]"
      />
      <div className="relative mx-auto max-w-3xl px-5 pb-12 pt-16 sm:pb-16 sm:pt-24">
        <motion.div {...scaleIn}>
          <div className="mb-5 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500" />
            </span>
            Live Workshop
          </div>

          <motion.h1
            {...fadeInUp}
            className="text-5xl font-extrabold leading-[1.05] tracking-tight text-gray-900 dark:text-white sm:text-6xl lg:text-7xl"
          >
            Codex Power User
          </motion.h1>

          <motion.div
            {...fadeInUp}
            transition={{delay: 0.1}}
            className="mt-10 rounded-xl border border-gray-200 bg-white/70 p-6 dark:border-gray-800 dark:bg-gray-950/40 sm:p-7"
          >
            <div className="mb-4 inline-block rounded-md bg-blue-600 px-3 py-1 text-sm font-bold uppercase tracking-wide text-white">
              Hosted by
            </div>
            <div className="flex items-start gap-4">
              <Image
                src="https://res.cloudinary.com/dg3gyk0gu/image/upload/v1683164538/assets/john.webp"
                alt="John Lindquist"
                width={56}
                height={56}
                className="h-14 w-14 flex-shrink-0 rounded-full ring-1 ring-gray-200 dark:ring-gray-700"
              />
              <div>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  John Lindquist
                </p>
                <p className="mt-1 text-lg leading-relaxed text-gray-600 dark:text-gray-400">
                  John Lindquist is the co-founder of egghead.io, and pioneered
                  the standard of bite-sized education, and has spent years
                  turning advanced AI coding workflows into practical training
                  for working developers. After helping hundreds of
                  professionals level up with Cursor and Claude Code across
                  dozens of workshops, he is bringing that battle-tested
                  experience to Codex.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            {...fadeInUp}
            transition={{delay: 0.2}}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <Button
              asChild
              size="lg"
              className="bg-blue-600 text-lg font-semibold text-white hover:bg-blue-700"
            >
              <Link href="#signup" onClick={scrollToSignup}>
                Reserve your spot
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
