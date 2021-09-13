import * as React from 'react'
import {motion} from 'framer-motion'

const NewHome: React.FunctionComponent = () => {
  return (
    <div className="mt-4 sm:mt-8 mb-28 w-full">
      <section className="my-8 sm:my-16 flex flex-row justify-between items-center max-w-screen-xl mx-auto">
        <div className="w-3/5">
          <h1 className="text-4xl sm:text-6xl font-bold mb-8 leading-tighter sm:leading-tighter  text-gray-700">
            Learn the best JavaScript tools and frameworks from industry pros
          </h1>
          <h2 className="text-xl sm:leading-normal text-coolGray-600 w-3/4">
            egghead creates high-quality video tutorials and learning resources
            for badass web developers
          </h2>

          {/* email input form */}
          <form className="mt-8">
            <div className="flex flex-row items-center">
              <div className="mt-1 relative rounded-md shadow-sm w-80">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
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
                  className="text-black autofill:text-fill-black py-3 placeholder-gray-400 focus:ring-indigo-500 focus:border-blue-500 block w-full pl-10 border-gray-300 rounded-md"
                  required
                />
              </div>
              <button
                type="submit"
                className="transition-all duration-150 mt-1 ml-2 ease-in-out bg-blue-600 hover:bg-blue-700 active:bg-blue-800 hover:shadow-sm text-white font-semibold py-3 px-5 rounded-md"
              >
                Get started for free
              </button>
            </div>
          </form>
          <p className="mt-2 text-gray-400 text-sm">
            We guarantee we're 100% spam-free. Unsubscribe at any time.
          </p>
        </div>
        <img
          alt="egghead course illustration"
          src="https://via.placeholder.com/400x400"
        />
      </section>
      <TechnologyRow />
      <section className="my-12 sm:my-32">
        <h3>
          Obviously, you can pick up a new framework or a new language or a new
          platform on your own.
        </h3>
      </section>
    </div>
  )
}

export default NewHome

function TechnologyRow() {
  return (
    <section className="my-12 sm:my-32">
      <div className="flex flex-row items-center">
        {[
          {
            label: 'JavaScript',
            image: 'https://via.placeholder.com/250x250',
          },
          {
            label: 'React',
            image: 'https://via.placeholder.com/250x250',
          },
          {
            label: 'Angular',
            image: 'https://via.placeholder.com/250x250',
          },
          {
            label: 'Vue',
            image: 'https://via.placeholder.com/250x250',
          },
          {
            label: 'Node',
            image: 'https://via.placeholder.com/250x250',
          },
          {
            label: 'Gatsby',
            image: 'https://via.placeholder.com/250x250',
          },
          {
            label: 'Next.js',
            image: 'https://via.placeholder.com/250x250',
          },
          {
            label: 'Redux',
            image: 'https://via.placeholder.com/250x250',
          },
        ].map((tech, i) => {
          return (
            <div className="flex flex-col items-center mx-6">
              <img src={tech.image} alt={tech.label} className="" />
              <p>{tech.label}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
