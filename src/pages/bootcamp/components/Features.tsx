'use client'
import {motion} from 'framer-motion'
import {Cpu, Database, Users, Calendar, Shield, Cloud} from 'lucide-react'
import {fadeInUp, staggerContainer, staggerItem} from './animations'

const features = [
  {
    id: 'ai-integration',
    title: 'Practical AI Integration',
    description:
      'Quickly integrate AI capabilities into new or existing applications using modern frameworks and tools.',
    icon: Cpu,
  },
  {
    id: 'data-handling',
    title: 'Intelligent Data Handling',
    description:
      'Implement vector search and semantic querying to give your users quick, context-aware answers—no matter the data set.',
    icon: Database,
  },
  {
    id: 'multi-agent',
    title: 'Multi-Agent Systems',
    description:
      'Build specialized agents (e.g., for support, data analysis, or automation) that work in tandem to serve different business needs.',
    icon: Users,
  },
  {
    id: 'accountability',
    title: 'Daily Accountability',
    description:
      'Participate in 1-hour live workshop sessions plus evening assignments, ensuring steady progress. Get real-time feedback from John and fellow participants in a shared cohort environment.',
    icon: Calendar,
  },
  {
    id: 'security',
    title: 'Testing & Security',
    description:
      'Learn best practices for automated testing of AI outputs and safeguarding sensitive data. Keep your enterprise environment secure and compliant.',
    icon: Shield,
  },
  {
    id: 'deployment',
    title: 'Production-Ready Deployment',
    description:
      'Deploy your AI-driven solutions confidently—either to a cloud platform or Docker environment—with built-in logging and analytics for ongoing improvements.',
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
          What You&apos;ll Learn
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
                  <div className="inline-flex items-center justify-center w-12 h-12 mb-4">
                    <Icon className="w-6 h-6 text-[var(--accent-9)]" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
