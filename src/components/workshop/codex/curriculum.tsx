'use client'
import {motion} from 'motion/react'
import {fadeInUp} from '../shared/animations'

type CurriculumModule = {
  label: string
  title: string
  description: string
  points: string[]
}

export const CURRICULUM: CurriculumModule[] = [
  {
    label: 'Context',
    title: 'Get better answers from hard problems',
    description:
      'Package the right project context, ask for ambitious plans, and turn the response into an implementation-ready goal.',
    points: [
      'Bundle files, logs, issues, screenshots, and traces',
      'Ask for plans that are specific without being timid',
      'Use the best plan as the source for downstream work',
    ],
  },
  {
    label: 'Workspace',
    title: 'Terminal workflows for parallel agents',
    description:
      'Use named terminal sessions for researchers, planners, builders, and validators.',
    points: [
      'Create a primary terminal that coordinates focused agents',
      'Fan work out to research and build lanes',
      'Keep parallel work easy to scan and resume',
    ],
  },
  {
    label: 'Profiles',
    title: 'Specialized agents beat overloaded agents',
    description:
      'Compare broad default agents against narrow custom prompts, focused skills, and limited tool access.',
    points: [
      'Assign planner, builder, researcher, and validator responsibilities',
      'Control instructions, skills, and available tools',
      'Measure cost, speed, and result quality tradeoffs',
    ],
  },
  {
    label: 'Tools',
    title: 'Connect your tools into one AI development system',
    description:
      'Organize local tools, remote services, and command-line utilities so each agent gets the right level of access.',
    points: [
      'Organize tools by agent type and risk level',
      'Separate read-only tools from mutation tools',
      'Map agent configuration to repeatable tool profiles',
    ],
  },
  {
    label: 'Exploration',
    title: 'Explore, debug, and decide with richer context',
    description:
      'Replace vague back-and-forth with fast variations, browser context, screenshots, recordings, and selective pruning.',
    points: [
      'Generate multiple directions before deciding',
      'Point agents at the exact UI state you want investigated',
      'Turn visual options and rough recordings into concrete goals',
    ],
  },
  {
    label: 'Automation',
    title: 'Reusable skills, hooks, and workflow automation',
    description:
      'Create portable conventions, package repeatable workflows, and know when a flexible agent process should become a script.',
    points: [
      'Create, share, install, and manage reusable skills',
      'Use hooks and validators to enforce important behavior',
      'Turn repeatable agent work into lightweight automation',
    ],
  },
  {
    label: 'Memory',
    title: 'Capture goals, decisions, and history',
    description:
      'Connect written goals, task trackers, and past conversations so future work starts with the right context.',
    points: [
      'Decide when lightweight local goals are enough',
      'Move durable work into a team-friendly tracker',
      'Mine past conversations for reusable decisions',
    ],
  },
  {
    label: 'SDK',
    title: 'Build Codex into your own tools',
    description:
      'Use the Codex SDK when you want programmatic control over engineering agents inside internal tools, apps, and delivery pipelines.',
    points: [
      'Start and continue Codex threads from TypeScript applications',
      'Integrate agent runs into CI, dashboards, and team workflows',
      'Know when the SDK is better than one-off terminal sessions',
    ],
  },
]

function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      className="mt-1 h-5 w-5 flex-shrink-0 text-blue-500 dark:text-blue-400"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
    >
      <circle cx="10" cy="10" r="8" className="opacity-40" />
      <path
        d="M6.5 10.5l2.5 2.5 4.5-5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function Curriculum() {
  return (
    <section className="mx-auto max-w-3xl px-5">
      <div className="mb-3 text-center text-sm font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">
        Curriculum
      </div>
      <h2 className="mb-10 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
        A Practical Map of The Whole Agentic Stack
      </h2>

      <div className="flex flex-col gap-5">
        {CURRICULUM.map((module, i) => (
          <motion.div
            key={module.title}
            initial={fadeInUp.initial}
            whileInView={fadeInUp.animate}
            viewport={{once: true, margin: '-80px'}}
            transition={{duration: 0.4, delay: Math.min(i * 0.04, 0.2)}}
            className="rounded-xl border border-gray-200 bg-white/60 p-6 shadow-sm transition-colors hover:border-blue-400 dark:border-gray-800 dark:bg-gray-950/40 dark:hover:border-blue-500/40 sm:p-8"
          >
            <div className="mb-2 text-sm font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">
              {module.label}
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
              {module.title}
            </h3>
            <p className="mt-2 text-lg leading-relaxed text-gray-600 dark:text-gray-400">
              {module.description}
            </p>
            <ul className="mt-5 space-y-3">
              {module.points.map((point) => (
                <li
                  key={point}
                  className="flex items-start gap-3 text-lg text-gray-700 dark:text-gray-300"
                >
                  <CheckIcon />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
