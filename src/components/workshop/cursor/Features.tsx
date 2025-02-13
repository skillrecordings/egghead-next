'use client'
import {motion} from 'framer-motion'
import {Cpu, Database, Users, Calendar, Shield, Cloud} from 'lucide-react'
import {fadeInUp, staggerContainer, staggerItem} from './animations'

const features = [
  {
    id: 'rapid-spinning',
    title: 'Project Generation Mastery',
    description:
      'Accelerate from zero to structured codebase. Quickly generate projects set up with best practices and solid foundations.',
    icon: Cpu,
  },
  {
    id: 'planning-cursor-rules',
    title: 'Planning & Cursor Rules',
    description:
      'Refine your workflows with custom rules, and master step-by-step planning for smooth project execution from start to finish.',
    icon: Database,
  },
  {
    id: 'bulk-analysis-bugfinding',
    title: 'Bulk Code Analysis & Bugfinding',
    description:
      'Leverage specialized debugging tools to isolate errors fast, and analyze large sets of files for deeper AI-driven insights.',
    icon: Users,
  },
  {
    id: 'logging-feedback',
    title: 'Logging & Feedback Loops',
    description:
      'Pipe error logs and test outputs directly into Chat or Composer. Transform each failure into a valuable lesson that refines your projects and AI prompts.',
    icon: Calendar,
  },
  {
    id: 'refactoring-ui',
    title: 'Refactoring & UI Checks',
    description:
      'Use AI to systematically review your code quality and front-end design, ensuring consistency and reducing friction at every step.',
    icon: Shield,
  },
  {
    id: 'advanced-composer-agents',
    title: 'Composer Toolchain Pipelines',
    description: `Create specialized Composer workflows and agents that automate tasks you'd typically run in the terminal—speeding up your entire dev process`,
    icon: Cloud,
  },
]

export default function Features() {
  return (
    <section className="py-10 relative">
      <div className="container mx-auto px-6 sm:px-8 relative z-10">
        <motion.h2
          {...fadeInUp}
          className="mb-5 lg:text-3xl sm:text-2xl text-xl font-bold dark:text-white"
        >
          Essential Skills You'll Develop
        </motion.h2>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="grid md:gap-8 gap-5 md:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.id}
                variants={staggerItem}
                className="group relative bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-800 rounded-lg p-6 drop-shadow-lg"
              >
                <div className="relative">
                  <div className="flex items-center mb-4 gap-2">
                    <Icon className="w-6 h-6 text-[var(--accent-9)]" />
                    <h3 className="text-lg font-semibold dark:text-white text-gray-900">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
