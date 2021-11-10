import {authTokenPollingMachine} from '../auth-token-polling-machine'
import {interpret} from 'xstate'
import {SimulatedClock} from 'utils/test/simulated-clock'

test('it starts polling immediately', () => {
  const pollingService = interpret(
    authTokenPollingMachine.withConfig({
      services: {
        requestAuthToken: () => Promise.resolve(),
      },
    }),
  )

  pollingService.start()

  expect(pollingService.state).toMatchState({pending: 'polling'})
})

test('it invokes the requestAuthToken service', () => {
  const mockedFunc = jest.fn()

  const pollingService = interpret(
    authTokenPollingMachine.withConfig({
      services: {
        requestAuthToken: () => {
          mockedFunc()

          return Promise.resolve()
        },
      },
    }),
  )

  pollingService.start()

  expect(mockedFunc).toHaveBeenCalled()
})

test('it assigns the authToken to context when received', (done) => {
  const clock = new SimulatedClock()

  const pollingService = interpret(
    authTokenPollingMachine.withConfig({
      services: {
        requestAuthToken: () => Promise.resolve({authToken: 'auth123'}),
      },
    }),
    {clock},
  ).onTransition((state) => {
    if (state.matches({pending: 'verifyRetrieval'})) {
      clock.increment(4000)
    }

    if (state.matches('authTokenRetrieved')) {
      // eslint-disable-next-line jest/no-conditional-expect
      expect(state.context.authToken).toEqual('auth123')
      done()
    }
  })

  pollingService.start()
})

test('it schedules the next poll, then done', (done) => {
  const requestAuthToken = jest.fn().mockRejectedValueOnce(null)

  const pollingService = interpret(
    authTokenPollingMachine.withConfig({
      services: {
        requestAuthToken,
      },
    }),
  ).onTransition((state) => {
    if (state.matches({pending: 'scheduleNextPoll'})) {
      done()
    }
  })

  pollingService.start()
})

test('polls several times for the value', (done) => {
  const clock = new SimulatedClock()

  // mock a couple failed requests followed by a successful request
  const requestAuthToken = jest
    .fn()
    .mockRejectedValueOnce(null)
    .mockRejectedValueOnce(null)
    .mockResolvedValueOnce({authToken: 'auth123'})

  const pollingService = interpret(
    authTokenPollingMachine.withConfig({
      services: {
        requestAuthToken,
      },
    }),
    {clock},
  ).onTransition((state) => {
    if (state.matches({pending: 'scheduleNextPoll'})) {
      clock.increment(2000)
    }

    if (state.matches('authTokenRetrieved')) {
      // eslint-disable-next-line jest/no-conditional-expect
      expect(state.context.pollingCount).toEqual(3)
      // eslint-disable-next-line jest/no-conditional-expect
      expect(state.context.authToken).toEqual('auth123')
      done()
    }
  })

  pollingService.start()
})
