import React from 'react'

const HeaderCard = ({header, children}) => {
  return (
    <div className="bg-white shadow-md p-6 pb-8 border-b border-gray-300 sm:px-8 border border-gray-100 rounded-md m-6 border-t-4">
      <h3 className="font-medium text-3xl text-extrabold text-gray-900 border-b border-cool-gray-500 pb-4 mb-6">
        {header}
      </h3>
      <div className="text-xl text-gray-800 p-4 leading-relaxed">
        {children}
      </div>
    </div>
  )
}

export default HeaderCard
