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
  const {completeCourses} = use(completedCoursesLoader)
  const userProgress = use(userProgressLoader)

  const completedCourseCount = completeCourses?.length ?? 0

  const learnerStatsData = {
    ...userProgress?.completionStats,
    completedCourseCount,
  }

  const coursesInProgress = userProgress?.progress.data.filter(
    (course: any) => course.is_complete === false,
  )

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
          continueLearningData={coursesInProgress}
          continueLearningStatus="success"
        />
      </ItemWrapper>
      <ItemWrapper title="Completed Courses">
        <CompletedCourses
          completeCourseData={completeCourses}
          completedCourseStatus="success"
          completedCourseCount={completedCourseCount}
        />
      </ItemWrapper>
    </div>
  )
}

export default ActivityTabContent
