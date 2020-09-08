import {Machine} from 'xstate'

interface PlayerStateSchema {
  states: {
    loading: {}
    playing: {}
    quizzing: {}
    rating: {}
    subscribing: {}
    joining: {}
    completed: {}
  }
}

export type PlayerStateEvent =
  | {type: 'PLAY'}
  | {type: 'SUBSCRIBE'}
  | {type: 'JOIN'}
  | {type: 'QUIZ'}
  | {type: 'COMPLETE'}
  | {type: 'RATE'}

const playerMachine = Machine<PlayerStateSchema, PlayerStateEvent>({
  id: 'player',
  initial: 'loading',
  states: {
    loading: {
      on: {
        PLAY: 'playing',
        SUBSCRIBE: 'subscribing',
        JOIN: 'joining',
      },
    },
    playing: {
      on: {
        QUIZ: 'quizzing',
        COMPLETE: 'completed',
        RATE: 'rating',
      },
    },
    quizzing: {
      on: {
        COMPLETE: 'completed',
      },
    },
    rating: {
      on: {
        COMPLETE: 'completed',
      },
    },
    subscribing: {
      type: 'final',
    },
    joining: {
      type: 'final',
    },
    completed: {
      type: 'final',
    },
  },
})

export default playerMachine
