import * as React from 'react'
import {FunctionComponent} from 'react'

interface PricingCardProps {
  children: React.ReactNode
}

const PricingCard: FunctionComponent<PricingCardProps> = ({
  children,
}: PricingCardProps) => {
  return (
    <div className="relative p-2 bg-gray-100 rounded-md shadow-lg dark:bg-gray-800 dark:shadow-none">
      <div className="relative z-10 flex flex-col items-center max-w-sm px-5 py-5 text-gray-900 bg-white rounded-sm dark:text-white dark:bg-gray-900 sm:px-8 sm:py-12">
        {children}
      </div>
    </div>
  )
}

export default PricingCard
