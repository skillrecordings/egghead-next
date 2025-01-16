'use client'
import {motion} from 'framer-motion'
import {fadeInUp, staggerContainer, staggerItem} from './animations'

const weeks = [
  {
    id: 'week-1',
    week: 'Week 1 (Days 1–5):',
    title: 'Foundations & Simple Chatbot',
    description:
      'Set up your project environment and connect to a Large Language Model (LLM). Establish a basic chatbot with short-term memory, demonstrating AI fundamentals.',
  },
  {
    id: 'week-2',
    week: 'Week 2 (Days 6–10):',
    title: 'Local Data & Vector Search',
    description:
      'Integrate local or enterprise data sources and implement semantic querying. Build a smarter agent that learns from internal documents or databases.',
  },
  {
    id: 'week-3',
    week: 'Week 3 (Days 11–15):',
    title: 'Advanced Prompting, Testing & Polish',
    description:
      "Refine your AI's behavior with sophisticated prompt engineering. Enforce domain-specific rules and build automated tests to maintain output quality.",
  },
  {
    id: 'week-4',
    week: 'Week 4 (Days 16–20):',
    title: 'Multi-Agent Systems & Final Project',
    description:
      'Develop specialized agents (e.g., HR, Support, Analytics) and deploy a cohesive, production-ready AI solution. Wrap up with a final demo and group presentations.',
  },
]

export default function WorkshopStructure() {
  return (
    <section className="py-32 relative">
      <div className="container mx-auto px-4 relative z-10">
        <motion.h2
          {...fadeInUp}
          className="mb-16 text-3xl font-bold text-center text-white"
        >
          Workshop Structure
        </motion.h2>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{once: true}}
          className="grid gap-8 md:grid-cols-2"
        >
          {weeks.map((week) => (
            <motion.div
              key={week.id}
              variants={staggerItem}
              className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 p-6 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors drop-shadow-lg rounded-lg"
            >
              <div className="text-[var(--accent-9)] font-medium mb-2">
                {week.week}
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {week.title}
              </h3>
              <p className="text-gray-300">{week.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
