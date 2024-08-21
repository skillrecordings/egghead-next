import * as React from 'react'

const PlanTitle: React.FC<React.PropsWithChildren<{className?: string}>> = ({
  children,
  className = '',
}) => (
  <h2
    className={`text-xl font-regular text-gray-900 dark:text-white ${className}`}
  >
    {children}
  </h2>
)

export default PlanTitle
