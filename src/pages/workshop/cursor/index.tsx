'use client'
import Hero from '@/components/workshop/cursor/Hero'
import Features from '@/components/workshop/cursor/Features'
import WorkshopStructure from '@/components/workshop/cursor/WorkshopStructure'
import Instructor from '@/components/workshop/cursor/Instructor'
import SignUpForm from '@/components/workshop/cursor/SignUpForm'
import type {SignUpFormRef} from '@/components/workshop/cursor/SignUpForm'
import {motion} from 'framer-motion'
import type {NextPage} from 'next'
import {useRef} from 'react'

const WorkshopPage: NextPage = () => {
  const formRef = useRef<SignUpFormRef>(null)

  console.log(
    '[WorkshopPage] Rendering on',
    typeof window === 'undefined' ? 'server' : 'client',
  )

  return (
    <motion.main
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      className="min-h-screen relative bg-white dark:bg-gray-900"
    >
      {/* Content */}
      <div className="relative">
        <div className="relative">
          <Hero formRef={formRef} />
        </div>

        <div className="relative bg-[#111111]">
          <div className="absolute inset-0 bg-gray-100 dark:bg-gray-900" />
          <Features />
        </div>

        <div className="relative bg-white dark:bg-gray-800">
          <WorkshopStructure />
        </div>

        <div className="relative bg-[#111111]">
          <div className="absolute inset-0 bg-gray-100 dark:bg-gray-900" />
          <Instructor />
        </div>

        <div className="relative bg-[#111111]">
          <div className="absolute inset-0 bg-gray-300 dark:bg-gray-950" />
          <SignUpForm ref={formRef} />
        </div>
      </div>
    </motion.main>
  )
}

export default WorkshopPage
