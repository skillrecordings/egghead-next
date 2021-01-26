import React from 'react'

export default function CheatSheet({title, children}) {
  return (
    <div className="bg-white shadow-md p-6 border-gray-300 sm:px-8 border border-gray-100 rounded-md m-6">
      <details>
        <summary className="font-medium text-xl text-extrabold text-gray-900">
          {title}
        </summary>
        <p className="prose dark:prose-dark text-lg text-gray-800 mt-0 p-4 leading-relaxed">
          {children}
        </p>
      </details>
    </div>
  )
}
