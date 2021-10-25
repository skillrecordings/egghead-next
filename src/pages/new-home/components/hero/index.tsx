import * as React from 'react'
import Image from 'next/image'

const Hero: React.FunctionComponent<{scrollToHandler: () => void}> = ({
  scrollToHandler,
}) => {
  return (
    <div className="container">
      <div className="flex flex-col-reverse items-center gap-8 lg:gap-10 xl:gap-20 md:flex-row">
        <div className="space-y-6 lg:space-y-8 xl:space-y-10 md:pt-6 lg:pt-10 md:w-7/12">
          <h1 className="text-xl font-extrabold leading-tight lg:leading-tighter sm:text-2xl md:text-2xl lg:text-3xl xl:text-4xl">
            Learn the best Javascript tools and frameworks from industry pros
          </h1>
          <h3 className="text-gray-600 text-md lg:text-lg lg:w-3/4 dark:text-gray-300">
            egghead creates high-quality video tutorials and learning resources
            for badass web developers
          </h3>
          <button
            type="button"
            onClick={scrollToHandler}
            className="w-full px-5 py-3 font-semibold text-white transition-all duration-150 ease-in-out bg-blue-600 rounded-md md:w-auto hover:bg-blue-700 active:bg-blue-800 hover:shadow-sm"
          >
            Create a free account
          </button>
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
