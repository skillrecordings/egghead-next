import * as React from 'react'
import ExternalTrackedLink from 'components/external-tracked-link'

const ScriptKitBadge = ({className}: any) => {
  return (
    <svg
      width="60"
      height="60"
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="60" height="60" rx="8" fill="currentColor" />
      <path
        d="M30.402 27.9586C31.7353 28.7284 31.7353 30.6529 30.402 31.4227L16.9174 39.208C15.5841 39.9778 13.9174 39.0155 13.9174 37.4759L13.9174 21.9053C13.9174 20.3657 15.5841 19.4035 16.9174 20.1733L30.402 27.9586Z"
        fill="black"
      />
      <rect
        x="28.4535"
        y="37.7319"
        width="17.9381"
        height="3.09278"
        rx="1.54639"
        fill="black"
      />
    </svg>
  )
}

const ScriptKitCTA = ({instructorData}: any) => {
  return (
    <ExternalTrackedLink
      params={{
        location: instructorData.location,
      }}
      href={instructorData.ctaLink}
      eventName="clicked script kit banner"
      className="group block md:col-span-4 w-full h-full overflow-hidden bg-yellow-300 transition-all ease-in-out duration-300 text-center shadow-sm"
    >
      <div className="flex flex-col items-center text-black h-full">
        <div className="flex flex-col h-full justify-between p-8 items-center">
          <div className="flex flex-col items-center">
            <ScriptKitBadge className="text-white" />
            <h2 className="sm:text-2xl text-2xl font-bold min-w-full mt-10 mb-2 leading-tighter">
              Script Kit
            </h2>
            <p className="text-gray-800 px-4 mx-auto">
              Making scripts easy to run, write, and share
            </p>
          </div>
          <div className="w-full bg-gray-900 font-bold py-4 mx-auto rounded-md text-white sm:mt-0 mt-10 group-hover:scale-105 transition-all ease-in-out duration-300">
            Get Superpowers
          </div>
        </div>
      </div>
    </ExternalTrackedLink>
  )
}

export default ScriptKitCTA
