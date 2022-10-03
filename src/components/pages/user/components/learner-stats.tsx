import * as React from 'react'

import {convertMintoHours} from 'utils/time-utils'
import Spinner from 'components/spinner'

type LearnerStatsData = {
  completedCourseCount: number
  completedLessonCount: number
  minutesWatched: number
}

const LearnerStats: React.FC<{
  learnerStatsData: LearnerStatsData
  learnerStatsStatus: 'loading' | 'success' | 'error'
}> = ({learnerStatsData, learnerStatsStatus}) => {
  return (
    <>
      {learnerStatsStatus === 'loading' ? (
        <div className="relative flex justify-center">
          <Spinner className="w-6 h-6 text-gray-600" />
        </div>
      ) : (
        <div>
          {learnerStatsStatus === 'error' ? (
            <span>There was an error fetching stats</span>
          ) : (
            <dl className="sm:grid sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-200 dark:divide-gray-700 -mx-4">
              <div className="flex flex-col text-center pb-5 sm:py-4">
                <dt className="order-2 mt-2 lg:mt-3 text-sm lg:text-base font-medium text-gray-600 dark:text-white leading-none uppercase">
                  Watched
                </dt>
                <dd className="order-1 text-4xl lg:text-5xl font-bold tracking-tight text-blue-600 leading-none">
                  {convertMintoHours(learnerStatsData.minutesWatched)}
                </dd>
              </div>
              <div className="flex flex-col text-center py-5 sm:py-4">
                <dt className="order-2 mt-2 lg:mt-3 text-sm lg:text-base font-medium text-gray-600 dark:text-white leading-none uppercase">
                  Courses completed
                </dt>
                <dd className="order-1 text-4xl lg:text-5xl font-bold tracking-tight text-blue-600 leading-none">
                  {learnerStatsData.completedCourseCount}
                </dd>
              </div>
              <div className="flex flex-col text-center pt-5 sm:py-4">
                <dt className="order-2 mt-2 lg:mt-3 text-sm lg:text-base font-medium text-gray-600 dark:text-white leading-none uppercase">
                  Lessons completed
                </dt>
                <dd className="order-1 text-4xl lg:text-5xl font-bold tracking-tight text-blue-600 leading-none">
                  {learnerStatsData.completedLessonCount}
                </dd>
              </div>
            </dl>
          )}
        </div>
      )}
    </>
  )
}

export default LearnerStats
