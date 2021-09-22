/**
 * @jest-environment jsdom
 */

import {cioIdentify} from 'utils/cio-identify'
import {surveyReducer, sortingHatInitialState} from './survey-reducer'
import {track} from 'utils/analytics'

jest.mock('utils/cio-identify', () => ({
  cioIdentify: jest.fn(() => null),
}))

jest.mock('utils/analytics', () => ({
  track: jest.fn(),
}))

const defaultFirstQuestion =
  sortingHatInitialState.data[sortingHatInitialState.currentQuestionKey]

describe('empty action', () => {
  test('should return the initial state', () => {
    const initialState = surveyReducer(sortingHatInitialState, {})

    expect(initialState).toStrictEqual(sortingHatInitialState)
  })
})

describe('load action', () => {
  test('load action closes survey after subscriber has finished loading and is undefined', () => {
    const finishedLoadingState = surveyReducer(sortingHatInitialState, {
      type: 'load',
      loadingSubscriber: 'false',
    })

    const closedSurveyState = {
      ...sortingHatInitialState,
      question: defaultFirstQuestion,
      closed: true,
    }

    expect(finishedLoadingState).toStrictEqual(closedSurveyState)
  })

  test('load action adds question property to state while loading subscriber', () => {
    const loadingSubscriberState = surveyReducer(sortingHatInitialState, {
      type: 'load',
      loadingSubscriber: 'true',
    })

    const firstQuestionLoadedState = {
      ...sortingHatInitialState,
      question: defaultFirstQuestion,
    }

    expect(loadingSubscriberState).toStrictEqual(firstQuestionLoadedState)
  })

  test('load action closes survey for subscriber with survey complete', () => {
    const subscriber = {
      id: 'testCompleteSurvey',
      email: 'test@egghead.io',
      attributes: {sorting_hat_finished_at: 'today'},
    }

    const surveyCompleteState = surveyReducer(sortingHatInitialState, {
      type: 'load',
      subscriber,
      loadingSubscriber: 'false',
    })

    const closedSurveyState = {
      ...sortingHatInitialState,
      question: defaultFirstQuestion,
      closed: true,
    }

    expect(surveyCompleteState).toStrictEqual(closedSurveyState)
  })

  test('load action initializes survey state to default first question for subscriber with incomplete survey', () => {
    const subscriber = {
      id: 'testIncompleteSurvey',
      email: 'test@egghead.io',
    }

    const defaultFirstQuestionKey = sortingHatInitialState.currentQuestionKey

    const incompleteSurveyState = surveyReducer(sortingHatInitialState, {
      type: 'load',
      subscriber,
      loadingSubscriber: 'false',
    })

    const defaultFirstQuestionState = {
      ...sortingHatInitialState,
      closed: false,
      question: defaultFirstQuestion,
      subscriber,
      currentQuestionKey: defaultFirstQuestionKey,
    }

    expect(incompleteSurveyState).toStrictEqual(defaultFirstQuestionState)
  })
})

