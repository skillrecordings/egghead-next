import * as React from 'react'
import FeaturesList from '../../pro-member-features'

const SelectPlan: React.FunctionComponent = ({children}) => {
  return (
    <div className="mt-8 dark:bg-gray-900 bg-white pb-16 sm:mt-12 sm:pb-20 lg:pb-28 dark:text-gray-100">
      <div className="relative">
        <div className="absolute inset-0 h-1/2"></div>
        <div className="relative max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-lg mx-auto rounded-lg shadow-lg overflow-hidden lg:max-w-none lg:flex">
            <div className="flex-1 dark:bg-gray-900 bg-white px-6 py-8 lg:p-12">
              <h3 className="text-2xl leading-8 font-extrabold dark:text-gray-100 text-gray-900 sm:text-3xl sm:leading-9">
                Annual Membership
              </h3>
              <p className="mt-6 text-base leading-6 text-gray-500 dark:text-gray-100">
                Becoming an egghead Pro Member will unlock all of the premium
                courses and content on egghead.io.
              </p>
              <div className="mt-8">
                <div className="flex items-center">
                  <h4 className="flex-shrink-0 pr-4 dark:bg-gray-900 bg-white text-sm leading-5 tracking-wider font-semibold uppercase text-indigo-600">
                    What's included
                  </h4>
                  <div className="flex-1 border-t-2 border-gray-200"></div>
                </div>
                <FeaturesList />
              </div>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SelectPlan
