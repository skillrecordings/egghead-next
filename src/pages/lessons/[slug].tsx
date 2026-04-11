import * as React from 'react'
import {GetStaticPaths, GetStaticProps} from 'next'
import {get} from 'lodash'
import {useMachine} from '@xstate/react'
import {lessonMachine} from '@/machines/lesson-machine'
import {LESSON_NOT_FOUND_MESSAGE, loadLesson} from '@/lib/lessons'
import {useViewer} from '@/context/viewer-context'
import {LessonResource, VideoResource} from '@/types'
import cookieUtil from '@/utils/cookies'
import {logEvent} from '@/utils/structured-log'
import {GenericErrorBoundary} from '@/components/generic-error-boundary'
import Lesson from '@/components/pages/lessons/lesson'
import {trpc} from '@/app/_trpc/client'
import {
  HOT_LESSON_ALIAS_PATHS,
  HOT_LESSON_PATHS,
  HOT_LESSON_PATHS_ALIAS_COUNT,
  HOT_LESSON_PATHS_CANONICAL_COUNT,
  HOT_LESSON_PATHS_GENERATED_AT,
  HOT_LESSON_PATHS_REQUESTED_COUNT,
  HOT_LESSON_PATHS_SOURCE_GENERATED_AT,
  HOT_LESSON_PATHS_UNRESOLVED_COUNT,
  HOT_LESSON_PATHS_WINDOW,
  HOT_LESSON_UNRESOLVED_SLUGS,
} from '@/lib/hot-lesson-paths'
import {withHeaderBannerStaticProps} from '@/server/with-header-banner-props'

import {VideoProvider} from '@/player'

const LESSON_REVALIDATE_SECONDS = 60 * 60

const isLessonNotFoundError = (error: unknown) => {
  return (
    error instanceof Error && error.message.startsWith(LESSON_NOT_FOUND_MESSAGE)
  )
}

const getStaticPathSummaryPayload = () => ({
  requested_count: HOT_LESSON_PATHS_REQUESTED_COUNT,
  canonical_count: HOT_LESSON_PATHS_CANONICAL_COUNT,
  alias_count: HOT_LESSON_PATHS_ALIAS_COUNT,
  unresolved_count: HOT_LESSON_PATHS_UNRESOLVED_COUNT,
  generated_at: HOT_LESSON_PATHS_GENERATED_AT,
  source_generated_at: HOT_LESSON_PATHS_SOURCE_GENERATED_AT,
  window: HOT_LESSON_PATHS_WINDOW,
  ok: HOT_LESSON_PATHS_UNRESOLVED_COUNT === 0,
  render_mode: 'isr',
})

const getStaticPropsParams = (lessonSlug?: string) =>
  lessonSlug ? `slug=${lessonSlug}` : ''

const getStaticPropsLogContext = (lessonSlug?: string) => ({
  route: '/lessons/[slug]',
  page: 'lesson',
  lesson_slug: lessonSlug,
})

