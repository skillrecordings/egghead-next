import {Machine, assign} from 'xstate'

export type DoneEventObject = import('xstate').DoneEventObject

interface StateSchema {
  states: {
    idle: {}
    edit: {}
    loading: {}
    success: {}
    failure: {}
  }
}

export type Event =
  | {type: 'EDIT'}
  | {type: 'CANCEL'}
  | {type: 'SUBMIT'; data: {newEmail: string}}
  | DoneEventObject

export interface Context {
  newEmail?: string
  error?: string
}

const setNewEmail = assign<Context, DoneEventObject>({
  newEmail: (_, event) => {
    return event.data.newEmail
  },
})

export const requestEmailChangeMachine = Machine<Context, StateSchema, Event>({
  id: 'requestEmailChange',
  initial: 'idle',
  context: {
    newEmail: undefined,
    error: undefined,
  },
  states: {
    idle: {
      on: {EDIT: 'edit'},
    },
    edit: {
      on: {
        SUBMIT: 'loading',
        CANCEL: 'idle',
      },
    },
    loading: {
      entry: [setNewEmail],
      invoke: {
        id: 'makeEmailChangeRequest',
        src: 'requestChange',
        onDone: {
          target: 'success',
          actions: [
            assign({
              error: (_, event) => {
                return event.data.success === false
                  ? event.data.message
                  : undefined
              },
            }),
          ],
        },
        onError: {
          target: 'failure',
          actions: assign({
            error: (_, event) => event.data,
          }),
        },
      },
    },
    success: {
      on: {EDIT: 'edit'},
    },
    failure: {
      on: {EDIT: 'edit'},
    },
  },
})
