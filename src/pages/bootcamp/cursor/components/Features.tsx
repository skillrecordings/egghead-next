'use client'
import {motion} from 'framer-motion'
import {Cpu, Database, Users, Calendar, Shield, Cloud} from 'lucide-react' // Re-using icons; feel free to swap them as needed.
import {fadeInUp, staggerContainer, staggerItem} from './animations'

const features = [
  {
    id: 'rapid-spinning',
    title: 'Rapid Project Spinning & Multi-Scaffolding',
    description:
      'Quickly generate multiple project types—CLI tools, web apps, more—within minutes using Chat and Composer, so you never lose momentum.',
    icon: Cpu,
  },
  {
    id: 'docs-rules',
    title: 'Documentation & Cursor Rules',
    description:
      'Refine your workflows with custom rules, generate in-code docs automatically, and keep your projects fully documented at all times.',
    icon: Database,
  },
  {
    id: 'bugfinding-gitingest',
    title: 'Bugfinding & GitIngest',
    description:
      'Leverage specialized debugging tools to isolate errors fast, and ingest entire repositories for deeper AI-driven context and solutions.',
    icon: Users,
  },
  {
    id: 'logging-feedback',
    title: 'Logging & Feedback Loops',
    description:
      'Pipe error logs and test outputs into Chat or Composer, turning failures into teachable moments that refine both your code and your AI prompts.',
    icon: Calendar,
  },
  {
    id: 'refactoring-ui',
    title: 'Refactoring & UI Checks',
    description:
      'Use AI to systematically review your code quality and front-end design, reducing friction and ensuring consistent user experiences.',
    icon: Shield,
  },
  {
    id: 'ci-automation',
    title: 'GitHub CLI & Advanced Automation',
    description:
      'Automate your entire workflow—pull requests, actions, deployments—to ensure that frustration never halts your team’s progress.',
    icon: Cloud,
  },
]

export default function Features() {
  return (
    <section className="py-32 relative">
      <div className="container mx-auto px-4 relative z-10">
        <motion.h2
          {...fadeInUp}
          className="mb-16 text-3xl font-bold text-center text-white"
        >
          What You&apos;ll Master
        </motion.h2>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{once: true}}
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.id}
                variants={staggerItem}
                className="group relative bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-800 rounded-lg p-6 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors drop-shadow-lg"
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
