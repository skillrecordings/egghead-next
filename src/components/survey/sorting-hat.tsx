import * as React from 'react'
import sortingHatData from 'data/sorting-hat'
import MultipleChoiceQuestion from './questions/multiple-choice-question'
import Image from 'next/image'
import Link from 'next/link'
import MultiLine from './questions/multi-line'
import Markdown from 'react-markdown'
import {track} from 'utils/analytics'
import useCio from 'hooks/use-cio'
import {isEmpty, get} from 'lodash'

const sortingHatInitialState = {
  loading: true,
  currentQuestion: `biggest_path`,
  answers: {},
}

// const SORTING_HAT_KEY = `egghead_sorting_hat`

const cioIdentify = (id: string, answers: any) => {
  if (id) {
    window._cio.identify({
      id,
      sorting_hat_version: sortingHatData.version,
      last_surveyed_at: Math.round(Date.now() / 1000),
      ...answers,
    })
  }
}

const sortingHatReducer = (state: any, action: any) => {
  const question: any = sortingHatData[state.currentQuestion]
  const now = Math.round(Date.now() / 1000)
  let attributes = get(action.subscriber, 'attributes', {})

  const getSavedState = () => {
    const savedState = false //localStorage.getItem(SORTING_HAT_KEY)
    if (savedState) {
      return JSON.parse(savedState)
    } else {
      return false
    }
  }
  const findCurrentQuestion = (question: string, answers: any): string => {
    if (question && answers[question]) {
      const possibleNext = sortingHatData[question].next?.[answers[question]]
      if (![answers[possibleNext]]) {
        return possibleNext
      } else {
        return findCurrentQuestion(possibleNext, answers)
      }
    } else {
      return question || 'thanks'
    }
  }
  switch (action.type) {
    case `load`:
      const savedState = getSavedState() || state

      if (action.subscriber) {
        cioIdentify(action.subscriber.id, savedState.answers)
        const answers = {
          ...savedState.answers,
          ...action.subscriber.attributes,
        }

        if (isEmpty(attributes.sorting_hat_finished_at)) {
          return {
            ...state,
            ...savedState,
            answers,
            subscriber: {
              ...action.subscriber,
              attributes,
            },
            currentQuestion: findCurrentQuestion(
              savedState.currentQuestion,
              answers,
            ),
            loading: false,
          }
        } else {
          return {closed: true}
        }
      } else if (action.loadingSubscriber === false) {
        return {
          closed: true,
          error: 'You must be logged in to take the survey!',
        }
      } else {
        return state
      }
    case `answered`:
      const isFinal = question.final

      const answers = {
        ...state.answers,
        ...state.subscriber.attributes,
        [state.currentQuestion]: action.answer,
      }

      const nextQuestion = findCurrentQuestion(
        question.next[action.answer],
        answers,
      )

      if (isEmpty(attributes.sorting_hat_started_at)) {
        cioIdentify(action.subscriber.id, {
          sorting_hat_started_at: now,
        })
        track(`started survey`, {
          survey: 'sorting hat',
          version: sortingHatData.version,
        })
        attributes = {...attributes, sorting_hat_started_at: now}
      }

      const updatedState = {...state, answers, currentQuestion: nextQuestion}

      // localStorage.setItem(SORTING_HAT_KEY, JSON.stringify(updatedState))

      if (state.subscriber) {
        track(`answered survey question`, {
          survey: 'sorting hat',
          version: sortingHatData.version,
          question: state.currentQuestion,
          answer: action.answer,
        })
        if (isFinal) {
          cioIdentify(state.subscriber.id, {
            ...answers,
            sorting_hat_finished_at: now,
          })
          track(`finished survey`, {
            survey: 'sorting hat',
            version: sortingHatData.version,
          })
        } else {
          cioIdentify(state.subscriber.id, answers)
        }
      }
      return updatedState
    case `closed`:
      if (state.subscriber && question.final) {
        cioIdentify(state.subscriber.id, {
          ...answers,
          sorting_hat_finished_at: Math.round(Date.now() / 1000),
        })
      }
      return {closed: true}
    default:
      break
  }
}

const QuestionHeading: React.FunctionComponent<{question: any}> = ({
  question,
}) => {
  return (
    <>
      <h2 className="text-xl mb-3 font-bold  text-gray-700">
        <Markdown>{question.heading}</Markdown>
      </h2>
      <h3 className="text-lg mb-4">
        <Markdown>{question.subheading}</Markdown>
      </h3>
    </>
  )
}

const SortingHat: React.FunctionComponent = () => {
  const [state, dispatch] = React.useReducer(
    sortingHatReducer,
    sortingHatInitialState,
  )
  const {subscriber, loadingSubscriber} = useCio()
  const question: any = sortingHatData[state.currentQuestion]

  React.useEffect(() => {
    dispatch({type: `load`, subscriber, loadingSubscriber})
  }, [subscriber, loadingSubscriber])

  const onAnswer = (answer?: string) => {
    if (question.final) {
      dispatch({type: 'closed'})
    } else {
      dispatch({type: 'answered', answer})
    }
  }

  return state.loading || state.closed ? null : (
    <div className="border p-6 mb-16">
      {question?.type === 'multiple-choice' && (
        <div>
          <QuestionHeading question={question} />
          <MultipleChoiceQuestion
            onAnswer={onAnswer}
            question={question}
          ></MultipleChoiceQuestion>
        </div>
      )}
      {question?.type === 'multi-line' && (
        <div>
          <QuestionHeading question={question} />
          <MultiLine question={question} onAnswer={onAnswer} />
        </div>
      )}
      {question?.type === 'cta-done' && (
        <div>
          <QuestionHeading question={question} />
          <button
            className="inline-block py-3 px-5 cursor-pointer text-center appearance-none transition duration-150 w-full ease-in-out bg-blue-500 hover:bg-blue-700 text-white font-semibold rounded-lg"
            onClick={() => onAnswer()}
          >
            {question.button_label}
          </button>
        </div>
      )}
      {question?.type === 'cta-email' && (
        <div>
          <QuestionHeading question={question} />
          <Image
            className="rounded-full"
            width={128}
            height={128}
            src={question.image}
          />
          <button
            className="inline-block py-3 px-5 cursor-pointer text-center appearance-none transition duration-150 w-full ease-in-out bg-blue-500 hover:bg-blue-700 text-white font-semibold rounded-lg"
            onClick={() => onAnswer()}
          >
            {question.button_label}
          </button>
        </div>
      )}
      {question?.type === 'cta-link' && (
        <div>
          <QuestionHeading question={question} />
          <Link href={question.url}>
            <a>{question.button_label}</a>
          </Link>
        </div>
      )}
      {question?.type === 'opt-out' && (
        <div>
          <QuestionHeading question={question} />
          <button
            className="inline-block py-3 px-5 cursor-pointer text-center appearance-none transition duration-150 w-full ease-in-out bg-blue-500 hover:bg-blue-700 text-white font-semibold rounded-lg"
            onClick={() => onAnswer()}
          >
            close
          </button>
        </div>
      )}
    </div>
  )
}

export default SortingHat
