import * as React from 'react'

const CheckIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g fill="none">
      <path
        d="M5 13l4 4L19 7"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  </svg>
)

const Step = ({
  label = 'Pick a plan',
  labelClassName = '',
  circleChildren,
  circleClassName = '',
}: {
  label?: string
  circleChildren?: any
  circleClassName?: string
  labelClassName?: string
}) => {
  return (
    <div className="flex flex-col items-center space-y-1">
      <div
        className={`sm:w-10 sm:h-10 w-8 h-8 sm:text-base text-sm rounded-full flex items-center justify-center p-2 ${circleClassName}`}
      >
        {circleChildren}
      </div>
      <div
        className={`sm:text-sm text-xs font-medium sm:w-32 w-24 leading-tighter ${labelClassName}`}
      >
        {label}
      </div>
    </div>
  )
}

const Stepper = () => {
  return (
    <div className="flex -space-x-8 text-center">
      <Step
        label="Pick a plan"
        labelClassName="dark:text-emerald-500 text-emerald-600"
        circleChildren={<CheckIcon />}
        circleClassName="bg-emerald-500 text-white"
      />
      <div className="h-px py-px flex sm:w-24 w-16 bg-emerald-500 rounded-full sm:mt-5 mt-4" />
      <Step
        label="Account creation"
        circleChildren={'2'}
        circleClassName="dark:text-white text-gray-900 border-2 dark:border-white border-gray-900"
      />
      <div className="h-px py-px flex sm:w-24 w-16 dark:bg-gray-500 bg-gray-300 rounded-full sm:mt-5 mt-4" />
      <Step
        label="Payment"
        circleChildren={'3'}
        circleClassName="dark:text-gray-300 text-gray-900 dark:bg-gray-500 bg-gray-200"
        labelClassName="dark:text-gray-400 text-gray-500"
      />
    </div>
  )
}

export default Stepper
