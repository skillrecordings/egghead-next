'use client'
import {motion} from 'framer-motion'
import {fadeInUp, staggerContainer, staggerItem} from './animations'

const days = [
  {
    id: 'day-1',
    day: 'Day 1:',
    title: 'Rapid-Fire Project Generation',
    description:
      'Take your ideas and turn them into a projects in minutes. Spin up variations and iterate quickly to your taste. Set up for success by starting with solid foundations while still focusing on rapid development.',
  },
  {
    id: 'day-2',
    day: 'Day 2:',
    title: 'Planning, Cursor Rules, Customization',
    description:
      'Deepen your use of Chat for architectural discussions. Implement or refine cursor-rules for consistent code style, and create step-by-step project plans that keep you aligned from start to finish.',
  },
  {
    id: 'day-3',
    day: 'Day 3:',
    title: 'Bulk Code Analysis, Logging, Bugfinding',
    description:
      'Embrace errors and learn to feed real-time logs into Bugfinding. Understand when to harness Chat, Composer, or Bugfinding to isolate problems—even across large sets of files—and refine your entire workflow.',
  },
  {
    id: 'day-4',
    day: 'Day 4:',
    title: 'Refactoring, UI Checks, Code Quality',
    description:
      'Refine existing projects for maintainability and design consistency. Feed screenshots or test outputs back into AI, and turn repeated failures into improved Cursor Rules for next-level code cleanliness.',
  },
  {
    id: 'day-5',
    day: 'Day 5:',
    title: 'Composer Power Tools',
    description:
      'Elevate your workflow by configuring Composer to run specialized tasks you’d usually do in the terminal. Set up custom agents that chain multiple steps, so you can handle complex actions without manual intervention.',
  },
]

export default function WorkshopStructure() {
  return (
    <section className="py-24 relative">
      <div className="max-w-xl mx-auto px-4 relative z-10">
        <motion.h2
          {...fadeInUp}
          className="mb-16 text-3xl font-bold text-center dark:text-white"
        >
          5-Day Workshop Structure
        </motion.h2>
        <motion.div
          initial={staggerContainer.hidden}
          animate={staggerContainer.show}
          className="flex flex-col gap-8"
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
