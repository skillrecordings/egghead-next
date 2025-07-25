import * as React from 'react'
import {GetServerSideProps} from 'next'
import {get} from 'lodash'
import {useMachine} from '@xstate/react'
import {lessonMachine} from '@/machines/lesson-machine'
import {loadLesson} from '@/lib/lessons'
import {useViewer} from '@/context/viewer-context'
import {LessonResource, VideoResource} from '@/types'
import getTracer from '@/utils/honeycomb-tracer'
import {setupHttpTracing} from '@/utils/tracing-js/dist/src/index'
import cookieUtil from '@/utils/cookies'
import type {
  VideoEvent,
  VideoStateContext,
} from '@skillrecordings/player/dist/machines/video-machine'
import {GenericErrorBoundary} from '@/components/generic-error-boundary'
import Lesson from '@/components/pages/lessons/lesson'
import {trpc} from '@/app/_trpc/client'

import {VideoProvider} from '@skillrecordings/player'

const tracer = getTracer('lesson-page')

export const getServerSideProps: GetServerSideProps = async function ({
  req,
  res,
  params,
}) {
  setupHttpTracing({name: getServerSideProps.name, tracer, req, res})

  try {
    const initialLesson: LessonResource | undefined =
      params && (await loadLesson(params.slug as string, undefined, false))

    if (initialLesson && initialLesson?.slug !== params?.slug) {
      return {
        redirect: {
          destination: initialLesson.path,
          permanent: true,
        },
      }
    } else {
      // Get the most up-to-date lesson data from Course Builder database

      res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')
      return {
        props: {
          initialLesson: initialLesson,
        },
      }
    }
  } catch (e) {
    console.error(e)
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }
}

const LessonPage: React.FC<
  React.PropsWithChildren<{initialLesson: VideoResource}>
> = ({initialLesson, ...props}) => {
  const {viewer} = useViewer()
  const [watchCount, setWatchCount] = React.useState<number>(0)

  const utils = trpc.useUtils()

  const [lessonState, send] = useMachine(lessonMachine, {
    context: {
      lesson: initialLesson,
      viewer,
    },
    services: {
      loadLesson: async () => {
        if (cookieUtil.get(`egghead-watch-count`)) {
          setWatchCount(Number(cookieUtil.get(`egghead-watch-count`)))
        } else {
          setWatchCount(
            Number(
              cookieUtil.set(`egghead-watch-count`, 0, {
                expires: 15,
              }),
            ),
          )
        }

        await utils.lesson.getLessonbySlug.invalidate({
          slug: initialLesson.slug,
        })
        const freshLesson = await utils.lesson.getLessonbySlug.fetch({
          slug: initialLesson.slug,
        })

        return {
          ...initialLesson,
          ...freshLesson,
        }
      },
    },
  })
  return (
    <VideoProvider
      services={{
        loadViewer:
          (_context: VideoStateContext, _event: VideoEvent) => async () => {
            return await viewer
          },
        loadResource:
          (_context: VideoStateContext, event: VideoEvent) => async () => {
            const loadedLesson = get(event, 'resource') as any
            return {
              ...initialLesson,
              ...loadedLesson,
            }
          },
      }}
    >
      <GenericErrorBoundary>
        <Lesson
          state={[lessonState, send]}
          initialLesson={initialLesson}
          watchCount={watchCount}
          setWatchCount={setWatchCount}
          {...props}
        />
      </GenericErrorBoundary>
    </VideoProvider>
  )
}

export default LessonPage
