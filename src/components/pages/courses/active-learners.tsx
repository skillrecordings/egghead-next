import * as React from 'react'
import {useViewer} from '../../../context/viewer-context'
import {useCoursePresence} from '../../../hooks/use-course-presence'
import {take} from 'lodash'

const ActiveLearners: React.FC<{courseSlug: string}> = ({courseSlug}) => {
  const {viewer} = useViewer()
  const activeLearners = useCoursePresence(courseSlug)
  const filteredActiveLearners = activeLearners.filter((learner) => {
    return learner.avatar_url && learner.avatar_url !== viewer?.avatar_url
  })
  return (
    <div className="flex flex-row space-x-3 text-sm opacity-80 md:items-start pt-3 min-h-64">
      {filteredActiveLearners.length > 0 && (
        <div className="flex items-center align-middle space-x-3">
          <div className="flex -space-x-3 overflow-hidden">
            {take(
              filteredActiveLearners.map((learner: any) => {
                return (
                  <div key={learner.avatar_url}>
                    <img
                      className="inline-block h-6 w-6 rounded-full "
                      src={learner.avatar_url}
                      alt="avatar"
                    />
                  </div>
                )
              }),
              6,
            )}
          </div>
          <div>{filteredActiveLearners.length} learners are watching</div>
        </div>
      )}
    </div>
  )
}

export default ActiveLearners
