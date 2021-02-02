import * as React from 'react'

const CardDetail: React.FC = ({children}) => {
  return (
    <div
      className={`uppercase font-semibold text-xs mb-1 text-gray-700 dark:text-gray-300`}
    >
      {children}
    </div>
  )
}

export default CardDetail
