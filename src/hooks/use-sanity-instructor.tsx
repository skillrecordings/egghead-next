import React from 'react'
import {loadSanityInstructor} from 'lib/instructors'

export const useSanityInstructor = (
  initialInstructor: any,
  shouldFetch: () => boolean,
) => {
  const [instructor, setInstructor] = React.useState(initialInstructor)
  const [fetched, setFetched] = React.useState(false)
  const instructorSlug = instructor?.slug

  const shouldFetchInstructor = shouldFetch()

  React.useEffect(() => {
    const fetchInstructorData = async () => {
      const data = await loadSanityInstructor(instructorSlug)
      if (data) {
        setInstructor(data)
        setFetched(true)
      }
    }
    if (shouldFetchInstructor && !fetched) {
      fetchInstructorData()
    }
  }, [instructorSlug, shouldFetchInstructor, fetched])

  return instructor
}
