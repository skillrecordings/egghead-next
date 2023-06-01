import * as React from 'react'
import {isEmpty} from 'lodash'

import InProgressResource from 'components/pages/users/dashboard/activity/in-progress-resource'
import Spinner from 'components/spinner'

const ConnectionToGithub: React.FC<{
  continueLearningData: any
  continueLearningStatus: 'loading' | 'success' | 'error'
}> = ({continueLearningData = [], continueLearningStatus}) => {
  return (
    <>
      {continueLearningStatus === 'loading' ? (
        <div className="relative flex justify-center">
          <Spinner className="w-6 h-6 text-gray-600" />
        </div>
      ) : continueLearningStatus === 'error' ? (
        <span>There was an error fetching stats</span>
      ) : isEmpty(continueLearningData) ? (
        <span>You don't have any progress yet</span>
      ) : (
        continueLearningData.map((item: any) => {
          return (
            <InProgressResource
              key={item.collection.title}
              resource={item.collection}
            />
          )
        })
      )}
    </>
  )
}

export default ConnectionToGithub
