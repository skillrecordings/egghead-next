import sortingHatData, {SurveyQuestion} from 'data/sorting-hat'
import {CIOSubscriber} from 'hooks/use-cio'
import {track} from 'utils/analytics'
import {isEmpty} from 'lodash'

const SORTING_HAT_FINISHED_KEY = `sorting_hat_finished_at`
const DEFAULT_FIRST_QUESTION = `biggest_path`
const DEFAULT_FINAL_QUESTION = `thanks`

type SortingHatState = {
  subscriber?: CIOSubscriber
  question?: SurveyQuestion
  currentQuestionKey: string
  answers: any
  closed: boolean
}

type SortingHatAction =
  | {type: 'load'; subscriber?: CIOSubscriber; loadingSubscriber: boolean}
  | {type: 'answered'; answer: any}
  | {type: 'closed'}
  | {type: 'dismiss'}

export const sortingHatInitialState: SortingHatState = {
  currentQuestionKey: DEFAULT_FIRST_QUESTION,
  answers: {},
  closed: true,
}

export const sortingHatReducer = (
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

function loadSurvey(
  action: SortingHatAction,
  state: SortingHatState,
): SortingHatState {
  const question: any = sortingHatData[state.currentQuestionKey]

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

function initializeSurveyState(
  state: SortingHatState,
  subscriber: CIOSubscriber,
  question: SurveyQuestion,
) {
  const answers = {
    ...state.answers,
    ...subscriber.attributes,
  }
  const currentQuestionKey = getNextQuestionKey(
    sortingHatData,
    state.currentQuestionKey,
    answers,
  )
  return {
    ...state,
    closed: false,
    question,
    subscriber,
    currentQuestionKey,
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

function answerSurveyQuestion(
  action: SortingHatAction,
  state: SortingHatState,
) {
  const question: any = sortingHatData[state.currentQuestionKey]

  if (action.type !== 'answered') return state

  const {subscriber, currentQuestionKey} = state

  const answers = {
    ...state.answers,
    ...(!!action.answer && {[state.currentQuestionKey]: action.answer}),
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
      currentQuestionKey,
    )

    return getStateForNextQuestion(state, answers, attributes, nextQuestionKey)
  } else {
    return state
  }
}

const getNextQuestionKey = (
  data: any,
  questionKey: string,
  answers: any,
): string => {
  if (questionKey && answers[questionKey]) {
    const possibleNext = data[questionKey].next?.[answers[questionKey]]
    if (![answers[possibleNext]]) {
      return possibleNext
    } else {
      return getNextQuestionKey(data, possibleNext, answers)
    }
  } else {
    return questionKey || DEFAULT_FINAL_QUESTION
  }
}

function getUpdatedAttributesForAnswer(
  action: SortingHatAction,
  answers: any,
  subscriber: CIOSubscriber,
  currentQuestionKey: string,
) {
  const question: any = sortingHatData[currentQuestionKey]
  const isFinal = question.final
  const now = Math.round(Date.now() / 1000)
  let attributes = subscriber.attributes

  if (action.type === 'answered') {
    track(`answered survey question`, {
      survey: 'sorting hat',
      version: sortingHatData.version,
      question: currentQuestionKey,
      answer: action.answer,
      url: window.location.toString(),
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
      url: window.location.toString(),
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
      url: window.location.toString(),
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
    currentQuestionKey: nextQuestionKey,
    question: sortingHatData[nextQuestionKey],
  }
}

function closeSurvey(state: SortingHatState) {
  const question: any = sortingHatData[state.currentQuestionKey]
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
      url: window.location.toString(),
    })
  }
  return {...state, closed: true}
}
