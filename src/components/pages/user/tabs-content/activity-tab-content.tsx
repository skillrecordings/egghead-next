import * as React from 'react'
import {useQuery} from '@tanstack/react-query'

import {useViewer} from 'context/viewer-context'
import {loadUserProgress, loadUserCompletedCourses} from 'lib/users'
import {
  CompletedCourses,
  ContinueLearning,
  LearnerStats,
} from 'components/pages/user/components'
import {ItemWrapper} from 'components/pages/user/components/widget-wrapper'

const useProgressForUser = (viewerId: number) => {
  return useQuery(['progress'], async () => {
    if (viewerId) {
      const {
        progress: {data},
        completionStats,
      } = await loadUserProgress(viewerId)

      return {
        progress: data.filter((p: any) => !p.is_complete),
        completionStats,
      }
    }
  })
}

const useUserCompletedCourses = (viewerId: number) => {
  return useQuery(['completeCourses'], async () => {
    if (viewerId) {
      const {completeCourses} = await loadUserCompletedCourses()
      return completeCourses
    }
  })
}

const ActivityTabContent: React.FC<any> = () => {
  const {viewer, authToken} = useViewer()
  const viewerId = viewer?.id
  const {status: progressStatus, data: progressData} =
    useProgressForUser(viewerId)
  const {
    status: completedCourseStatus,
    data: completeCourseData,
    error: completeCourseError,
  } = useUserCompletedCourses(viewerId)
  return (
    <div className="space-y-10 md:space-y-14 xl:space-y-16">
      <ItemWrapper title="Learner Stats">
        <LearnerStats
          learnerStatsData={progressData?.completionStats}
          learnerStatsStatus={progressStatus}
        />
      </ItemWrapper>
      <ItemWrapper title="Continue Learning">
        <ContinueLearning
          continueLearningData={progressData?.progress}
          continueLearningStatus={progressStatus}
        />
      </ItemWrapper>
      <ItemWrapper title="Completed Courses">
        <CompletedCourses
          completeCourseData={completeCourseData}
          completedCourseStatus={completedCourseStatus}
        />
      </ItemWrapper>
    </div>
  )
}

export default ActivityTabContent
