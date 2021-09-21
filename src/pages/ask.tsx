import Survey from 'components/survey/survey'
import * as React from 'react'
import {sortingHatInitialState} from '../components/survey/survey-reducer'

const Ask: React.FunctionComponent = () => {
  return (
    <div>
      <Survey initialSurveyState={sortingHatInitialState} />
    </div>
  )
}

export default Ask
