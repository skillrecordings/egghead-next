import Hero from './components/Hero'
import Features from './components/Features'
import WorkshopStructure from './components/WorkshopStructure'
import Instructor from './components/Instructor'
import SignUpForm from './components/SignUpForm'
import {motion} from 'framer-motion'
import type {NextPage} from 'next'

const BootcampPage: NextPage = () => {
  console.log(
    '[BootcampPage] Rendering on',
    typeof window === 'undefined' ? 'server' : 'client',
  )

  return (
    <motion.main
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      className={`min-h-screen relative bg-white dark:bg-gray-900`}
    >
      {/* Content */}
      <div className="relative">
        <div className="relative bg-white dark:bg-gray-800">
          <Hero />
        </div>

        <div className="relative bg-[#111111]">
          <div
            className={`absolute inset-0 bg-white dark:bg-gray-900 pattern-dots-dense`}
          />
          <Features />
        </div>

        <div className="relative bg-white dark:bg-gray-800">
          <WorkshopStructure />
        </div>

        <div className="relative bg-[#111111]">
          <div
            className={`absolute inset-0 bg-white dark:bg-gray-900 pattern-dots-dense`}
          />
          <Instructor />
        </div>

        <div className="relative bg-[#111111]">
          <div className={'absolute inset-0 bg-white dark:bg-gray-900'} />
          <SignUpForm />
        </div>
      </div>
    </motion.main>
  )
}

export default BootcampPage
