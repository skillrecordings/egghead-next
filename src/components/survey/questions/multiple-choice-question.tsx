import * as React from 'react'
import {Formik, Form, Field} from 'formik'
import {shuffle} from 'lodash'

const MultipleChoiceQuestion: React.FunctionComponent<{
  onAnswer: (answer: string) => void
  question: any
}> = ({onAnswer, question}) => {
  const choices = question.random ? shuffle(question.choices) : question.choices
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
                  {choices.map((choice: any) => {
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
