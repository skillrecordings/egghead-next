import * as React from 'react'
import SearchInstructorEssential from '../instructor-essential'
import JohnLindquistPageData from './john-lindquist-page-data'
import SimpleScriptsCTA from './simple-scripts-cta'
import find from 'lodash/find'

export default function SearchJohnLindquist({instructor}: {instructor: any}) {
  const instructorData: any = find(JohnLindquistPageData, {
    id: 'instructor-data',
  })

  const combinedInstructor = {...instructor, ...instructorData}

  return (
    <SearchInstructorEssential
      instructor={combinedInstructor}
      CTAComponent={<SimpleScriptsCTA instructorData={instructorData} />}
    />
  )
}
