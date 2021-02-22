import * as React from 'react'
import SearchInstructorEssential from '../instructor-essential'
import JohnLindquistPageData from './john-lindquist-page-data'
import Image from 'next/image'
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
      <Image
        src={instructorData.ctaImage}
        alt={instructorData.ctaTitle}
        priority
        quality={100}
        width={417}
        height={463}
      />
    </ExternalTrackedLink>
  )

  return (
    <SearchInstructorEssential
      instructor={combinedInstructor}
      CTAComponent={SimpleScriptsCTA}
    />
  )
}
