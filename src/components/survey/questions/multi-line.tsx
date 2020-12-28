import * as React from 'react'
import {Formik, Form, Field} from 'formik'

type MultilineInitialValues = {
  comment?: string
  answered?: boolean
}

const MultiLine: React.FunctionComponent<{
  onAnswer: (answer: string) => void
  question: any
}> = ({onAnswer, question}) => {
  const initialValues: MultilineInitialValues = {comment: ``, answered: false}
  return (
    <div>
      <Formik
        initialValues={initialValues}
        onSubmit={(values: any) => {
          const comment = (values.answered && values.comment) || `other`
          onAnswer(comment)
        }}
      >
        {({setValues, submitForm, values}) => {
          return (
            <Form>
              <div className="flex flex-col bg-white">
                <Field
                  className="text-grey-darkest flex-1 p-2 m-1 bg-transparent"
                  name="comment"
                  value={values.comment}
                  rows={16}
                  as="textarea"
                  onChange={(event: {target: {value: any}}) => {
                    setValues({...values, comment: event.target.value})
                  }}
                />
                <ul className="list-none">
                  <li className="w-full py-2">
                    <label className="inline-block py-3 px-5 cursor-pointer text-center appearance-none transition duration-150 w-full ease-in-out bg-blue-500 hover:bg-blue-700 text-white font-semibold rounded-lg">
                      <Field
                        type="radio"
                        name="picked"
                        value="submit"
                        className="appearance-none hidden"
                        onChange={() => {
                          setValues({...values, answered: true})
                          submitForm()
                        }}
                      />
                      Send Comments
                    </label>
                  </li>
                  <li className="w-full py-2">
                    <label className="inline-block py-3 px-5 cursor-pointer text-center appearance-none transition duration-150 w-full ease-in-out font-semibold rounded-lg">
                      <Field
                        type="radio"
                        name="picked"
                        value="other"
                        className="appearance-none hidden"
                        onChange={() => {
                          setValues({...values, answered: false})
                          submitForm()
                        }}
                      />
                      {question.other_label}
                    </label>
                  </li>
                </ul>
              </div>
            </Form>
          )
        }}
      </Formik>
    </div>
  )
}

export default MultiLine
