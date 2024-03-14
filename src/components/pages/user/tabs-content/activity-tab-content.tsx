'use client'
import {use} from 'react'

import {
  CompletedCourses,
  ContinueLearning,
  LearnerStats,
} from '@/components/pages/user/components'
import {ItemWrapper} from '@/components/pages/user/components/widget-wrapper'

const ActivityTabContent: React.FC<
  React.PropsWithChildren<{
    completedCoursesLoader: Promise<any>
    userProgressLoader: Promise<any>
  }>
> = ({completedCoursesLoader, userProgressLoader}) => {
  const completedCourses = use(completedCoursesLoader)
  const userProgress = use(userProgressLoader)

  const completedCourseCount = !!completedCourses?.length
    ? completedCourses?.length
    : 0
  const learnerStatsData = {
    ...userProgress?.completionStats,
    completedCourseCount,
  }

  return (
    <div className="space-y-10 md:space-y-14 xl:space-y-16">
      <ItemWrapper title="Learner Stats">
        <LearnerStats
          learnerStatsData={learnerStatsData}
          learnerStatsStatus="success"
        />
      </ItemWrapper>
      <ItemWrapper title="Continue Learning">
        <ContinueLearning
          continueLearningData={userProgress.progress.data}
          continueLearningStatus="success"
        />
      </ItemWrapper>
      <ItemWrapper title="Completed Courses">
        <CompletedCourses
          completeCourseData={completedCourses}
          completedCourseStatus="success"
          completedCourseCount={completedCourseCount}
        />
      </ItemWrapper>
    </div>
  )
}

export default ActivityTabContent
