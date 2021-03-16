import * as React from 'react'
import SearchInstructorEssential from '../instructor-essential'
import HirokoNishimuraPageData from './hiroko-nishimura-page-data'
import ResourceCta from 'components/search/instructors/resource-cta'
import find from 'lodash/find'

export default function SearchHirokoNishimura({instructor}: {instructor: any}) {
  const instructorData: any = find(HirokoNishimuraPageData, {
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
