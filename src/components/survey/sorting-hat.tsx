import * as React from 'react'
import MultipleChoiceQuestion from './questions/multiple-choice-question'
import Image from 'next/image'
import Link from 'next/link'
import MultiLine from './questions/multi-line'
import Markdown from 'react-markdown'
import useCio from 'hooks/use-cio'
import {sortingHatInitialState, sortingHatReducer} from './sorting-hat-reducer'
import {SurveyQuestion} from 'data/sorting-hat'
import {Card} from 'components/card'

const QuestionHeading: React.FunctionComponent<{question: SurveyQuestion}> = ({
  question,
}) => {
  return (
    <>
      <h2 className="text-xl mb-3 font-bold dark:text-gray-100 text-gray-700">
        <Markdown>{question.heading}</Markdown>
      </h2>
      <h3 className="text-lg mb-4">
        <Markdown>{question.subheading}</Markdown>
      </h3>
    </>
  )
}

const SortingHat: React.FunctionComponent<{
  className?: any
  alternative?: JSX.Element
}> = ({className, alternative}) => {
  const [state, dispatch] = React.useReducer(
    sortingHatReducer,
    sortingHatInitialState,
  )
  const {subscriber, loadingSubscriber} = useCio()

  React.useEffect(() => {
    dispatch({type: `load`, subscriber, loadingSubscriber})
  }, [subscriber, loadingSubscriber])

  const onAnswer = (answer?: string) => {
    if (!state.question || state.question.final) {
      dispatch({type: 'closed'})
    } else {
      dispatch({type: 'answered', answer})
    }
  }

  className = className || `border p-6 mb-16`

  return !state.question || state.closed ? (
    alternative || null
  ) : (
    <Card>
      <div className={className}>
        {state.question.type === 'multiple-choice' && (
          <div>
            <QuestionHeading question={state.question} />
            <MultipleChoiceQuestion
              onAnswer={onAnswer}
              question={state.question}
            />
          </div>
        )}
        {state.question.type === 'multi-line' && (
          <div>
            <QuestionHeading question={state.question} />
            <MultiLine question={state.question} onAnswer={onAnswer} />
          </div>
        )}
        {state.question.type === 'cta-done' && (
          <div>
            <QuestionHeading question={state.question} />
            <button
              className="inline-block py-3 px-5 cursor-pointer text-center appearance-none transition duration-150 w-full ease-in-out bg-blue-500 hover:bg-blue-700 text-white font-semibold rounded-lg"
              onClick={() => onAnswer()}
            >
              {state.question.button_label}
            </button>
          </div>
        )}
        {state.question.type === 'cta-email' && (
          <div>
            <QuestionHeading question={state.question} />
            <Image
              className="rounded-full"
              width={128}
              height={128}
              src={state.question.image}
            />
            <button
              className="inline-block py-3 px-5 cursor-pointer text-center appearance-none transition duration-150 w-full ease-in-out bg-blue-500 hover:bg-blue-700 text-white font-semibold rounded-lg"
              onClick={() => onAnswer()}
            >
              {state.question.button_label}
            </button>
          </div>
        )}
        {state.question.type === 'cta-link' && (
          <div>
            <QuestionHeading question={state.question} />
            <Link href={state.question.url}>
              <a
                onClick={() => onAnswer()}
                target="_blank"
                className="inline-flex justify-center items-center px-5 py-3 rounded-md bg-blue-600 text-white transition-all hover:bg-blue-700 ease-in-out duration-200"
              >
                {state.question.button_label}
              </a>
            </Link>
          </div>
        )}
        {state.question.type === 'opt-out' && (
          <div>
            <QuestionHeading question={state.question} />
            <button
              className="inline-block py-3 px-5 cursor-pointer text-center appearance-none transition duration-150 w-full ease-in-out bg-blue-500 hover:bg-blue-700 text-white font-semibold rounded-lg"
              onClick={() => onAnswer()}
            >
              close
            </button>
          </div>
        )}
        <div className="w-100 flex items-center justify-end mt-2">
          <button
            className="rounded text-xs px-2 py-1 flex justify-center items-center dark:text-gray-900 dark:bg-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors duration-150 ease-in-out "
            onClick={() => {
              dispatch({type: 'dismiss'})
            }}
          >
            close
          </button>
        </div>
      </div>
    </Card>
  )
}

export default SortingHat
