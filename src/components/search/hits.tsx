import React, {FunctionComponent} from 'react'
import {isEmpty} from 'lodash'
import {connectHits} from 'react-instantsearch-dom'
import HitComponent from './components/hit'
import {useViewer} from 'context/viewer-context'
import {loadUserCompletedCourses} from 'lib/users'
import {useQuery} from '@tanstack/react-query'

const useUserCompletedCourses = (viewerId: number) => {
  return useQuery(['completeCourses'], async () => {
    if (viewerId) {
      const {completeCourses} = await loadUserCompletedCourses()
      return completeCourses
    }
  })
}

type CustomHitsProps = {
  hits: any[]
}

const CustomHits: FunctionComponent<CustomHitsProps> = ({hits}) => {
  const {viewer} = useViewer()
  const viewerId = viewer?.id
  const {data: completeCourseData} = useUserCompletedCourses(viewerId)

  const completedCoursesIds =
    !isEmpty(completeCourseData) &&
    completeCourseData.map((course: any) => course.collection.id)
  return (
    <div className="grid grid-col-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-max gap-3 p-3">
      {hits.map((hit) => {
        return (
          <HitComponent
            key={hit.objectID}
            hit={hit}
            completedCoursesIds={completedCoursesIds}
          />
        )
      })}
    </div>
  )
}

const Hits = connectHits(CustomHits)

export default Hits
