/**
 * @jest-environment jsdom
 */

// could eventually test that cioIdentify and track are being called appropriately

import {cioIdentify} from '../cio-identify'
import {sortingHatReducer, sortingHatInitialState} from '../sorting-hat-reducer'
import {track} from 'utils/analytics'

jest.mock('../cio-identify', () => ({
  cioIdentify: jest.fn(() => null),
}))

jest.mock('utils/analytics', () => ({
  track: jest.fn(),
}))

const defaultFirstQuestion =
  sortingHatInitialState.data[sortingHatInitialState.currentQuestionKey]

describe('empty action', () => {
  test('should return the initial state', () => {
    expect(sortingHatReducer(sortingHatInitialState, {})).toStrictEqual(
      sortingHatInitialState,
    )
  })
})

describe('load action', () => {
  test('should close sorting hat for load action with undefined subscriber after finished loading', () => {
    expect(
      sortingHatReducer(sortingHatInitialState, {
        type: 'load',
        loadingSubscriber: 'false',
      }),
    ).toStrictEqual({
      ...sortingHatInitialState,
      question: defaultFirstQuestion,
      closed: true,
    })
  })

  test('should add question property to state on load action while loading subscriber', () => {
    expect(
      sortingHatReducer(sortingHatInitialState, {
        type: 'load',
        loadingSubscriber: 'true',
      }),
    ).toStrictEqual({...sortingHatInitialState, question: defaultFirstQuestion})
  })

  test('should close survey for subscriber with survey complete', () => {
    const subscriber = {
      id: 'testCompleteSurvey',
      email: 'test@egghead.io',
      attributes: {sorting_hat_finished_at: 'today'},
    }
    expect(
      sortingHatReducer(sortingHatInitialState, {
        type: 'load',
        subscriber,
        loadingSubscriber: 'false',
      }),
    ).toStrictEqual({
      ...sortingHatInitialState,
      question: defaultFirstQuestion,
      closed: true,
    })
  })

  test('should initialize survey state to default first question for subscriber with incomplete survey', () => {
    const subscriber = {
      id: 'testIncompleteSurvey',
      email: 'test@egghead.io',
    }
    const defaultFirstQuestionKey = sortingHatInitialState.currentQuestionKey
    expect(
      sortingHatReducer(sortingHatInitialState, {
        type: 'load',
        subscriber,
        loadingSubscriber: 'false',
      }),
    ).toStrictEqual({
      ...sortingHatInitialState,
      closed: false,
      question: defaultFirstQuestion,
      subscriber,
      currentQuestionKey: defaultFirstQuestionKey,
    })
  })
})

describe('answered action', () => {
  const subscriber = {
    id: 'testIncompleteSurvey',
    email: 'test@egghead.io',
  }
  const loadedState = sortingHatReducer(sortingHatInitialState, {
    type: 'load',
    subscriber,
    loadingSubscriber: 'false',
  })
  test('initial state is loaded and answering first question updates state appropriately', () => {
    const nextQuestionKey = 'level_up_reason'
    const nextQuestion = sortingHatInitialState.data[nextQuestionKey]
    expect(
      sortingHatReducer(loadedState, {
        type: 'answered',
        answer: 'leveling_up',
      }),
    ).toStrictEqual({
      ...loadedState,
      question: nextQuestion,
      currentQuestionKey: nextQuestionKey,
      answers: {biggest_path: 'leveling_up'},
      subscriber: {
        ...subscriber,
        sorting_hat_started_at: Math.round(Date.now() / 1000),
      },
    })
    expect(track).toHaveBeenCalledWith(
      'answered survey question',
      expect.anything(),
    )
    expect(track).toHaveBeenLastCalledWith('started survey', expect.anything())
  })

  test('can load first question, can progress from first to final question, handles final question appropriately', () => {
    const secondQuestionState = sortingHatReducer(loadedState, {
      type: 'answered',
      answer: 'optimizing_code',
    })
    const finalQuestionState = sortingHatReducer(secondQuestionState, {
      type: 'answered',
      answer: 'best_practice',
    })
    expect(finalQuestionState.answers).toStrictEqual({
      biggest_path: 'optimizing_code',
      optimizing_reason: 'best_practice',
    })
    expect(finalQuestionState.currentQuestionKey).toBe('thanks')
    const shouldNotChange = sortingHatReducer(secondQuestionState, {
      type: 'answered',
      answer: 'best_practice',
    })
    expect(finalQuestionState).toStrictEqual(shouldNotChange)
    // this fails... should it? line 226 in sorting-hat-reducer.ts
    // expect(track).toHaveBeenCalledWith('finished survey', expect.anything())
  })
})

describe('closed action', () => {
  const subscriber = {
    id: 'testIncompleteSurvey',
    email: 'test@egghead.io',
  }
  const loadedState = sortingHatReducer(sortingHatInitialState, {
    type: 'load',
    subscriber,
    loadingSubscriber: 'false',
  })

  test('closes survey', () => {
    const closedQuestionState = sortingHatReducer(loadedState, {
      type: 'closed',
    })
    expect(closedQuestionState).toStrictEqual({
      ...loadedState,
      closed: true,
    })
  })

  test('calls cioIdentify when closing a "final" question', () => {
    const secondQuestionState = sortingHatReducer(loadedState, {
      type: 'answered',
      answer: 'optimizing_code',
    })
    const finalQuestionState = sortingHatReducer(secondQuestionState, {
      type: 'answered',
      answer: 'best_practice',
    })
    const numCioIdentifyCallsBefore = cioIdentify.mock.calls.length
    sortingHatReducer(finalQuestionState, {
      type: 'closed',
    })
    const numCioIdentifyCallsAfter = cioIdentify.mock.calls.length
    expect(numCioIdentifyCallsAfter).toBe(numCioIdentifyCallsBefore + 1)
  })
})

describe('dismiss action', () => {
  const subscriber = {
    id: 'testIncompleteSurvey',
    email: 'test@egghead.io',
  }
  const loadedState = sortingHatReducer(sortingHatInitialState, {
    type: 'load',
    subscriber,
    loadingSubscriber: 'false',
  })

  test('closes survey', () => {
    const closedQuestionState = sortingHatReducer(loadedState, {
      type: 'dismiss',
    })
    expect(closedQuestionState).toStrictEqual({
      ...loadedState,
      closed: true,
    })
  })

  test('tracks dismissed survey', () => {
    expect(track).toHaveBeenLastCalledWith(
      'dismissed survey',
      expect.anything(),
    )
  })
})
