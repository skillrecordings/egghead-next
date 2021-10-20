import * as React from 'react'

const CreateAccount: React.FunctionComponent = () => {
  return (
    <div className="flex flex-col space-y-3 lg:flex-row lg:space-y-0 lg:space-x-3">
      <div className="relative flex items-center w-full lg:w-80">
        <svg
          className="absolute w-5 h-5 text-gray-400 z-[-1] left-3"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
        </svg>
        <input
          id="email"
          type="email"
          placeholder="you@company.com"
          className="block w-full py-3 pl-10 text-black placeholder-gray-400 bg-transparent border-gray-300 rounded-md shadow-sm autofill:text-fill-black focus:ring-indigo-500 focus:border-blue-500"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full px-5 py-3 font-semibold text-white transition-all duration-150 ease-in-out bg-blue-600 rounded-md lg:w-auto hover:bg-blue-700 active:bg-blue-800 hover:shadow-sm"
      >
        Create a free account
      </button>
    </div>
  )
}
export default CreateAccount
