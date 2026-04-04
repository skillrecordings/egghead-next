import * as React from 'react'
import {GetStaticPaths, GetStaticProps} from 'next'
import {withStaticPropsLogging} from '@/lib/logging'
import {get} from 'lodash'
import {useMachine} from '@xstate/react'
import {lessonMachine} from '@/machines/lesson-machine'
import {loadLesson, loadLessonMetadataFromGraphQL} from '@/lib/lessons'
import {useViewer} from '@/context/viewer-context'
import {LessonResource, VideoResource} from '@/types'
import cookieUtil from '@/utils/cookies'
import {logEvent} from '@/utils/structured-log'
import {GenericErrorBoundary} from '@/components/generic-error-boundary'
import Lesson from '@/components/pages/lessons/lesson'
import {trpc} from '@/app/_trpc/client'
import {HOT_LESSON_SLUGS} from '@/lib/hot-content-slugs'

import {VideoProvider} from '@/player'

const LESSON_REVALIDATE_SECONDS = 300
const LESSON_NOT_FOUND_MESSAGE = 'Unable to lookup lesson metadata'
const STATIC_PATHS_ALIAS_BATCH_SIZE = 25

const isLessonNotFoundError = (error: unknown) => {
  return (
    error instanceof Error && error.message.startsWith(LESSON_NOT_FOUND_MESSAGE)
  )
}

async function getCanonicalStaticLessonSlugs() {
  const canonicalSlugs: string[] = []

  for (let index = 0; index < HOT_LESSON_SLUGS.length; index += STATIC_PATHS_ALIAS_BATCH_SIZE) {
    const batch = HOT_LESSON_SLUGS.slice(index, index + STATIC_PATHS_ALIAS_BATCH_SIZE)
    const batchResults = await Promise.all(
      batch.map(async (slug) => {
        const metadata = await loadLessonMetadataFromGraphQL(slug, undefined, {
          route: '/lessons/[slug]',
          page: 'lesson',
          lesson_slug: slug,
        })

        if (metadata?.slug && metadata.slug !== slug) {
          console.warn(
            JSON.stringify({
              event: 'lesson.static_paths.skip_alias_slug',
              slug,
              canonical_slug: metadata.slug,
              canonical_path: metadata.path,
              ok: true,
              render_mode: 'isr',
            }),
          )
          return null
        }

        return slug
      }),
    )

    canonicalSlugs.push(
      ...batchResults.filter((value): value is string => Boolean(value)),
    )
  }

  return canonicalSlugs
}

export const getStaticPaths: GetStaticPaths = async () => {
  const canonicalSlugs = await getCanonicalStaticLessonSlugs()

  return {
    paths: canonicalSlugs.map((slug) => ({
      params: {slug},
    })),
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = withStaticPropsLogging(
  async function ({params}) {
    const lessonSlug = params?.slug as string | undefined

    if (!lessonSlug) {
      return {
        notFound: true,
      }
    }

    const logContext = {
      route: '/lessons/[slug]',
      page: 'lesson',
      lesson_slug: lessonSlug,
      render_mode: 'isr',
    }

    try {
      const initialLesson: LessonResource | undefined = await loadLesson(
        lessonSlug,
        undefined,
        false,
        logContext,
      )

      if (!initialLesson?.slug) {
        return {
          notFound: true,
          revalidate: LESSON_REVALIDATE_SECONDS,
        }
      }

      if (initialLesson.slug !== lessonSlug) {
        console.warn(
          JSON.stringify({
            event: 'lesson.static_props.redirect_slug',
            slug: lessonSlug,
            canonical_slug: initialLesson.slug,
            canonical_path: initialLesson.path,
            ok: true,
            render_mode: 'isr',
          }),
        )

        return {
          redirect: {
            destination: initialLesson.path,
            permanent: true,
          },
          revalidate: 60,
        }
      }

      console.log(
        JSON.stringify({
          event: 'lesson.static_props.generated',
          slug: lessonSlug,
          ok: true,
          render_mode: 'isr',
        }),
      )

      return {
        props: {
          initialLesson,
        },
        revalidate: LESSON_REVALIDATE_SECONDS,
      }
    } catch (error) {
      console.error(
        JSON.stringify({
          event: 'lesson.static_props.error',
          slug: lessonSlug,
          ok: false,
          render_mode: 'isr',
          error: error instanceof Error ? error.message : String(error),
        }),
      )

      if (isLessonNotFoundError(error)) {
        return {
          notFound: true,
          revalidate: 60,
        }
      }

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
