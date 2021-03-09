import * as React from 'react'
import SearchInstructorEssential from '../instructor-essential'
import FlavioCorpaPageData from './flavio-corpa-page-data'
import ResourceCta from 'components/search/instructors/resource-cta'
import find from 'lodash/find'

export default function SearchFlavioCorpa({instructor}: {instructor: any}) {
  const instructorData: any = find(FlavioCorpaPageData, {
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
