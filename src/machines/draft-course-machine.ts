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
  | {type: 'SUBMIT'; data: {title?: string; description?: string}}
  | DoneEventObject

export interface Context {
  title?: string
  description?: string
  error?: string
}

const setNewTextValue = assign<Context, DoneEventObject>({
  title: (_, event) => {
    return event.data.title
  },
  description: (_, event) => {
    return event.data.description
  },
})

export const requestDraftCourseChangeMachine = Machine<
  Context,
  StateSchema,
  Event
>({
  id: 'requestDraftCourseChange',
  initial: 'idle',
  context: {
    title: undefined,
    description: undefined,
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
      entry: [setNewTextValue],
      invoke: {
        id: 'makeDraftCourseChangeRequest',
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
              title: (_, event) => {
                if (event?.data?.titleMutation)
                  return event.data.titleMutation.title
              },
              description: (_, event) => {
                if (event?.data?.descriptionMutation)
                  return event.data.descriptionMutation.description
              },
            }),
          ],
        },
        onError: {
          target: 'failure',
          actions: assign({
            error: (_, event) => event.data,
            title: (_, event) => undefined,
            description: (_, event) => undefined,
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