const logLessonStaticPropsRender = ({
  lessonSlug,
  durationMs,
  ok,
  isNotFound = false,
  isRedirect = false,
  handledNotFound = false,
  error,
}: {
  lessonSlug?: string
  durationMs: number
  ok: boolean
  isNotFound?: boolean
  isRedirect?: boolean
  handledNotFound?: boolean
  error?: string
}) => {
  logEvent(
    ok ? 'info' : 'error',
    'static_props.render',
    {
      params: getStaticPropsParams(lessonSlug),
      duration_ms: durationMs,
      ok,
      is_not_found: isNotFound,
      is_redirect: isRedirect,
      handled_not_found: handledNotFound,
      render_mode: 'isr',
      ...(error ? {error} : {}),
    },
    getStaticPropsLogContext(lessonSlug),
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  logEvent('info', 'lesson.static_paths.summary', getStaticPathSummaryPayload())

  if (
    HOT_LESSON_PATHS_ALIAS_COUNT > 0 ||
    HOT_LESSON_PATHS_UNRESOLVED_COUNT > 0
  ) {
    logEvent('warn', 'lesson.static_paths.anomalies', {
      alias_count: HOT_LESSON_PATHS_ALIAS_COUNT,
      unresolved_count: HOT_LESSON_PATHS_UNRESOLVED_COUNT,
      alias_samples: HOT_LESSON_ALIAS_PATHS.slice(0, 5),
      unresolved_samples: HOT_LESSON_UNRESOLVED_SLUGS.slice(0, 5),
      render_mode: 'isr',
    })
  }

  return {
    paths: HOT_LESSON_PATHS.map(({slug}) => ({
      params: {slug},
    })),
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = withHeaderBannerStaticProps(
  '/lessons/[slug]',
  async function ({params}) {
    const start = performance.now()
    const lessonSlug = params?.slug as string | undefined

    if (!lessonSlug) {
      logLessonStaticPropsRender({
        durationMs: Math.round(performance.now() - start),
        ok: true,
        isNotFound: true,
        handledNotFound: true,
      })

      return {
        notFound: true,
      }
    }

    const logContext = {
      ...getStaticPropsLogContext(lessonSlug),
      render_mode: 'isr',
      suppress_info_logs: true,
    }

    try {
      const initialLesson: LessonResource | undefined = await loadLesson(
        lessonSlug,
        undefined,
        false,
        logContext,
      )

      if (!initialLesson?.slug) {
        logLessonStaticPropsRender({
          lessonSlug,
          durationMs: Math.round(performance.now() - start),
          ok: true,
          isNotFound: true,
          handledNotFound: true,
        })

        return {
          notFound: true,
          revalidate: LESSON_REVALIDATE_SECONDS,
        }
      }

      if (initialLesson.slug !== lessonSlug) {
        logEvent(
          'warn',
          'lesson.static_props.redirect_slug',
          {
            slug: lessonSlug,
            canonical_slug: initialLesson.slug,
            canonical_path: initialLesson.path,
            ok: true,
            render_mode: 'isr',
          },
          getStaticPropsLogContext(lessonSlug),
        )

        logLessonStaticPropsRender({
          lessonSlug,
          durationMs: Math.round(performance.now() - start),
          ok: true,
          isRedirect: true,
        })

        return {
          redirect: {
            destination: initialLesson.path,
            permanent: true,
          },
          revalidate: 60,
        }
      }

      logLessonStaticPropsRender({
        lessonSlug,
        durationMs: Math.round(performance.now() - start),
        ok: true,
      })

      return {
        props: {
          initialLesson,
        },
        revalidate: LESSON_REVALIDATE_SECONDS,
      }
    } catch (error) {
      if (isLessonNotFoundError(error)) {
        logLessonStaticPropsRender({
          lessonSlug,
          durationMs: Math.round(performance.now() - start),
          ok: true,
          isNotFound: true,
          handledNotFound: true,
        })

        return {
          notFound: true,
          revalidate: 60,
        }
      }

      logEvent(
        'error',
        'lesson.static_props.error',
        {
          slug: lessonSlug,
          ok: false,
          render_mode: 'isr',
          error: error instanceof Error ? error.message : String(error),
        },
        getStaticPropsLogContext(lessonSlug),
      )

      logLessonStaticPropsRender({
        lessonSlug,
        durationMs: Math.round(performance.now() - start),
        ok: false,
        error: error instanceof Error ? error.message : String(error),
      })

      throw error
    }
  },
)

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

        const hasGatedMedia =
          Boolean((initialLesson as any)?.hls_url) ||
          Boolean((initialLesson as any)?.dash_url)
        if (hasGatedMedia) {
          logEvent('info', 'lesson.client_refetch.skip', {
            lesson_slug: initialLesson.slug,
            has_hls: Boolean((initialLesson as any)?.hls_url),
            has_dash: Boolean((initialLesson as any)?.dash_url),
          })
          return initialLesson
        }

        await utils.lesson.getLessonbySlug.invalidate({
          slug: initialLesson.slug,
        })
        const freshLesson = await utils.lesson.getLessonbySlug.fetch({
          slug: initialLesson.slug,
        })

        logEvent('info', 'lesson.client_refetch.result', {
          lesson_slug: initialLesson.slug,
          had_hls_before: Boolean((initialLesson as any)?.hls_url),
          had_dash_before: Boolean((initialLesson as any)?.dash_url),
          has_hls_after: Boolean((freshLesson as any)?.hls_url),
          has_dash_after: Boolean((freshLesson as any)?.dash_url),
          media_changed:
            Boolean((initialLesson as any)?.hls_url) !==
              Boolean((freshLesson as any)?.hls_url) ||
            Boolean((initialLesson as any)?.dash_url) !==
              Boolean((freshLesson as any)?.dash_url),
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
        loadViewer: () => async () => {
          return await viewer
        },
        loadResource: (_context: any, event: any) => async () => {
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
