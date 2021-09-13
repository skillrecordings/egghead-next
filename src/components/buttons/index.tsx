import React from 'react'

export function PrimaryButton({className = '', children}) {
  return (
    <button
      className={`${className} inline-flex justify-center items-center px-4 py-2 rounded-md bg-blue-600 text-white font-medium transition-all hover:bg-blue-800 ease-in-out duration-200`}
    >
      {children}
    </button>
  )
}

export function SecondaryButton({className = '', children}) {
  return (
    <button
      className={`${className} inline-flex justify-center items-center px-4 py-2 rounded-md bg-blue-600 text-white font-medium transition-all hover:bg-blue-800 ease-in-out duration-200`}
    >
      {children}
    </button>
  )
}
