import sortingHatData, {SurveyQuestion} from 'data/sorting-hat'
import {CIOSubscriber} from 'hooks/use-cio'
import {track} from 'utils/analytics'
import {isEmpty} from 'lodash'

const DEFAULT_FIRST_QUESTION = `biggest_path`
const DEFAULT_FINAL_QUESTION = `thanks`

export type SortingHatState = {
  subscriber?: CIOSubscriber
  question?: SurveyQuestion
  data: any
  currentQuestionKey: string
  answers: any
  closed: boolean
  surveyTitle: string
}

export type SortingHatAction =
  | {type: 'load'; subscriber?: CIOSubscriber; loadingSubscriber: boolean}
  | {type: 'answered'; answer: any}
  | {type: 'closed'}
  | {type: 'dismiss'}

export const sortingHatInitialState: SortingHatState = {
  currentQuestionKey: DEFAULT_FIRST_QUESTION,
  answers: {},
  closed: true,
  data: sortingHatData,
  surveyTitle: 'sorting hat',
}

export const sortingHatReducer = (
  state: SortingHatState,
  action: SortingHatAction,
): SortingHatState => {
  console.debug(state, action)
  try {
    switch (action.type) {
      case `load`:
        return loadSurvey(action, state)
      case `answered`:
        return answerSurveyQuestion(action, state)
      case `closed`:
        return closeSurvey(action, state)
      case `dismiss`:
        return dismissSurvey(state)
      default:
        break
    }

    return state
  } catch (error) {
    console.error(error.message)
    track(`survey error`, {
      survey: state.surveyTitle,
      version: state.data.version,
      url: window.location.toString(),
      error: error,
      state: state,
    })
    return {...state, closed: true}
  }
}

function loadSurvey(
  action: SortingHatAction,
  state: SortingHatState,
): SortingHatState {
  console.debug(`load survey`, state)
  const question: any = state.data[state.currentQuestionKey]

  function getInitialSurveyState(subscriber: CIOSubscriber): SortingHatState {
    const surveyIncomplete = isEmpty(
      subscriber.attributes?.[
        `${state.surveyTitle.replace(' ', '_')}_finished_at`
      ],
    )
    if (surveyIncomplete) {
      return initializeSurveyState(state, subscriber, question)
    } else {
      return {...state, question, closed: true}
    }
  }

  if (action.type === 'load' && action.subscriber) {
    const {subscriber} = action
    cioIdentify(subscriber.id, state.answers, state)
    return getInitialSurveyState(subscriber)
  } else if (action.type === 'load' && !action.loadingSubscriber) {
    return {...state, question, closed: true}
  } else {
    return {...state, question} // we are waiting on the subscriber to load
  }
}

function initializeSurveyState(
  state: SortingHatState,
  subscriber: CIOSubscriber,
  question: SurveyQuestion,
) {
  console.debug(`initializeSurveyState`, state)
  const answers = {
    ...state.answers,
    ...subscriber?.attributes,
  }
  const currentQuestionKey = getNextQuestionKey(
    state.data,
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

const cioIdentify = (id: string, answers: any, state: SortingHatState) => {
  if (id) {
    window._cio.identify({
      id,
      [`${state.surveyTitle.replace(' ', '_')}_version`]: state.data.version,
      ...answers,
    })
  }
}

function answerSurveyQuestion(
  action: SortingHatAction,
  state: SortingHatState,
) {
  console.debug(`answerSurveyQuestion`, state)
  const question: any = state.data[state.currentQuestionKey]

  if (action.type !== 'answered') return state

  const {subscriber, currentQuestionKey} = state

  const answers = {
    ...state.answers,
    ...(!!action.answer && {[state.currentQuestionKey]: action.answer}),
  }

  console.debug(subscriber, answers)

  if (subscriber) {
    const attributes = getUpdatedAttributesForAnswer(
      state,
      action,
      answers,
      subscriber,
      currentQuestionKey,
    )

    const isFinal = question.final

    if (isFinal) {
      return state
    } else {
      const nextQuestionKey = getNextQuestionKey(
        state.data,
        question.next[action.answer],
        {
          ...answers,
          ...subscriber?.attributes, // answers might be persisted on the CIO subscriber
        },
      )

      return getStateForNextQuestion(
        state,
        answers,
        attributes,
        nextQuestionKey,
      )
    }
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
  state: SortingHatState,
  action: SortingHatAction,
  answers: any,
  subscriber: CIOSubscriber,
  currentQuestionKey: string,
) {
  console.debug(`getUpdatedAttributesForAnswer`, state)
  const question: any = state.data[currentQuestionKey]
  const isFinal = question.final
  const now = Math.round(Date.now() / 1000)
  let attributes = subscriber?.attributes

  if (action.type === 'answered') {
    track(`answered survey question`, {
      survey: state.surveyTitle,
      version: state.data.version,
      question: currentQuestionKey,
      answer: action.answer,
      url: window.location.toString(),
    })
  }

  if (isFinal) {
    cioIdentify(
      subscriber.id,
      {
        ...answers,
        last_surveyed_at: now,
        [`${state.surveyTitle.replace(' ', '_')}_finished_at`]: now,
      },
      state,
    )
    track(`finished survey`, {
      survey: state.surveyTitle,
      version: state.data.version,
      url: window.location.toString(),
    })
  } else {
    cioIdentify(subscriber.id, answers, state)
  }

  if (
    isEmpty(attributes?.[`${state.surveyTitle.replace(' ', '_')}_started_at`])
  ) {
    cioIdentify(
      subscriber.id,
      {
        [`${state.surveyTitle.replace(' ', '_')}_started_at`]: now,
      },
      state,
    )
    track(`started survey`, {
      survey: state.surveyTitle,
      version: state.data.version,
      url: window.location.toString(),
    })
    attributes = {
      ...attributes,
      [`${state.surveyTitle.replace(' ', '_')}_started_at`]: now,
    }
  }
  return attributes
}

function getStateForNextQuestion(
  state: SortingHatState,
  answers: any,
  attributes: any,
  nextQuestionKey: string,
) {
  console.debug(`getStateForNextQuestion`, state)
  return {
    ...state,
    answers,
    subscriber: {
      ...state.subscriber,
      ...attributes,
    },
    currentQuestionKey: nextQuestionKey,
    question: state.data[nextQuestionKey],
  }
}

function closeSurvey(action: SortingHatAction, state: SortingHatState) {
  console.debug(`closeSurvey`, state)
  const question: any = state.data[state.currentQuestionKey]
  if (state.subscriber && question.final) {
    cioIdentify(
      state.subscriber.id,
      {
        ...state.answers,
        last_surveyed_at: Math.round(Date.now() / 1000),
        [`${state.surveyTitle.replace(' ', '_')}_finished_at`]: Math.round(
          Date.now() / 1000,
        ),
      },
      state,
    )
  }
  return {...state, closed: true}
}

function dismissSurvey(state: SortingHatState) {
  console.debug(`dismissSurvey`, state)
  if (state.subscriber) {
    cioIdentify(
      state.subscriber.id,
      {
        ...state.answers,
        last_surveyed_at: Math.round(Date.now() / 1000),
        [`${state.surveyTitle.replace(' ', '_')}_finished_at`]: Math.round(
          Date.now() / 1000,
        ),
      },
      state,
    )
    track(`dismissed survey`, {
      survey: state.surveyTitle,
      version: state.data.version,
      url: window.location.toString(),
    })
  }
  return {...state, closed: true}
}
