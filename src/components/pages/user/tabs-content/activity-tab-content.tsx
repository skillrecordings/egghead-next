import * as React from 'react'
import {useQuery} from '@tanstack/react-query'

import {useViewer} from 'context/viewer-context'
import {loadUserProgress, loadUserCompletedCourses} from 'lib/users'
import {CompletedCourses, ContinueLearning, LearnerStats} from '../components'

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

const ActivityTabContent: React.FC<any> = () => {
  const {viewer, authToken} = useViewer()
  const viewerId = viewer?.id
  const {status: progressStatus, data: progressData} =
    useProgressForUser(viewerId)
  return (
    <div className="space-y-10">
      <LearnerStats
        completionStats={progressData?.completionStats}
        progressStatus={progressStatus}
      />
      <CompletedCourses />
      <ContinueLearning />
    </div>
  )
}

export default ActivityTabContent
