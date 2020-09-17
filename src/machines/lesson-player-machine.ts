import {Machine} from 'xstate'

interface PlayerStateSchema {
  states: {
    loading: {}
    loaded: {}
    playing: {}
    paused: {}
    quizzing: {}
    rating: {}
    subscribing: {}
    showingNext: {}
    joining: {}
    completed: {}
  }
}

export type PlayerStateEvent =
  | {type: 'PLAY'}
  | {type: 'PAUSE'}
  | {type: 'LOADED'}
  | {type: 'SUBSCRIBE'}
  | {type: 'JOIN'}
  | {type: 'QUIZ'}
  | {type: 'COMPLETE'}
  | {type: 'NEXT'}
  | {type: 'RATE'}
  | {type: 'LOAD'}

const playerMachine = Machine<PlayerStateSchema, PlayerStateEvent>({
  id: 'player',
  initial: 'loading',
  states: {
    loading: {
      on: {
        LOADED: 'loaded',
      },
    },
    loaded: {
      on: {
        PLAY: 'playing',
        SUBSCRIBE: 'subscribing',
        JOIN: 'joining',
        PAUSE: 'paused',
      },
    },
    playing: {
      on: {
        QUIZ: 'quizzing',
        COMPLETE: 'completed',
        RATE: 'rating',
        PAUSE: 'paused',
      },
    },
    paused: {
      on: {
        PLAY: 'playing',
      },
    },
    completed: {
      on: {
        NEXT: 'showingNext',
        SUBSCRIBE: 'subscribing',
        JOIN: 'joining',
        RATE: 'rating',
        QUIZ: 'quizzing',
      },
    },
    quizzing: {
      on: {
        NEXT: 'showingNext',
        SUBSCRIBE: 'subscribing',
        JOIN: 'joining',
        RATE: 'rating',
      },
    },
    rating: {
      on: {
        NEXT: 'showingNext',
        SUBSCRIBE: 'subscribing',
        JOIN: 'joining',
        QUIZ: 'quizzing',
      },
    },
    subscribing: {
      on: {
        NEXT: 'showingNext',
        JOIN: 'joining',
        RATE: 'rating',
        QUIZ: 'quizzing',
      },
    },
    joining: {
      on: {
        NEXT: 'showingNext',
        SUBSCRIBE: 'subscribing',
        RATE: 'rating',
        QUIZ: 'quizzing',
      },
    },
    showingNext: {
      on: {
        LOAD: 'loading',
      },
    },
  },
})

export default playerMachine
