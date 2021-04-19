import * as React from 'react'
import SearchInstructorEssential from '../instructor-essential'
import ChrisBiscardiPageData from './chris-biscardi-page-data'
import ResourceCta from 'components/search/instructors/resource-cta'
import find from 'lodash/find'

export default function SearchChrisBiscardi({instructor}: {instructor: any}) {
  const instructorData: any = find(ChrisBiscardiPageData, {
    id: 'instructor-data',
  })

  const combinedInstructor = {...instructor, ...instructorData}

  return (
    <SearchInstructorEssential
      instructor={combinedInstructor}
      CTAComponent={<ResourceCta instructorData={instructorData} />}
    />
  )
}
