import Survey from 'components/survey/survey'
import * as React from 'react'
import {SurveyState} from '../components/survey/survey-reducer'
import {testSurvey} from '../data/test-survey'
import {trpc} from 'trpc/trpc.client'

export const testSurveyInitialState: SurveyState = {
  currentQuestionKey: 'first_question',
  answers: {},
  closed: true,
  data: testSurvey,
  surveyTitle: 'test survey',
}

const Ask: React.FunctionComponent = () => {
  const {mutate} = trpc.user.contactIdForEmail.useMutation()

  return (
    <div>
      <button
        onClick={() => {
          mutate(
            {
              email: 'joel@egghead.io',
            },
            {
              onSuccess: (data) => {
                console.log(data)
              },
            },
          )
        }}
      >
        Get The Id
      </button>
      <Survey initialSurveyState={testSurveyInitialState} />
    </div>
  )
}

export default Ask
