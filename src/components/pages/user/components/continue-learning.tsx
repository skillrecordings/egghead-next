import * as React from 'react'
import {isEmpty} from 'lodash'

import InProgressResource from '@/components/pages/users/dashboard/activity/in-progress-resource'
import Spinner from '@/components/spinner'
import {ErrorBoundary} from 'react-error-boundary'

const ContinueLearning: React.FC<
  React.PropsWithChildren<{
    continueLearningData: any
    continueLearningStatus: 'loading' | 'success' | 'error'
  }>
> = ({continueLearningData = [], continueLearningStatus}) => {
  return (
    <>
      {continueLearningStatus === 'loading' ? (
        <div className="relative flex justify-center">
          <Spinner className="w-6 h-6 text-gray-600" />
        </div>
      ) : continueLearningStatus === 'error' ? (
        <span>There was an error fetching stats</span>
      ) : isEmpty(continueLearningData) ? (
        <span>You aren't learning anything right now</span>
      ) : (
        <ErrorBoundary fallback={<span>Error while loading</span>}>
          {continueLearningData.map((item: any) => {
            if (!item?.collection || !item?.collection?.title) return null
            return (
              <InProgressResource
                key={item?.collection?.title}
                resource={item?.collection}
              />
            )
          })}
        </ErrorBoundary>
      )}
    </>
  )
}

export default ContinueLearning
