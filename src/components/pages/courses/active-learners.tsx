import * as React from 'react'
import {useViewer} from '../../../context/viewer-context'
import {useCoursePresence} from '../../../hooks/use-course-presence'

const ActiveLearners: React.FC<{courseSlug: string}> = ({courseSlug}) => {
  const {viewer} = useViewer()
  const activeLearners = useCoursePresence(courseSlug)
  const filteredActiveLearners = activeLearners.filter((learner) => {
    return learner.avatar_url && learner.avatar_url !== viewer?.avatar_url
  })
  return (
    <div className="flex flex-row space-x-3 text-sm opacity-80 md:items-start">
      {filteredActiveLearners.length > 0 && (
        <div>
          {filteredActiveLearners.length} learners are watching this course
          right now.
          <div className="flex -space-x-1 overflow-hidden">
            {filteredActiveLearners.map((learner: any) => {
              return (
                <div>
                  <img
                    className="inline-block h-6 w-6 rounded-full "
                    src={learner.avatar_url}
                    alt="avatar"
                  />
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default ActiveLearners
