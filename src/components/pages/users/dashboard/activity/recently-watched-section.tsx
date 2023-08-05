import * as React from 'react'
import {FunctionComponent} from 'react'
import InProgressResource from './in-progress-resource'
import {Resource} from 'types'
import {filter, uniq} from 'lodash'

type RecentlyWatchedProps = {
  resources: [Resource]
}

const RecentlyWatched: FunctionComponent<
  React.PropsWithChildren<RecentlyWatchedProps>
> = ({resources}) => {
  const lessonsCompleted = uniq(
    filter(resources, {
      type: 'lesson',
      completed: true,
    }),
  )

  return (
    <div className="space-y-10">
      <div>
        <h2 className="flex text-lg items-center font-semibold space-x-1 pb-6">
          <CheckIcon />
          <span>Recently Watched</span>
        </h2>
        <div className="space-y-3">
          {lessonsCompleted.map((resource: any) => {
            return <InProgressResource resource={resource} key={resource.id} />
          })}
        </div>
      </div>
    </div>
  )
}

const CheckIcon = () => (
  <svg
    className="text-green-600"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g fill="none">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm3.707-9.293a1 1 0 0 0-1.414-1.414L9 10.586 7.707 9.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4z"
        fill="currentColor"
      />
    </g>
  </svg>
)

export default RecentlyWatched
