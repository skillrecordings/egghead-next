import * as React from 'react'
import sortingHatData from 'data/sorting-hat'
import MultipleChoiceQuestion from './questions/multiple-choice-question'
import Image from 'next/image'
import Link from 'next/link'
import MultiLine from './questions/multi-line'
import Markdown from 'react-markdown'
import {track} from 'utils/analytics'
import useCio, {CIOSubscriber} from 'hooks/use-cio'
import {isEmpty} from 'lodash'

const SORTING_HAT_FINISHED_KEY = `sorting_hat_finished_at`
const DEFAULT_FIRST_QUESTION = `biggest_path`
const DEFAULT_FINAL_QUESTION = `thanks`

const sortingHatInitialState: SortingHatState = {
  currentQuestion: DEFAULT_FIRST_QUESTION,
  answers: {},
  closed: true,
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

const getNextQuestionKey = (
  data: any,
  question: string,
  answers: any,
): string => {
  if (question && answers[question]) {
    const possibleNext = data[question].next?.[answers[question]]
    if (![answers[possibleNext]]) {
      return possibleNext
    } else {
      return getNextQuestionKey(data, possibleNext, answers)
    }
  } else {
    return question || DEFAULT_FINAL_QUESTION
  }
}

function initializeSurveyState(
  state: SortingHatState,
  subscriber: CIOSubscriber,
  question: any,
) {
  const currentQuestion = getNextQuestionKey(
    sortingHatData,
    state.currentQuestion,
    {
      ...state.answers,
      ...subscriber.attributes,
    },
  )
  return {
    ...state,
    closed: false,
    question,
    subscriber,
    currentQuestion,
  }
}

function getUpdatedAttributesForAnswer(
  action: SortingHatAction,
  answers: any,
  subscriber: CIOSubscriber,
  currentQuestion: string,
) {
  const question: any = sortingHatData[currentQuestion]
  const isFinal = question.final
  const now = Math.round(Date.now() / 1000)
  let attributes = subscriber.attributes

  if (action.type === 'answered') {
    track(`answered survey question`, {
      survey: 'sorting hat',
      version: sortingHatData.version,
      question: currentQuestion,
      answer: action.answer,
    })
  }

  if (isFinal) {
    cioIdentify(subscriber.id, {
      ...answers,
      last_surveyed_at: now,
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
  return attributes
}

function getStateForNextQuestion(
  state: SortingHatState,
  answers: any,
  attributes: any,
  nextQuestionKey: string,
) {
  return {
    ...state,
    answers,
    subscriber: {
      ...state.subscriber,
      ...attributes,
    },
    currentQuestion: nextQuestionKey,
    question: sortingHatData[nextQuestionKey],
  }
}

function closeSurvey(state: SortingHatState) {
  const question: any = sortingHatData[state.currentQuestion]
  if (state.subscriber && question.final) {
    cioIdentify(state.subscriber.id, {
      ...state.answers,
      last_surveyed_at: Math.round(Date.now() / 1000),
      sorting_hat_finished_at: Math.round(Date.now() / 1000),
    })
  }
  return {...state, closed: true}
}

function dismissSurvey(state: SortingHatState) {
  if (state.subscriber) {
    cioIdentify(state.subscriber.id, {
      ...state.answers,
      last_surveyed_at: Math.round(Date.now() / 1000),
      sorting_hat_finished_at: Math.round(Date.now() / 1000),
    })
    track(`dismissed survey`, {
      survey: 'sorting hat',
      version: sortingHatData.version,
    })
  }
  return {...state, closed: true}
}

function loadSurvey(
  action: SortingHatAction,
  state: SortingHatState,
): SortingHatState {
  const question: any = sortingHatData[state.currentQuestion]

  function getInitialSurveyState(subscriber: CIOSubscriber): SortingHatState {
    const surveyIncomplete = isEmpty(
      subscriber.attributes[SORTING_HAT_FINISHED_KEY],
    )
    if (surveyIncomplete) {
      return initializeSurveyState(state, subscriber, question)
    } else {
      return {...state, closed: true}
    }
  }

  if (action.type === 'load' && action.subscriber) {
    const {subscriber} = action
    cioIdentify(subscriber.id, state.answers)
    return getInitialSurveyState(subscriber)
  } else if (action.type === 'load' && !action.loadingSubscriber) {
    return {...state, closed: true}
  } else {
    return state // we are waiting on the subscriber to load
  }
}

function answerSurveyQuestion(
  action: SortingHatAction,
  state: SortingHatState,
) {
  const question: any = sortingHatData[state.currentQuestion]

  if (action.type !== 'answered') return state

  const {subscriber, currentQuestion} = state

  const answers = {
    ...state.answers,
    ...(!!action.answer && {[state.currentQuestion]: action.answer}),
  }

  if (subscriber) {
    const nextQuestionKey = getNextQuestionKey(
      sortingHatData,
      question.next[action.answer],
      {
        ...answers,
        ...subscriber.attributes, // answers might be persisted on the CIO subscriber
      },
    )
    const attributes = getUpdatedAttributesForAnswer(
      action,
      answers,
      subscriber,
      currentQuestion,
    )

    return getStateForNextQuestion(state, answers, attributes, nextQuestionKey)
  } else {
    return state
  }
}

type SortingHatState = {
  subscriber?: CIOSubscriber
  currentQuestion: string
  question?: any
  answers?: any
  closed: boolean
}

type SortingHatAction =
  | {type: 'load'; subscriber?: CIOSubscriber; loadingSubscriber: boolean}
  | {type: 'answered'; answer: any}
  | {type: 'closed'}
  | {type: 'dismiss'}

const sortingHatReducer = (
  state: SortingHatState,
  action: SortingHatAction,
): SortingHatState => {
  switch (action.type) {
    case `load`:
      return loadSurvey(action, state)
    case `answered`:
      return answerSurveyQuestion(action, state)
    case `closed`:
      return closeSurvey(state)
    case `dismiss`:
      return dismissSurvey(state)
    default:
      break
  }

  return state
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

  return !question || state.closed ? null : (
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
