import React, {FunctionComponent} from 'react'
import {isEmpty} from 'lodash'
import {connectHits} from 'react-instantsearch-dom'
import HitComponent from './components/hit'
import {trpc} from 'trpc/trpc.client'

const useUserCompletedCourses = () => {
  const {data: completeCourseData} = trpc.progress.completedCourses.useQuery()

  return completeCourseData
}

type CustomHitsProps = {
  hits: any[]
}

const CustomHits: FunctionComponent<CustomHitsProps> = ({hits}) => {
  const {data: completeCourseData} = useUserCompletedCourses()
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
