import * as React from 'react'
import PoweredByStripe from '@/components/pricing/powered-by-stripe'

interface LifetimePriceCardProps {
  hidePoweredByStripe?: boolean
  containerClassName?: string
  cardClassName?: string
  children: React.ReactNode // Add children prop
}

const LifetimePriceCard: React.FC<LifetimePriceCardProps> = ({
  hidePoweredByStripe = false,
  containerClassName = '',
  cardClassName = '',
  children, // Destructure children
}) => {
  return (
    <div className={`flex flex-col items-center ${containerClassName}`}>
      <div
        className={`relative p-2 bg-gray-100 rounded-md shadow-lg dark:bg-gray-800 dark:shadow-none ${cardClassName}`}
      >
        <div
          className={`relative z-10 flex flex-col items-center max-w-sm px-5 py-5 text-gray-900 bg-white rounded-sm dark:text-white dark:bg-gray-900 sm:px-8 sm:py-12 ${cardClassName}`}
        >
          {children} {/* Render children here */}
        </div>
      </div>
      {!hidePoweredByStripe && (
        <div className="flex sm:flex-row flex-col items-center py-24 sm:space-x-5 sm:space-y-0 space-y-5">
          <PoweredByStripe />
          <div className="text-sm">30 day money back guarantee</div>
        </div>
      )}
    </div>
  )
}

export default LifetimePriceCard
