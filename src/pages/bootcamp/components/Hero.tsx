'use client'
import Link from 'next/link'
import {motion, AnimatePresence} from 'framer-motion'
import {fadeInUp, scaleIn} from './animations'
import {useState, useEffect} from 'react'
import '../styles.css'
import {ArrowCircleDownIcon} from '@heroicons/react/solid'
import {useTheme} from 'next-themes'
import {cn} from '@/ui/utils'

const phrases = [
  'Level Up Your Skills With',
  'Join Our AI Deep Dive Using',
  'Master Real-World Apps With',
  'Transform Projects Using',
  'Start Your AI Journey With',
  'Join Our Hands-On Lab Using',
  'Build Production Apps With',
  'Power Your Future Using',
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

function scrollToSignup(e: React.MouseEvent<HTMLAnchorElement>) {
  e.preventDefault()
  document.querySelector('#signup')?.scrollIntoView({behavior: 'smooth'})
}

export default function Hero() {
  const {theme} = useTheme()
  const [phraseIndex, setPhraseIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setPhraseIndex((current) => (current + 1) % phrases.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="py-12 md:py-20 text-center relative overflow-hidden">
      <div
        className={cn(
          'absolute inset-0',
          theme === 'light' && 'pattern-dots-light',
          theme === 'dark' && 'pattern-dots',
        )}
      />
      <motion.div {...scaleIn} className="relative max-w-4xl mx-auto px-4">
        <motion.h1
          {...fadeInUp}
          className="relative mb-6 text-4xl font-extrabold tracking-tight dark:text-white sm:text-5xl md:text-6xl leading-tight"
        >
          <span className="relative h-[1.2em] block mb-2">
            <AnimatePresence mode="wait">
              <AnimatedPhrase key={phraseIndex} text={phrases[phraseIndex]} />
            </AnimatePresence>
          </span>
          <span className="dark:text-gray-400 text-gray-800 drop-shadow-lg dark:drop-shadow-lg">
            AI
          </span>{' '}
          in Just{' '}
          <span className="dark:text-gray-400 text-gray-800 drop-shadow-lg dark:drop-shadow-lg">
            20 Days
          </span>
        </motion.h1>

        <motion.p
          {...fadeInUp}
          transition={{delay: 0.1}}
          className="relative mb-8 text-lg md:text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed"
        >
          Join{' '}
          <span className="text-gray-900 dark:text-white font-medium">
            John Lindquist
          </span>
          , founder of egghead.io, for an immersive, hands-on program that will
          revolutionize your dev workflow. In just{' '}
          <span className="text-gray-900 dark:text-white font-medium">
            20 days
          </span>
          , you&apos;ll master building real-world AI applications that automate
          the tedious, amplify your capabilities, and{' '}
          <span className="text-gray-900 dark:text-white font-medium">
            transform how your team ships software
          </span>
          .
        </motion.p>

        <motion.div
          {...fadeInUp}
          transition={{delay: 0.3, type: 'spring', stiffness: 200}}
          className="relative"
        >
          <Link
            href="#signup"
            onClick={scrollToSignup}
            className="group flex flex-col items-center justify-center w-fit mx-auto hover:cursor-pointer"
          >
            <p className="relative inline-flex items-center justify-center rounded-md bg-[var(--accent-9)] px-8 py-3 text-base font-semibold text-black dark:text-white transition-all duration-200 group-hover:bg-[var(--accent-10)] group-hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[var(--accent-9)] focus:ring-offset-2 focus:ring-offset-gray-900">
              Join the Waitlist
            </p>
            <ArrowCircleDownIcon className="group-hover:scale-105 w-8 h-8 transition-all duration-200" />
          </Link>
        </motion.div>
      </motion.div>
    </section>
  )
}