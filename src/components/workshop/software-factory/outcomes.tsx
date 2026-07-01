'use client'
import {motion} from 'motion/react'
import {fadeInUp} from '../shared/animations'

const OUTCOMES = [
  'A repeatable context-packaging workflow for hard problems',
  'A terminal workflow pattern for parallel specialized agents',
  'A mental model for planner, builder, researcher, and validator roles',
  'A tool configuration strategy for local commands, external services, and AI agents',
  'A practical approach to reusable skills, hooks, goals, and conversation history',
  'A starting point for embedding agents into internal tools with the Claude Code and Codex SDKs',
]

export default function Outcomes() {
  return (
    <section className="mx-auto max-w-3xl px-5">
      <div className="mb-3 text-center text-sm font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">
        Outcomes
      </div>
      <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
        Leave with an operating system, not a notes doc.
      </h2>
      <p className="mx-auto mt-4 max-w-2xl text-center text-lg leading-relaxed text-gray-600 dark:text-gray-400 sm:text-xl">
        The workshop is built around concrete workflows you can reuse: context
        packaging, specialized agents, tool profiles, hooks, goals, browser
        context, and repeatable scripts.
      </p>

      <ul className="mx-auto mt-8 max-w-2xl space-y-4">
        {OUTCOMES.map((outcome, i) => (
          <motion.li
            key={outcome}
            initial={fadeInUp.initial}
            whileInView={fadeInUp.animate}
            viewport={{once: true, margin: '-80px'}}
            transition={{duration: 0.4, delay: i * 0.05}}
            className="flex items-start gap-3 text-lg text-gray-700 dark:text-gray-300"
          >
            <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-blue-400" />
            <span>{outcome}</span>
          </motion.li>
        ))}
      </ul>
    </section>
  )
}
