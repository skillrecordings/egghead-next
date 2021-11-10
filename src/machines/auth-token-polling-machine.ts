import {createMachine, assign} from 'xstate'

type DoneEventObject = import('xstate').DoneEventObject

type Event = DoneEventObject & {
  type: 'UPDATE_SESSION_ID'
  stripeCheckoutSessionId: string
}

interface Context {
  stripeCheckoutSessionId?: string
  authToken?: string
  pollingCount: number
}

const POLLING_LIMIT = 5

export const authTokenPollingMachine = createMachine<Context, Event>(
  {
    initial: 'pending',
    context: {
      stripeCheckoutSessionId: undefined,
      authToken: undefined,
      pollingCount: 0,
    },
    states: {
      pending: {
        on: {
          UPDATE_SESSION_ID: {
            actions: assign({
              stripeCheckoutSessionId: (_context, event) => {
                return event.stripeCheckoutSessionId
              },
            }),
          },
        },
        initial: 'polling',
        states: {
          polling: {
            entry: 'increasePollingCount',
            invoke: {
              src: 'requestAuthToken',
              onDone: {
                target: 'verifyRetrieval',
                actions: ['assignAuthToken'],
              },
              onError: {
                target: 'scheduleNextPoll',
              },
            },
          },
          scheduleNextPoll: {
            after: {
              WAIT_BETWEEN_POLLS: [
                {target: 'polling', cond: 'pollingLimitNotExceeded'},
                {target: '#pollingExpired'},
              ],
            },
          },
          verifyRetrieval: {
            always: [
              {target: 'scheduleNextPoll', cond: 'authTokenNotSet'},
              {
                target: '#authTokenRetrieved',
                cond: (context) => context.pollingCount >= 3,
              },
            ],
            // if the authToken was immediately found, delay for a couple
            // seconds so that the UI doesn't flash.
            after: {
              4000: {
                target: '#authTokenRetrieved',
              },
            },
          },
        },
      },
      authTokenRetrieved: {
        id: 'authTokenRetrieved',
        type: 'final',
      },
      pollingExpired: {
        id: 'pollingExpired',
        type: 'final',
      },
    },
  },
  {
    actions: {
      assignAuthToken: assign({
        authToken: (_, event) => {
          return event.data?.authToken
        },
      }),
      increasePollingCount: assign({
        pollingCount: (context) => {
          return context.pollingCount + 1
        },
      }),
    },
    guards: {
      pollingLimitNotExceeded: (context) => {
        return context.pollingCount < POLLING_LIMIT
      },
      authTokenNotSet: (context) => {
        // if it is a string, then it _is_ set, return false
        // otherwise, return true
        return typeof context.authToken !== 'string'
      },
    },
    delays: {
      WAIT_BETWEEN_POLLS: 2000,
    },
  },
)
