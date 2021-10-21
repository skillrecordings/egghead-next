import * as React from 'react'
import Image from 'next/image'

import CreateAccount from '../create-account'

const Hero: React.FunctionComponent = () => {
  return (
    <div className="container">
      <div className="flex flex-col-reverse items-center gap-8 lg:gap-10 xl:gap-20 md:flex-row">
        <div className="space-y-6 lg:space-y-8 xl:space-y-10 md:pt-6 lg:pt-10 md:w-7/12">
          <h1 className="text-xl font-extrabold leading-tight lg:leading-tighter sm:text-2xl md:text-2xl lg:text-3xl xl:text-4xl">
            Learn the best Javascript tools and frameworks from industry pros
          </h1>
          <h3 className="text-md lg:text-lg lg:w-3/4 text-gray-600 dark:text-gray-300">
            egghead creates high-quality video tutorials and learning resources
            for badass web developers
          </h3>
          <CreateAccount />
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
