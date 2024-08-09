import * as React from 'react'
import {FunctionComponent} from 'react'
import ColoredBackground from './select-plan-new/assets/colored-background'
import {twMerge} from 'tailwind-merge' // Import tailwind-merge
import Image from 'next/image'

interface PricingCardProps {
  children: React.ReactNode
  className?: string // Add className prop
  displayBackground?: boolean
  displayImage?: boolean
}

const PricingCard: FunctionComponent<PricingCardProps> = ({
  children,
  className, // Destructure className
  displayBackground = false,
  displayImage = false,
}: PricingCardProps) => {
  return (
    <div
      className={twMerge(
        'relative p-2 bg-gray-100 rounded-md shadow-lg dark:bg-gray-800 dark:shadow-none',
        className,
      )}
    >
      {displayImage && (
        <div className="block absolute left-0 z-20 scale-50 top-[-184px]">
          <Image
            src="https://res.cloudinary.com/dg3gyk0gu/image/upload/v1659039546/eggodex/basic_eggo.png"
            alt="egghead search error"
            width={350}
            height={350}
          />
        </div>
      )}
      <div className="relative z-10 flex flex-col items-center max-w-sm px-5 py-5 text-gray-900 bg-white rounded-sm dark:text-white dark:bg-gray-9000 sm:px-8 sm:py-12 h-full">
        {children}
      </div>
      {displayBackground && <ColoredBackground />}
    </div>
  )
}

export default PricingCard
