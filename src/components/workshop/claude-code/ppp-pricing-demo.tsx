import React from 'react'

const CheckIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-primary"
    >
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  )
}

interface PPPPricingDemoProps {
  basePrice: number
  discountPercentage: number
  countryName: string
}

// This component demonstrates what the PPP pricing should look like when applied
const PPPPricingDemo: React.FC<PPPPricingDemoProps> = ({
  basePrice,
  discountPercentage,
  countryName,
}) => {
  const pppPrice = (basePrice - basePrice * discountPercentage).toFixed(2)

  return (
    <div className="flex flex-col items-center justify-center gap-2 py-3">
      <div className="flex items-center justify-center gap-3">
        <p className="text-5xl font-black tracking-tight">${pppPrice}</p>
        <div className="text-center">
          <p className="text-base font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
            SAVE {discountPercentage * 100}%
          </p>
          <p className="text-lg text-gray-500 dark:text-gray-400 line-through">
            ${basePrice}
          </p>
        </div>
      </div>
      <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-2 bg-blue-50 dark:bg-blue-950/30 px-3 py-1 rounded-full">
        <CheckIcon /> Purchasing Power Parity Discount Applied ({countryName})
      </p>
    </div>
  )
}

export default PPPPricingDemo
