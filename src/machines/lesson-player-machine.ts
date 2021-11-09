import {track} from 'utils/analytics'
import {Machine, assign} from 'xstate'
import axios from 'axios'
import {LessonResource} from '../types'
import {convertTimeWithTitles} from '../utils/time-utils'

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
    pitchingCourse: {}
    addingNote: {}
  }
}

export type PlayerStateEvent =
  | {type: 'VIEW'}
  | {type: 'VIEW'; lesson: any; viewer: any}
  | {type: 'PLAY'}
  | {type: 'PAUSE'}
  | {type: 'LOADED'}
  | {type: 'LOADED'; lesson: any; viewer: any}
  | {type: 'SUBSCRIBE'}
  | {type: 'JOIN'}
  | {type: 'QUIZ'}
  | {type: 'COMPLETE'}
  | {type: 'NEXT'}
  | {type: 'COURSE_PITCH'}
  | {type: 'RATE'}
  | {type: 'LOAD'}
  | {type: 'LOAD'; lesson: any; viewer: any}
  | {type: 'RECOMMEND'}
  | {type: 'ADD_NOTE'}

interface PlayerContext {
  lesson: any
  viewer: any
}

export const playerMachine = Machine<
  PlayerContext,
  PlayerStateSchema,
  PlayerStateEvent
>(
  {
    id: 'player',
    initial: 'loading',
    context: {lesson: {}, viewer: {}},
    states: {
      loading: {
        entry: [
          assign({
            lesson: (_, event: any) => event.lesson,
            viewer: (_, event: any) => {
              return event.viewer
            },
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
            viewer: (_, event: any) => {
              return event.viewer
            },
          }),
          'logLesson',
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
        entry: [
          'sendTelemetry',
          assign({
            lesson: (ctx, event: any) => event.lesson || ctx.lesson,
            viewer: (ctx, event: any) => event.viewer || ctx.viewer,
          }),
        ],
        on: {
          PLAY: 'playing',
          LOAD: 'loading',
          LOADED: 'loaded',
          ADD_NOTE: 'addingNote',
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
          LOADED: 'loaded',
          ADD_NOTE: 'addingNote',
        },
      },
      paused: {
        entry: ['sendTelemetry'],
        on: {
          PLAY: 'playing',
          LOAD: 'loading',
          COMPLETE: 'completed',
          ADD_NOTE: 'addingNote',
        },
      },

      completed: {
        entry: ['sendTelemetry'],
        on: {
          NEXT: 'showingNext',
          COURSE_PITCH: 'pitchingCourse',
          SUBSCRIBE: 'subscribing',
          JOIN: 'joining',
          RATE: 'rating',
          RECOMMEND: 'recommending',
          QUIZ: 'quizzing',
          LOAD: 'loading',
          LOADED: 'loaded',
          VIEW: 'viewing',
        },
      },
      quizzing: {
        entry: [
          (context, _event) => {
            track('show quiz cta', {
              lesson: context.lesson.slug,
              location: 'lesson overlay',
            })
          },
        ],
        on: {
          NEXT: 'showingNext',
          SUBSCRIBE: 'subscribing',
          JOIN: 'joining',
          RATE: 'rating',
          LOAD: 'loading',
        },
      },
      rating: {
        entry: [
          (context, _event) => {
            track('show rating cta', {
              lesson: context.lesson.slug,
              location: 'lesson overlay',
            })
          },
        ],
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
        entry: [
          (context, _event) => {
            track('show become member cta', {
              lesson: context.lesson.slug,
              location: 'lesson overlay',
            })
          },
        ],
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
        entry: [
          (context, _event) => {
            track('show email capture cta', {
              lesson: context.lesson.slug,
              location: 'lesson overlay',
            })
          },
        ],
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
        entry: [
          (context, _event) => {
            track('show next up cta', {
              lesson: context.lesson.slug,
              location: 'lesson overlay',
            })
          },
        ],
        on: {
          LOAD: 'loading',
          VIEW: 'viewing',
        },
      },
      pitchingCourse: {
        on: {
          LOAD: 'loading',
          VIEW: 'viewing',
        },
      },
      recommending: {
        on: {
          LOAD: 'loading',
        },
      },
      addingNote: {
        entry: [
          (context, _event) => {
            track('show note entry', {
              lesson: context.lesson.slug,
              location: 'lesson overlay',
            })
          },
        ],
        on: {
          PLAY: 'playing',
          VIEW: 'viewing',
          PAUSE: 'paused',
        },
      },
    },
  },
  {
    actions: {
      logLesson: async (context, event) => {
        const logResource = (lesson: LessonResource) => {
          if (typeof window !== 'undefined') {
            const {
              title,
              duration,
              instructor,
              icon_url,
              path,
              slug,
              description,
            } = lesson
            const image = icon_url
            const formattedDuration = convertTimeWithTitles(duration)
            const byline = `${
              instructor?.full_name && `${instructor.full_name}・`
            }${formattedDuration}・Video`

            console.debug({
              title,
              byline,
              ...(!!image && {image}),
              path,
              slug,
              description,
            })
          }
        }
        logResource(context.lesson)
      },
      sendTelemetry: async (context, event) => {
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

        if (verb === 'completed') {
          context.lesson?.tags?.forEach((tag: any) => {
            axios.post('/api/topic', {
              amount: 2,
              topic: tag.name,
            })
          })
        }

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
