'use client'
import Link from 'next/link'
import {motion} from 'framer-motion'
import {fadeInUp, scaleIn} from './animations'
import {useState, useEffect} from 'react'
import './styles.css'
import {ArrowCircleDownIcon} from '@heroicons/react/solid'
import type {SignUpFormRef} from './SignUpForm'
import Image from 'next/image'
import {Button} from '@/ui'

const phrases = [
  'Conquer the Complexity of',
  'Turn Failures into Fuel with',
  'Accelerate Your Workflow in',
  'Master Composer in',
]

const AnimatedPhrase = ({text}: {text: string}) => (
  <motion.span
    initial={{opacity: 0, y: -20}}
    animate={{opacity: 1, y: 0}}
    exit={{opacity: 0, y: 20}}
    transition={{duration: 0.5}}
    className="absolute left-0 right-0"
  >
    {text}
  </motion.span>
)

function scrollToSignup(
  e: React.MouseEvent<HTMLAnchorElement>,
  formRef: React.RefObject<SignUpFormRef>,
) {
  e.preventDefault()
  document.querySelector('#signup')?.scrollIntoView({behavior: 'smooth'})
  setTimeout(() => {
    formRef.current?.focus()
  }, 500)
}

interface HeroProps {
  formRef: React.RefObject<SignUpFormRef>
}

export default function Hero({formRef}: HeroProps) {
  const [phraseIndex, setPhraseIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setPhraseIndex((current) => (current + 1) % phrases.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="sm:py-12 py-8 bg-white dark:bg-gray-900 md:py-10 text-center  overflow-hidden">
      <div className="absolute inset-0 pattern-dots" />
      <div
        aria-hidden="true"
        className="absolute inset-0 w-full h-full bg-gradient-to-b dark:from-gray-900/90 dark:to-gray-900/70 from-gray-50 to-transparent"
      />
      <motion.div {...scaleIn} className="relative max-w-4xl mx-auto px-6">
        <Image
          className="mx-auto mb-5 sm:px-0 px-10"
          quality={100}
          src="https://res.cloudinary.com/dg3gyk0gu/image/upload/v1739447750/cursor-workshop-perspective_2x_h5fvrr.png"
          alt="Cursor IDE"
          width={1027 / 2.5}
          height={601 / 2.5}
        />
        <motion.h1
          {...fadeInUp}
          className="lg:text-5xl sm:text-4xl text-xl flex flex-col relative mb-6 font-extrabold tracking-tight dark:text-white leading-tight"
        >
          <span className="relative h-[1em] block mb-2">
            <div key={phraseIndex}>
              <AnimatedPhrase text={phrases[phraseIndex]} />
            </div>
          </span>
          <span className="">Cursor</span>
        </motion.h1>

        <motion.p
          {...fadeInUp}
          transition={{delay: 0.1}}
          className="relative mb-8 sm:text-lg md:text-xl dark:text-gray-200 text-gray-700 max-w-3xl mx-auto leading-relaxed"
        >
          Join{' '}
          <span className="text-gray-900 pl-2 inline-flex items-baseline md:gap-2 gap-1 dark:text-white font-medium">
            <Image
              src={
                'https://egghead.io/_next/image?url=https%3A%2F%2Fd2eip9sf3oo6c2.cloudfront.net%2Finstructors%2Favatars%2F000%2F000%2F005%2Fsquare_64%2Favatar-500x500.jpg&w=96&q=75'
              }
              alt="John Lindquist"
              width={40}
              height={40}
              className="rounded-full relative md:translate-y-3 translate-y-2 md:w-10 w-7"
            />{' '}
            John Lindquist
          </span>
          , founder of egghead.io, for an immersive workshop designed to help
          you conquer the frustration of getting stuck with complex AI tools.
          You'll learn how to turn failures into successes by mastering{' '}
          <span className="text-gray-900 dark:text-white font-medium">
            Chat, Composer, and Bugfinding
          </span>{' '}
          workflows—plus powerful strategies for multi-file analysis. Streamline
          your development cycle and unlock Cursor's full potential.
        </motion.p>

        <motion.div
          {...fadeInUp}
          transition={{delay: 0.3, type: 'spring', stiffness: 200}}
          className="relative"
        >
          <Button
            asChild
            size="lg"
            className=" sm:mt-5 dark:bg-white dark:text-black bg-black text-white font-semibold"
          >
            <Link href="#signup" onClick={(e) => scrollToSignup(e, formRef)}>
              Join the Waitlist
              {/* <ArrowCircleDownIcon className="group-hover:scale-105 w-8 h-8 transition-all duration-200" /> */}
            </Link>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  )
}
