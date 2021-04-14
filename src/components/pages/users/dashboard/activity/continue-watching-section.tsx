import * as React from 'react'
import {FunctionComponent} from 'react'
import InProgressResource from './in-progress-resource'
import {Resource} from 'types'
import {filter, uniq, orderBy} from 'lodash'

type ContinueWatchingProps = {
  resources: [Resource]
}

const ContinueWatching: FunctionComponent<ContinueWatchingProps> = ({
  resources,
}) => {
  const coursesInProgress = orderBy(
    uniq(
      filter(resources, {
        collection_progress: {is_completed: false},
      }),
    ),
    'collection_progress.last_lesson_watched_on',
    'desc',
  )

  return (
    <div className="space-y-10">
      <div>
        <h2 className="flex text-lg items-center font-semibold space-x-1 pb-6">
          <span>Continue Watching</span>
        </h2>
        <div className="space-y-5">
          {coursesInProgress.map((resource: any) => {
            return (
              <InProgressResource resource={resource} key={resource.id} small />
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default ContinueWatching
