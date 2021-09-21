import Survey from 'components/survey/survey'
import * as React from 'react'
import {SurveyState} from '../components/survey/survey-reducer'
import {testSurvey} from '../data/test-survey'

export const testSurveyInitialState: SurveyState = {
  currentQuestionKey: 'first_question',
  answers: {},
  closed: true,
  data: testSurvey,
  surveyTitle: 'test survey',
}

const Ask: React.FunctionComponent = () => {
  return (
    <div>
      <Survey initialSurveyState={testSurveyInitialState} />
    </div>
  )
}

export default Ask
