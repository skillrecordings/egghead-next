import * as React from 'react'
import SearchInstructorEssential from '../instructor-essential'
import JohnLindquistPageData from './john-lindquist-page-data'
import ExternalTrackedLink from 'components/external-tracked-link'
import find from 'lodash/find'

export default function SearchJohnLindquist({instructor}: {instructor: any}) {
  const instructorData: any = find(JohnLindquistPageData, {
    id: 'instructor-data',
  })

  const combinedInstructor = {...instructor, ...instructorData}

  const SimpleScriptsCTA: React.FC = () => (
    <ExternalTrackedLink
      params={{
        location: instructorData.location,
      }}
      href={instructorData.ctaLink}
      eventName="clicked simple scripts banner"
      className="block md:col-span-4 rounded-md w-full h-full overflow-hidden border-0 border-gray-100 bg-white relative text-center shadow-sm"
    >
      <div className="flex flex-col items-center text-black flex-shrink-0">
        <SimpleScriptsBadge className="self-center" />
        <div className="p-8">
          <div className="my-12">
            <h1 className="text-3xl font-bold min-w-full">SimpleScripts.dev</h1>
            <h2 className="text-xs uppercase text-gray-500 mt-1">
              by John Lindquist
            </h2>
          </div>
          <p className="prose sm:text-base text-sm leading-normal font-medium text-gray-800 px-4 mx-auto">
            Write and Share JavaScript to Automate the Repetitive Tasks in Your
            Day
          </p>
          <p className="bg-yellow-300 font-bold text-lg my-12 py-4 w-4/5 mx-auto rounded-md">
            Get Simple Scripts
          </p>
        </div>
      </div>
    </ExternalTrackedLink>
  )

  return (
    <SearchInstructorEssential
      instructor={combinedInstructor}
      CTAComponent={SimpleScriptsCTA}
    />
  )
}

const SimpleScriptsBadge = ({className}: any) => {
  return (
    <svg
      width="60"
      height="60"
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0 0H60V50C60 55.5228 55.5228 60 50 60H10C4.47715 60 0 55.5228 0 50V0Z"
        fill="#FFE42E"
      />
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
