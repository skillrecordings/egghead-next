import * as React from 'react'
import {Formik, Form, Field} from 'formik'
import {shuffle, find, reject} from 'lodash'
import {MultipleChoiceAnswer, SurveyQuestion} from '../survey-reducer'

const MultipleChoiceQuestion: React.FunctionComponent<
  React.PropsWithChildren<{
    onAnswer: (answer: string) => void
    question: SurveyQuestion
  }>
> = ({onAnswer, question}) => {
  const [choices, setChoices] = React.useState<MultipleChoiceAnswer[]>([])

  React.useEffect(() => {
    const lastChoice = find(question.choices, {always_last: true})
    let orderedChoices = question.choices || []

    if (question.random) {
      if (lastChoice) {
        orderedChoices = [
          ...shuffle(reject(question.choices, {answer: lastChoice.answer})),
          lastChoice,
        ]
      } else {
        orderedChoices = shuffle(question.choices)
      }
    } else {
      if (lastChoice) {
        orderedChoices = [
          ...reject(question.choices, {answer: lastChoice.answer}),
          lastChoice,
        ]
      }
    }

    setChoices(orderedChoices)
  }, [question])

  return (
    <div>
      <Formik
        initialValues={{}}
        onSubmit={(values: any) => {
          onAnswer(values.picked)
        }}
      >
        {({setValues, submitForm}) => {
          return (
            <Form>
              <div id="question-set">Choose one:</div>
              <div role="group" aria-labelledby="question-set">
                <ul className="list-none">
                  {choices.map((choice: MultipleChoiceAnswer) => {
                    return (
                      <li key={choice.answer} className="w-full py-2">
                        <label className="inline-block py-3 px-5 cursor-pointer text-center appearance-none transition duration-150 w-full ease-in-out bg-blue-500 hover:bg-blue-700 text-white font-semibold rounded-lg">
                          <Field
                            type="radio"
                            name="picked"
                            value={choice.answer}
                            className="appearance-none hidden"
                            onChange={() => {
                              setValues({picked: choice.answer})
                              submitForm()
                            }}
                          />
                          {choice.label}
                        </label>
                      </li>
                    )
                  })}
                  {question.other && (
                    <li className="w-full py-2">
                      <label className="inline-block py-3 px-5 cursor-pointer text-center appearance-none transition duration-150 w-full ease-in-out font-semibold rounded-lg">
                        <Field
                          type="radio"
                          name="picked"
                          value="other"
                          className="appearance-none hidden"
                          onChange={() => {
                            setValues({picked: 'other'})
                            submitForm()
                          }}
                        />
                        {question.other_label}
                      </label>
                    </li>
                  )}
                </ul>
              </div>
            </Form>
          )
        }}
      </Formik>
    </div>
  )
}

export default MultipleChoiceQuestion
