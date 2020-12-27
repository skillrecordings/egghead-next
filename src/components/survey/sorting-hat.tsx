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

const findCurrentQuestion = (
  data: any,
  question: string,
  answers: any,
): string => {
  if (question && answers[question]) {
    const possibleNext = data[question].next?.[answers[question]]
    if (![answers[possibleNext]]) {
      return possibleNext
    } else {
      return findCurrentQuestion(data, possibleNext, answers)
    }
  } else {
    return question || 'thanks'
  }
}

const cioIdentify = (id: string, answers: any) => {
  if (id) {
    window._cio.identify({
      id,
      sorting_hat_version: sortingHatData.version,
      ...answers,
    })
  }
}

const SORTING_HAT_FINISHED_KEY = `sorting_hat_finished_at`

const sortingHatReducer = (state: any, action: any) => {
  const question: any = sortingHatData[state.currentQuestion]
  const now = Math.round(Date.now() / 1000)

  const answers = {
    ...state.answers,
    ...(!!action.answer && {[state.currentQuestion]: action.answer}),
  }

  switch (action.type) {
    case `load`:
      if (action.subscriber) {
        const {subscriber} = action
        const surveyIncomplete = isEmpty(
          subscriber.attributes[SORTING_HAT_FINISHED_KEY],
        )

        cioIdentify(subscriber.id, state.answers)

        if (surveyIncomplete) {
          const currentQuestion = findCurrentQuestion(
            sortingHatData,
            state.currentQuestion,
            {
              ...answers,
              ...subscriber.attributes,
            },
          )

          return {
            ...state,
            loading: false,
            answers,
            question,
            subscriber,
            currentQuestion,
          }
        } else {
          return {closed: true}
        }
      } else if (action.loadingSubscriber === false) {
        return {closed: true}
      } else {
        return state
      }
    case `answered`:
      const {subscriber, currentQuestion} = state
      if (subscriber) {
        const isFinal = question.final
        let attributes = get(subscriber, 'attributes', {})
        const nextQuestionKey = findCurrentQuestion(
          sortingHatData,
          question.next[action.answer],
          {
            ...answers,
            ...subscriber.attributes, // answers might be persisted on the CIO subscriber
          },
        )

        track(`answered survey question`, {
          survey: 'sorting hat',
          version: sortingHatData.version,
          question: currentQuestion,
          answer: action.answer,
        })

        if (isFinal) {
          cioIdentify(subscriber.id, {
            ...answers,
            last_surveyed_at: Math.round(Date.now() / 1000),
            sorting_hat_finished_at: now,
          })
          track(`finished survey`, {
            survey: 'sorting hat',
            version: sortingHatData.version,
          })
        } else {
          cioIdentify(subscriber.id, answers)
        }

        if (isEmpty(attributes.sorting_hat_started_at)) {
          cioIdentify(subscriber.id, {
            sorting_hat_started_at: now,
          })
          track(`started survey`, {
            survey: 'sorting hat',
            version: sortingHatData.version,
          })
          attributes = {...attributes, sorting_hat_started_at: now}
        }

        return {
          ...state,
          answers,
          subscriber: {
            ...subscriber,
            ...attributes,
          },
          currentQuestion: nextQuestionKey,
          question: sortingHatData[nextQuestionKey],
        }
      } else {
        return state
      }
    case `closed`:
      if (state.subscriber && question.final) {
        cioIdentify(state.subscriber.id, {
          ...answers,
          last_surveyed_at: Math.round(Date.now() / 1000),
          sorting_hat_finished_at: Math.round(Date.now() / 1000),
        })
      }
      return {closed: true}
    case `dismiss`:
      if (state.subscriber) {
        cioIdentify(state.subscriber.id, {
          ...answers,
          last_surveyed_at: Math.round(Date.now() / 1000),
          sorting_hat_finished_at: Math.round(Date.now() / 1000),
        })
        track(`dismissed survey`, {
          survey: 'sorting hat',
          version: sortingHatData.version,
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
  const question: any = state.question

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

  return !question || state.loading || state.closed ? null : (
    <div className="border p-6 mb-16">
      {question.type === 'multiple-choice' && (
        <div>
          <QuestionHeading question={question} />
          <MultipleChoiceQuestion onAnswer={onAnswer} question={question} />
        </div>
      )}
      {question.type === 'multi-line' && (
        <div>
          <QuestionHeading question={question} />
          <MultiLine question={question} onAnswer={onAnswer} />
        </div>
      )}
      {question.type === 'cta-done' && (
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
      {question.type === 'cta-email' && (
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
      {question.type === 'cta-link' && (
        <div>
          <QuestionHeading question={question} />
          <Link href={question.url}>
            <a>{question.button_label}</a>
          </Link>
        </div>
      )}
      {question.type === 'opt-out' && (
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
      <div className="w-100 flex items-center justify-end mt-2">
        <button
          className="rounded text-xs px-2 py-1 flex justify-center items-center bg-gray-100 hover:bg-gray-200 transition-colors duration-150 ease-in-out "
          onClick={() => {
            dispatch({type: 'dismiss'})
          }}
        >
          close
        </button>
      </div>
    </div>
  )
}

export default SortingHat
