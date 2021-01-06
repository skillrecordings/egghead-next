import React from 'react'

const Card = ({children}) => {
  return (
    <div className="prose-reset max-w-2xl rounded shadow px-8 py-6 flex flex-col text-left border border-gray-200">
      {children}
    </div>
  )
}

export default Card
