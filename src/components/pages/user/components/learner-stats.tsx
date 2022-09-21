import * as React from 'react'

import {convertMintoHours} from 'utils/time-utils'
import WidgetWrapper from 'components/pages/user/components/widget-wrapper'
import Spinner from 'components/spinner'

const LearnerStats: React.FC<any> = ({
  completionStats,
  progressStatus,
}: any) => {
  return (
    <WidgetWrapper title="Learner Stats">
      {progressStatus === 'loading' ? (
        <div className="relative flex justify-center">
          <Spinner className="w-6 h-6 text-gray-600" />
        </div>
      ) : (
        <div>
          {progressStatus === 'error' ? (
            <span>There was an error fetching stats</span>
          ) : (
            <>
              <p>
                <b>{convertMintoHours(completionStats.minutesWatched)}</b>{' '}
                watched
              </p>
              <p>
                <b>{completionStats.completedCourseCount} courses</b> completed
              </p>
              <p>
                <b>{completionStats.completedLessonCount} lessons</b> completed
              </p>
            </>
          )}
        </div>
      )}
    </WidgetWrapper>
  )
}

export default LearnerStats
