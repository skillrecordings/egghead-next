import * as React from 'react'
import SearchInstructorEssential from '../instructor-essential'
import LaurieBarthPageData from './laurie-barth-page-data'
import ResourceCta from './resource-cta'
import find from 'lodash/find'

export default function SearchLaurieBarth({instructor}: {instructor: any}) {
  const instructorData: any = find(LaurieBarthPageData, {
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
