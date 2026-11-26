import * as React from 'react'
import {get} from 'lodash'
import {trpc} from '@/app/_trpc/client'
import {
  beginLessonViewSession,
  flushPendingLessonView,
} from './use-egghead-player'

type TrackableLesson = {slug?: string; lesson_view_url?: string | null}

export type IssuedLessonViewUrl = {
  slug: string
  owner: string
  lesson_view_url: string | null
}

export const ANONYMOUS_OWNER = 'anonymous'

/** Stable identity for "who this URL was granted to". */
export function viewerOwnerKey(viewer: unknown): string {
  if (!viewer) return ANONYMOUS_OWNER
  const id =
    get(viewer, 'id') ?? get(viewer, 'contact_id') ?? get(viewer, 'email')
  return id ? `viewer:${id}` : 'viewer:unknown'
}

/**
 * The URL Rails issued for *this* lesson and *this* viewer, or null. Rails
 * resolves the lesson from the URL path, not the POST body, so a URL issued
 * for the previous lesson must never be attached to the next one after client
 * navigation; and a URL issued to one viewer must not survive a sign-out or
 * account switch.
 */
export function lessonViewUrlFor(
  slug: string | undefined,
  owner: string,
  issued: IssuedLessonViewUrl | null | undefined,
): string | null {
  if (!slug || owner === ANONYMOUS_OWNER || !issued) return null
  if (issued.slug !== slug || issued.owner !== owner) return null
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
 * viewer-gated URL. The fetch:
 * - starts on the first playback event (`requestViewUrl`), not on mount, so
 *   signed-in page views that never play cost Rails nothing;
 * - is a tRPC mutation (POST, its own batch, never stored by a cache);
 * - runs at most once per (lesson, viewer), and its answer is only used for
 *   the lesson and viewer it was issued for.
 * Each (lesson, viewer) opens a fresh pending session in the player; when the
 * URL lands, whatever that session played while waiting is posted once.
 */
export function useLessonViewUrl<T extends TrackableLesson>(
  lesson: T,
  viewer: unknown,
): {lesson: T; requestViewUrl: () => void} {
  const slug = lesson?.slug
  const owner = viewerOwnerKey(viewer)
  const {mutateAsync} = trpc.lesson.getLessonViewUrl.useMutation({
    retry: false,
  })
  const [issued, setIssued] = React.useState<IssuedLessonViewUrl | null>(null)
  const requestedFor = React.useRef<string | null>(null)
  const current = React.useRef({slug, owner})
  current.current = {slug, owner}

  // New lesson or new viewer: fresh pending session, nothing requested yet.
  React.useEffect(() => {
    if (!slug) return
    beginLessonViewSession(slug, owner)
    requestedFor.current = null
  }, [slug, owner])

  const requestViewUrl = React.useCallback(() => {
    const {slug: s, owner: o} = current.current
    if (!s || o === ANONYMOUS_OWNER) return
    const key = `${o}|${s}`
    if (requestedFor.current === key) return
    requestedFor.current = key
    mutateAsync({slug: s})
      .then((result) => {
        const now = current.current
        if (now.slug === s && now.owner === o) {
          setIssued({
            slug: s,
            owner: o,
            lesson_view_url: result?.lesson_view_url ?? null,
          })
        }
      })
      .catch(() => {
        // Rails failures already resolve to a null URL server-side (and are
        // logged there). A transport failure is not retried: playback events
        // fire several times a second and would hammer Rails. One request
        // per (lesson, viewer) session.
      })
  }, [mutateAsync])

  const lessonViewUrl = lessonViewUrlFor(slug, owner, issued)

  const trackedLesson = React.useMemo(
    () => withLessonViewUrl(lesson, lessonViewUrl),
    [lesson, lessonViewUrl],
  )

  React.useEffect(() => {
    if (lessonViewUrl) {
      flushPendingLessonView(trackedLesson as any, owner).catch(() => undefined)
    }
    // flush once per issued URL, not on every lesson object change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonViewUrl])

  return {lesson: trackedLesson, requestViewUrl}
}
