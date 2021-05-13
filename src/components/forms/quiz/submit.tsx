import Spinner from 'components/spinner'
import React from 'react'

const SubmitButton: React.FC<{
  isAnswered: boolean
  isSubmitting: boolean
}> = ({isAnswered, isSubmitting}) => {
  return (
    <button
      type="submit"
      disabled={isAnswered}
      className={`text-white inline-flex items-center px-6 py-3 text-lg leading-6 font-semibold tracking-tight rounded-full border-none bg-indigo-600 hover:bg-indigo-800 hover:shadow-xl active:bg-cool-gray-700 transition hover:scale-105 transform ease-in-out duration-300 shadow-xl ${
        isAnswered ? 'cursor-not-allowed' : 'cursor-pointer'
      }
      `}
    >
      {isSubmitting ? <Spinner className="w-6 h-6" /> : 'Submit'}
    </button>
  )
}

export default SubmitButton
