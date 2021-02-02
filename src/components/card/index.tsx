import * as React from 'react'

const Card: React.FC = ({children}) => {
  return (
    <div
      className={`bg-white dark:bg-gray-800 dark:text-gray-200 shadow-sm rounded-lg overflow-hidden sm:p-5 p-4`}
    >
      {children}
    </div>
  )
}

export default Card
