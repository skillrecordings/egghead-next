'use client'
import {motion} from 'motion/react'
import {fadeInUp} from '../shared/animations'

const PILLARS = [
  {
    title: 'Get better answers from AI coding agents',
    description:
      'Package the files, traces, screenshots, logs, and goals that help AI tools understand the real problem.',
  },
  {
    title: 'Master terminal-based agent workflows',
    description:
      'Use terminal sessions for research, planning, building, and validation without losing the thread.',
  },
  {
    title: 'Create specialized agents for real work',
    description:
      'Shape prompts, skills, and tool access so each agent has a clear role instead of doing everything.',
  },
]

export default function WhatYoullGet() {
  return (
    <section className="mx-auto max-w-3xl px-5">
      <div className="mb-3 text-center text-sm font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">
        Overview
      </div>
      <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
        What You'll Get Out of This Workshop
      </h2>
      <p className="mx-auto mt-4 max-w-2xl text-center text-lg leading-relaxed text-gray-600 dark:text-gray-400 sm:text-xl">
        The workshop is built around three things working developers actually
        need from AI coding tools:
      </p>

      <div className="mx-auto mt-8 flex max-w-2xl flex-col gap-4">
        {PILLARS.map((pillar, i) => (
          <motion.div
            key={pillar.title}
            initial={fadeInUp.initial}
            whileInView={fadeInUp.animate}
            viewport={{once: true, margin: '-80px'}}
            transition={{duration: 0.4, delay: i * 0.06}}
            className="flex items-start gap-4"
          >
            <span className="mt-2 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-blue-400" />
            <p className="text-lg text-gray-700 dark:text-gray-300">
              <span className="font-semibold text-gray-900 dark:text-white">
                {pillar.title}:
              </span>{' '}
              {pillar.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
