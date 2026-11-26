import * as React from 'react'
import {trpc} from '@/app/_trpc/client'

type TrackableLesson = {slug?: string; lesson_view_url?: string | null}

/**
 * Pure merge used by the hook: a per-viewer `lesson_view_url` wins, otherwise
 * the lesson passes through unchanged (anonymous viewers keep no URL, so the
 * player falls back to its cookie-only progress path).
 */
export function withLessonViewUrl<T extends TrackableLesson>(
  lesson: T,
  lessonViewUrl?: string | null,
): T {
  if (!lessonViewUrl || lesson.lesson_view_url === lessonViewUrl) return lesson
  return {...lesson, lesson_view_url: lessonViewUrl}
}

/**
 * Fetch the lesson's view-tracking URL as the signed-in viewer and merge it
 * into the lesson the player reports progress against.
 *
 * Lesson pages are ISR/CDN shared, so their payload never carries this
 * viewer-gated URL. This client-side, cookie-authenticated tRPC call restores
 * it without making the page per-user. It only fetches for a signed-in
 * viewer and never refetches on its own; view posts come from player events,
 * so a refetch can never add a post.
 */
export function useLessonViewUrl<T extends TrackableLesson>(
  lesson: T,
  viewer: unknown,
): T {
  const slug = lesson?.slug
  const {data} = trpc.lesson.getLessonViewUrl.useQuery(
    {slug: slug ?? ''},
    {
      enabled: Boolean(viewer) && Boolean(slug),
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: false,
    },
  )

  const lessonViewUrl = viewer ? data?.lesson_view_url : null

  return React.useMemo(
    () => withLessonViewUrl(lesson, lessonViewUrl),
    [lesson, lessonViewUrl],
  )
}
