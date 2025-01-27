'use client'
import {motion} from 'framer-motion'
import {fadeInUp, staggerContainer, staggerItem} from './animations'

const days = [
  {
    id: 'day-1',
    day: 'Day 1:',
    title: 'Rapid Project Spinning & Multi-Scaffolding',
    description:
      'Learn how to generate multiple small projects in minutes using Chat and Composer. Focus on speed over perfection and discover when to switch from open-ended Chat brainstorming to targeted Composer scaffolding.',
  },
  {
    id: 'day-2',
    day: 'Day 2:',
    title: 'Documentation, Cursor Rules & Customization',
    description:
      'Deepen your use of Chat for architectural discussions. Implement or refine `cursor-rules` for consistent code style and doc standards, and learn how to generate thorough documentation with Composer.',
  },
  {
    id: 'day-3',
    day: 'Day 3:',
    title: 'GitIngest, Logging & Bugfinding',
    description:
      'Embrace errors and learn to feed real-time logs into Bugfinding. Understand when to harness Chat, Composer, or Bugfinding to isolate problems, and use GitIngest to provide the AI full context of your codebase.',
  },
  {
    id: 'day-4',
    day: 'Day 4:',
    title: 'Refactoring, UI Checks & Code Quality',
    description:
      'Refine existing projects for maintainability and design consistency. Feed screenshots and test outputs back into AI, and turn repeated failures into improved Cursor Rules for next-level code cleanliness.',
  },
  {
    id: 'day-5',
    day: 'Day 5:',
    title: 'GitHub CLI, Actions & Advanced Automation',
    description:
      'Automate your entire workflow with GitHub CLI and Actions. From pre-commit hooks to continuous deployment, learn to chain tasks so that repeated friction points become a thing of the past.',
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
          5-Day Workshop Structure
        </motion.h2>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{once: true}}
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {days.map((day) => (
            <motion.div
              key={day.id}
              variants={staggerItem}
              className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 p-6 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors drop-shadow-lg rounded-lg"
            >
              <div className="text-[var(--accent-9)] font-medium mb-2">
                {day.day}
              </div>
              <h3 className="text-lg font-semibold dark:text-white text-gray-900 mb-2">
                {day.title}
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {day.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
