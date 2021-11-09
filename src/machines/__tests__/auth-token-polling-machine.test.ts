import {authTokenPollingMachine} from '../auth-token-polling-machine'
import {interpret} from 'xstate'
import {SimulatedClock} from 'utils/test/simulated-clock'

function sleep(time: number) {
  return new Promise((resolve) => {
    return setTimeout(resolve, time)
  })
}

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

test('it assigns the authToken to context when received', async () => {
  const pollingService = interpret(
    authTokenPollingMachine.withConfig({
      services: {
        requestAuthToken: () => Promise.resolve({authToken: 'auth123'}),
      },
    }),
  )

  pollingService.start()

  await sleep(0)

  expect(pollingService.state.context.authToken).toEqual('auth123')

  expect(pollingService.state).toMatchState({pending: 'verifyRetrieval'})
})

test('it schedules the next poll if lookup failed', async () => {
  const requestAuthToken = jest.fn().mockRejectedValueOnce(null)

  const pollingService = interpret(
    authTokenPollingMachine.withConfig({
      services: {
        requestAuthToken,
      },
    }),
  )

  pollingService.start()

  await sleep(0)

  expect(pollingService.state).toMatchState({pending: 'scheduleNextPoll'})
})

test('polls several times for the value', async () => {
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
  )

  pollingService.start()

  // a sleep is needed to trigger the Invoked Service
  await sleep(0)

  expect(pollingService.state.context.pollingCount).toEqual(1)
  expect(pollingService.state).toMatchState({pending: 'scheduleNextPoll'})

  // both a `clock.increment` (advance the clock for the delayed transition)
  // and a sleep (trigger Invoked Service) are needed.
  clock.increment(2000)
  await sleep(0)

  expect(pollingService.state.context.pollingCount).toEqual(2)
  expect(pollingService.state).toMatchState({pending: 'scheduleNextPoll'})

  clock.increment(2000)
  await sleep(0)

  expect(pollingService.state.context.pollingCount).toEqual(3)
  expect(pollingService.state).toMatchState('authTokenRetrieved')
  expect(pollingService.state.context.authToken).toEqual('auth123')
})
