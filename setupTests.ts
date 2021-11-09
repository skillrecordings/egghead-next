// optional: configure or set up a testing framework before each test
// if you delete this file, remove `setupFilesAfterEnv` from `jest.config.js`

// used for __tests__/testing-library.js
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect'

// source: https://discord.com/channels/795785288994652170/809564635614150686/897559009077362738
import {State} from 'xstate'

declare global {
  namespace jest {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Matchers<R> {
      /**
       *  Match wheter the XState State matches the provided value.
       */
      toMatchState(state: string | object): CustomMatcherResult
    }
  }
}

expect.extend({
  toMatchState(state: State<unknown>, value: string) {
    return {
      pass: state.matches(value),
      message: () =>
        `Expected
  "${JSON.stringify(state.value)}"
state to match
  "${JSON.stringify(value)}"`,
    }
  },
})
