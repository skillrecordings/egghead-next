import {authTokenPollingMachine} from '../auth-token-polling-machine'
import {interpret} from 'xstate'

function sleep(time) {
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
  const pollingService = interpret(
    authTokenPollingMachine.withConfig({
      services: {
        requestAuthToken: () => Promise.reject(),
      },
    }),
  )

  pollingService.start()

  await sleep(0)

  expect(pollingService.state).toMatchState({pending: 'scheduleNextPoll'})
})
