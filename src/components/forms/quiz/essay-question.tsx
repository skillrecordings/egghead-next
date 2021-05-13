import * as React from 'react'
import {FunctionComponent} from 'react'
import Markdown from 'react-markdown'
import {Question, Questions} from 'types'
import useQuestion from 'hooks/use-question'
import SubmitButton from './submit'
import CompletedMessage from 'components/forms/quiz/completed-message'

const EssayQuestion: FunctionComponent<{
  question: Question
  questions: Questions
}> = ({question, questions}) => {
  const {
    formik,
    onAnswer,
    isAnswered,
    answeredCorrectly,
    isSubmitting,
  } = useQuestion(question)

  return (
    <form onSubmit={onAnswer} className="w-full">
      <fieldset>
        <legend className="lg:text-4xl sm:text-3xl text-2xl font-semibold pb-6">
          <Markdown
            className="prose sm:prose-xl prose-lg"
            children={question?.question}
          />
        </legend>
        <label>
          <span className="text-xl font-medium pb-2 inline-block text-gray-800">
            Please explain:
          </span>
          <textarea
            disabled={isAnswered}
            name="answer"
            onChange={formik.handleChange}
            rows={6}
            className="form-textarea w-full text-lg"
            placeholder=""
          />
        </label>
      </fieldset>
      {!isAnswered && (
        <div className="w-full py-5">
          {formik.errors.answer && (
            <div className="pb-5 font-medium text-lg">
              <span role="img" aria-label="Alert">
                ⚠️
              </span>{' '}
              {formik.errors.answer}
            </div>
          )}
          <SubmitButton isSubmitting={isSubmitting} isAnswered={isAnswered} />
        </div>
      )}

      {isAnswered && question?.answer && (
        <Markdown
          children={question.answer}
          className="prose sm:prose-xl prose-lg pt-5"
        />
      )}
      {isAnswered && (
        <CompletedMessage
          neutral={true}
          question={question}
          questions={questions}
        />
      )}
    </form>
  )
}

export default EssayQuestion
