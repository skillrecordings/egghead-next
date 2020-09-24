import React from 'react'

const Card = ({header, children}) => {
  return (
    <div className=" bg-white shadow-lg px-6 py-5 border-b border-gray-300 sm:px-8">
      <h3 class="prose-reset font-medium text-gray-900 border-b border-cool-gray-500 pb-4">
        {header}
      </h3>
      <div>{children}</div>
    </div>
  )
}

export default Card
