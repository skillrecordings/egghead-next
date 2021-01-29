import React from 'react'

const container = ''

export default function Callout({children, className}) {
  return (
    <div
      className={`mx-auto my-3 w-full bg-blue-100 border-l-4 overflow-hidden border-blue-300 text-blue-600 sm:px-8 px-4 py-3 rounded-sm`}
    >
      {children}
    </div>
  )
}
