import * as React from 'react'

import {convertMintoHours} from 'utils/time-utils'
import WidgetWrapper from 'components/pages/user/components/widget-wrapper'
import Spinner from 'components/spinner'

const LearnerStats: React.FC<any> = ({
  learnerStatsData,
  learnerStatsStatus,
}: any) => {
  return (
    <WidgetWrapper title="Learner Stats">
      {learnerStatsStatus === 'loading' ? (
        <div className="relative flex justify-center">
          <Spinner className="w-6 h-6 text-gray-600" />
        </div>
      ) : (
        <div>
          {learnerStatsStatus === 'error' ? (
            <span>There was an error fetching stats</span>
          ) : (
            <>
              <p>
                <b>{convertMintoHours(learnerStatsData.minutesWatched)}</b>{' '}
                watched
              </p>
              <p>
                <b>{learnerStatsData.completedCourseCount} courses</b> completed
              </p>
              <p>
                <b>{learnerStatsData.completedLessonCount} lessons</b> completed
              </p>
            </>
          )}
        </div>
      )}
    </WidgetWrapper>
  )
}

export default LearnerStats
