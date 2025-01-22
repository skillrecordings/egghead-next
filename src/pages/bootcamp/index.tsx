import Hero from './components/Hero'
import Features from './components/Features'
import WorkshopStructure from './components/WorkshopStructure'
import Instructor from './components/Instructor'
import SignUpForm from './components/SignUpForm'
import {motion} from 'framer-motion'
import type {NextPage} from 'next'
import {cn} from '@/ui/utils'
import {useTheme} from 'next-themes'

const BootcampPage: NextPage = () => {
  const {theme} = useTheme()
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
            className={cn(
              'absolute inset-0 bg-white dark:bg-gray-900',
              theme === 'dark' && 'pattern-dots-dense',
              theme === 'light' && 'pattern-dots-dense-light',
            )}
          />
          <Features />
        </div>

        <div className="relative bg-white dark:bg-gray-800">
          <WorkshopStructure />
        </div>

        <div className="relative bg-[#111111]">
          <div
            className={cn(
              'absolute inset-0 bg-white dark:bg-gray-900',
              theme === 'dark' && 'pattern-dots-dense',
              theme === 'light' && 'pattern-dots-dense-light',
            )}
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
