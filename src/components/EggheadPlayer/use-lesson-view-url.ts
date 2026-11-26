import * as React from 'react'
import {trpc} from '@/app/_trpc/client'
import {flushPendingLessonView} from './use-egghead-player'

type TrackableLesson = {slug?: string; lesson_view_url?: string | null}

export type IssuedLessonViewUrl = {
  slug: string
  lesson_view_url: string | null
}

/**
 * The URL Rails issued for *this* lesson, or null. Rails resolves the lesson
 * from the URL path, not the POST body, so a URL issued for the previous
 * lesson must never be attached to the next one after client navigation.
 */
export function lessonViewUrlFor(
  slug: string | undefined,
  issued: IssuedLessonViewUrl | null | undefined,
): string | null {
  if (!slug || !issued || issued.slug !== slug) return null
  return issued.lesson_view_url ?? null
}

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
 * viewer-gated URL. The fetch is a tRPC mutation (POST, its own batch, never
 * stored by a cache), runs once per (lesson, signed-in viewer), and its answer
 * is only used for the lesson it was issued for. When the URL lands, anything
 * the player recorded before it (an early segment or a completion) is posted.
 */
export function useLessonViewUrl<T extends TrackableLesson>(
  lesson: T,
  viewer: unknown,
): T {
  const slug = lesson?.slug
  const signedIn = Boolean(viewer)
  const {mutateAsync} = trpc.lesson.getLessonViewUrl.useMutation({
    retry: false,
  })
  const [issued, setIssued] = React.useState<IssuedLessonViewUrl | null>(null)

  React.useEffect(() => {
    if (!signedIn || !slug) return
    let cancelled = false
    mutateAsync({slug})
      .then((result) => {
        if (!cancelled) setIssued(result)
      })
      .catch(() => {
        // loadLessonViewUrl already logs failures server-side; no URL means
        // the player keeps its anonymous path.
      })
    return () => {
      cancelled = true
    }
  }, [slug, signedIn, mutateAsync])

  const lessonViewUrl = signedIn ? lessonViewUrlFor(slug, issued) : null

  const trackedLesson = React.useMemo(
    () => withLessonViewUrl(lesson, lessonViewUrl),
    [lesson, lessonViewUrl],
  )

  React.useEffect(() => {
    if (lessonViewUrl) {
      flushPendingLessonView(trackedLesson as any).catch(() => undefined)
    }
    // flush once per issued URL, not on every lesson object change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonViewUrl])

  return trackedLesson
}