describe('answered action', () => {
  const subscriber = {
    id: 'testIncompleteSurvey',
    email: 'test@egghead.io',
  }

  // survey loaded with a subscriber who has not started the survey
  const loadedSurveyState = surveyReducer(sortingHatInitialState, {
    type: 'load',
    subscriber,
    loadingSubscriber: 'false',
  })

  test('initial state is loaded and answering first question updates state appropriately', () => {
    const nextQuestionKey = 'level_up_reason'
    const nextQuestion = sortingHatInitialState.data[nextQuestionKey]

    const answeredFirstQuestionState = surveyReducer(loadedSurveyState, {
      type: 'answered',
      answer: 'leveling_up',
    })

    const appropriateSecondQuestionState = {
      ...loadedSurveyState,
      question: nextQuestion,
      currentQuestionKey: nextQuestionKey,
      answers: {biggest_path: 'leveling_up'},
      subscriber: {
        ...subscriber,
        sorting_hat_started_at: Math.round(Date.now() / 1000),
      },
    }

    expect(answeredFirstQuestionState).toStrictEqual(
      appropriateSecondQuestionState,
    )
  })

  test('answering first question tracks that user has "answered survey question"', () => {
    // answering first question with "leveling_up" after survey loaded
    surveyReducer(loadedSurveyState, {
      type: 'answered',
      answer: 'leveling_up',
    })

    expect(track).toHaveBeenCalledWith(
      'answered survey question',
      expect.anything(),
    )
  })

  test('answering first question tracks that user has "started survey"', () => {
    // answering first question with "leveling_up" after survey loaded
    surveyReducer(loadedSurveyState, {
      type: 'answered',
      answer: 'leveling_up',
    })

    expect(track).toHaveBeenLastCalledWith('started survey', expect.anything())
  })

  test('can progress from first to final question, user answers are stored in state', () => {
    const userAnswers = {
      biggest_path: 'optimizing_code',
      optimizing_reason: 'best_practice',
    }

    // answer first question with "optimizing_code"
    const secondQuestionState = surveyReducer(loadedSurveyState, {
      type: 'answered',
      answer: 'optimizing_code',
    })
    // answer second question with "best_practice"
    const finalQuestionState = surveyReducer(secondQuestionState, {
      type: 'answered',
      answer: 'best_practice',
    })

    expect(finalQuestionState.answers).toStrictEqual(userAnswers)
  })

  test('can progress from first to final question, final question key is "thanks"', () => {
    // answer first question with "optimizing_code"
    const secondQuestionState = surveyReducer(loadedSurveyState, {
      type: 'answered',
      answer: 'optimizing_code',
    })
    // answer second question with "best_practice"
    const finalQuestionState = surveyReducer(secondQuestionState, {
      type: 'answered',
      answer: 'best_practice',
    })

    expect(finalQuestionState.currentQuestionKey).toEqual('thanks')
  })

  test('can progress from first to final question, final question should not change with new answered action', () => {
    // answer first question with "optimizing_code"
    const secondQuestionState = surveyReducer(loadedSurveyState, {
      type: 'answered',
      answer: 'optimizing_code',
    })
    // answer second question with "best_practice"
    const finalQuestionState = surveyReducer(secondQuestionState, {
      type: 'answered',
      answer: 'best_practice',
    })

    // "answered" action sent to final question
    const shouldNotChange = surveyReducer(secondQuestionState, {
      type: 'answered',
      answer: 'best_practice',
    })

    // state should not change
    expect(finalQuestionState).toStrictEqual(shouldNotChange)
  })
})

describe('closed action', () => {
  const subscriber = {
    id: 'testIncompleteSurvey',
    email: 'test@egghead.io',
  }

  // survey loaded with a subscriber who has not started the survey
  const loadedSurveyState = surveyReducer(sortingHatInitialState, {
    type: 'load',
    subscriber,
    loadingSubscriber: 'false',
  })

  test('closed action closes survey', () => {
    const closedActionState = surveyReducer(loadedSurveyState, {
      type: 'closed',
    })
    const closedSurveyState = {
      ...loadedSurveyState,
      closed: true,
    }

    expect(closedActionState).toStrictEqual(closedSurveyState)
  })

  test('calls cioIdentify when closing survey on "final" question', () => {
    // answer first question with "optimizing_code"
    const secondQuestionState = surveyReducer(loadedSurveyState, {
      type: 'answered',
      answer: 'optimizing_code',
    })
    // answer second question with "best_practice"
    const finalQuestionState = surveyReducer(secondQuestionState, {
      type: 'answered',
      answer: 'best_practice',
    })

    const numCioIdentifyCallsBefore = cioIdentify.mock.calls.length

    // survey on final question is closed
    surveyReducer(finalQuestionState, {
      type: 'closed',
    })

    const numCioIdentifyCallsAfter = cioIdentify.mock.calls.length

    expect(numCioIdentifyCallsAfter).toEqual(numCioIdentifyCallsBefore + 1)
  })
})

describe('dismiss action', () => {
  const subscriber = {
    id: 'testIncompleteSurvey',
    email: 'test@egghead.io',
  }

  // survey loaded with a subscriber who has not started the survey
  const loadedSurveyState = surveyReducer(sortingHatInitialState, {
    type: 'load',
    subscriber,
    loadingSubscriber: 'false',
  })

  test('dismiss action closes survey', () => {
    const dismissActionState = surveyReducer(loadedSurveyState, {
      type: 'dismiss',
    })

    const closedSurveyState = {
      ...loadedSurveyState,
      closed: true,
    }

    expect(dismissActionState).toStrictEqual(closedSurveyState)
  })

  test('dismissed action tracks "dismissed survey"', () => {
    expect(track).toHaveBeenLastCalledWith(
      'dismissed survey',
      expect.anything(),
    )
  })
})
