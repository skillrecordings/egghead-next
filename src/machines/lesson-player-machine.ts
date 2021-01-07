import Axios from 'axios'
import {track} from 'utils/analytics'
import {Machine, assign} from 'xstate'

interface PlayerStateSchema {
  states: {
    loading: {}
    loaded: {}
    viewing: {}
    playing: {}
    paused: {}
    quizzing: {}
    rating: {}
    subscribing: {}
    showingNext: {}
    joining: {}
    completed: {}
    recommending: {}
  }
}

export type PlayerStateEvent =
  | {type: 'VIEW'}
  | {type: 'PLAY'}
  | {type: 'PAUSE'}
  | {type: 'LOADED'}
  | {type: 'LOADED'; lesson: any}
  | {type: 'SUBSCRIBE'}
  | {type: 'JOIN'}
  | {type: 'QUIZ'}
  | {type: 'COMPLETE'}
  | {type: 'NEXT'}
  | {type: 'RATE'}
  | {type: 'LOAD'}
  | {type: 'RECOMMEND'}

interface PlayerContext {
  lesson: any
}

const playerMachine = Machine<
  PlayerContext,
  PlayerStateSchema,
  PlayerStateEvent
>(
  {
    id: 'player',
    initial: 'loading',
    context: {lesson: {}},
    states: {
      loading: {
        entry: [
          assign({
            lesson: null,
          }),
        ],
        on: {
          LOADED: 'loaded',
        },
      },
      loaded: {
        entry: [
          assign({
            lesson: (_, event: any) => event.lesson,
          }),
        ],
        on: {
          PLAY: 'playing',
          VIEW: 'viewing',
          SUBSCRIBE: 'subscribing',
          JOIN: 'joining',
          PAUSE: 'paused',
          LOAD: 'loading',
        },
      },
      viewing: {
        entry: ['sendTelemetry'],
        on: {
          PLAY: 'playing',
          LOAD: 'loading',
        },
      },
      playing: {
        entry: ['sendTelemetry'],
        on: {
          QUIZ: 'quizzing',
          COMPLETE: 'completed',
          RATE: 'rating',
          PAUSE: 'paused',
          LOAD: 'loading',
        },
      },
      paused: {
        entry: ['sendTelemetry'],
        on: {
          PLAY: 'playing',
          LOAD: 'loading',
        },
      },
      completed: {
        entry: ['sendTelemetry'],
        on: {
          NEXT: 'showingNext',
          SUBSCRIBE: 'subscribing',
          JOIN: 'joining',
          RATE: 'rating',
          RECOMMEND: 'recommending',
          QUIZ: 'quizzing',
          LOAD: 'loading',
        },
      },
      quizzing: {
        on: {
          NEXT: 'showingNext',
          SUBSCRIBE: 'subscribing',
          JOIN: 'joining',
          RATE: 'rating',
          LOAD: 'loading',
        },
      },
      rating: {
        on: {
          NEXT: 'showingNext',
          RECOMMEND: 'recommending',
          SUBSCRIBE: 'subscribing',
          JOIN: 'joining',
          QUIZ: 'quizzing',
          LOAD: 'loading',
        },
      },
      subscribing: {
        on: {
          NEXT: 'showingNext',
          RECOMMEND: 'recommending',
          JOIN: 'joining',
          RATE: 'rating',
          QUIZ: 'quizzing',
          LOAD: 'loading',
        },
      },
      joining: {
        on: {
          NEXT: 'showingNext',
          SUBSCRIBE: 'subscribing',
          RECOMMEND: 'recommending',
          RATE: 'rating',
          QUIZ: 'quizzing',
          LOAD: 'loading',
        },
      },
      showingNext: {
        on: {
          LOAD: 'loading',
        },
      },
      recommending: {
        on: {
          LOAD: 'loading',
        },
      },
    },
  },
  {
    actions: {
      sendTelemetry: (context, event) => {
        function verbForEvent(event: string) {
          switch (event) {
            case 'PAUSE':
              return 'paused'
            case 'PLAY':
              return 'played'
            case 'VIEW':
              return 'viewed'
            case 'COMPLETE':
              return 'completed'
            default:
              break
          }
        }
        const verb = verbForEvent(event.type)

        if (!verb) return

        track(`${verb} video`, {
          lesson: context.lesson.slug,
        })

        // Axios.post(`/api/progress`, {
        //   verb,
        //   target: {
        //     id: `egghead::lesson::${context.lesson.slug}`,
        //     definition: {
        //       name: {
        //         'en-US': context.lesson.title,
        //       },
        //       type: 'https://egghead.io/xapi/types#video',
        //       moreinfo: `${process.env.NEXT_PUBLIC_AUTH_DOMAIN}${context.lesson.path}`,
        //     },
        //   },
        // })
      },
    },
  },
)

export default playerMachine
