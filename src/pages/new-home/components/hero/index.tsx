import * as React from 'react'
import Image from 'next/image'

const Hero: React.FunctionComponent = () => {
  return (
    <div className="container">
      <div className="flex flex-col items-center gap-8 lg:gap-10 xl:gap-20 md:flex-row">
        <div className="space-y-6 lg:space-y-8 xl:space-y-10 md:pt-6 lg:pt-10 md:w-7/12">
          <h1 className="text-xl font-extrabold leading-tight lg:leading-tighter sm:text-2xl md:text-2xl lg:text-3xl xl:text-4xl">
            Learn the best Javascript tools and frameworks from industry pros
          </h1>
          <h2 className="text-base lg:text-base xl:text-lg lg:w-3/4 text-coolGray-500">
            egghead creates high-quality video tutorials and learning resources
            for badass web developers
          </h2>
          <div className="flex flex-col flex-wrap items-center space-y-3 lg:flex-row lg:space-y-0 lg:space-x-3">
            <div className="relative w-full rounded-md shadow-sm lg:w-80">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>
              <input
                id="email"
                type="email"
                placeholder="you@company.com"
                className="block w-full py-3 pl-10 text-black placeholder-gray-400 border-gray-300 rounded-md autofill:text-fill-black focus:ring-indigo-500 focus:border-blue-500"
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
        </div>
        <div className="w-full max-w-xs md:max-w-none md:w-5/12">
          <Image
            src="https://res.cloudinary.com/dg3gyk0gu/image/upload/v1632907878/next.egghead.io/illustrations/jsarrays_landing_page_shrink.png"
            width={400}
            height={400}
            layout="responsive"
            alt=""
          />
        </div>
      </div>
    </div>
  )
}
export default Hero
