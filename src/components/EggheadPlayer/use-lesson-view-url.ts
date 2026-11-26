import * as React from 'react'
import {trpc} from '@/app/_trpc/client'
import getAccessTokenFromCookie from '@/utils/get-access-token-from-cookie'
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

/**
 * Short, stable, non-reversible tag for a token (FNV-1a). Lets pending
 * sessions tell one signed-in account from another without keeping the
 * token itself in keys.
 */
function tokenTag(token: string): string {
  let hash = 0x811c9dc5
  for (let i = 0; i < token.length; i++) {
    hash ^= token.charCodeAt(i)
    hash = Math.imul(hash, 0x01000193) >>> 0
  }
  return hash.toString(16)
}

/**
 * Who a view would be credited to, from the access-token cookie: the same
 * credential the tRPC server (ctx.userToken) and the player's view POSTs
 * (getOptions) authenticate with. Deliberately not `useViewer().viewer`:
 * that also needs a localStorage expiry and a successful
 * /api/users/current, and was empty for signed-in players in production,
 * so no view URL was ever requested.
 */
export function tokenOwnerKey(
  token: string | false | null | undefined,
): string {
  return token ? `token:${tokenTag(token)}` : ANONYMOUS_OWNER
}

const currentTokenOwner = () =>
  tokenOwnerKey(getAccessTokenFromCookie() || undefined)

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
  resolveOwner: () => string,
): {lesson: T; requestViewUrl: () => void} {
  const slug = lesson?.slug
  const owner = resolveOwner()
  const resolveOwnerRef = React.useRef(resolveOwner)
  resolveOwnerRef.current = resolveOwner
  const [, forceRender] = React.useReducer((n: number) => n + 1, 0)
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
    // The credential can change without a re-render (sign-in or sign-out in
    // this tab). Re-render first so a fresh session opens for the new
    // owner; the next playback event then requests for it.
    if (resolveOwnerRef.current() !== o) {
      forceRender()
      return
    }
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

/**
 * Player wiring shared by every page that reports lesson views (lessons,
 * talks). Players bind their `timeupdate` listener once per video element,
 * so this hands back stable callbacks that always read the latest tracked
 * lesson.
 *
 * - `lessonForPlayback(videoElement)`: call from `timeupdate`. Returns null
 *   for events that aren't real playback (seeks or resume positions while
 *   paused); otherwise requests the viewer's URL (once) and returns the
 *   lesson to pass to `onProgress`.
 * - `lessonForCompletion()`: the lesson to pass to `onEnded`.
 */
export function useLessonViewTracking<T extends TrackableLesson>(lesson: T) {
  const {lesson: trackedLesson, requestViewUrl} = useLessonViewUrl(
    lesson,
    currentTokenOwner,
  )
  const trackedLessonRef = React.useRef(trackedLesson)
  trackedLessonRef.current = trackedLesson
  const requestViewUrlRef = React.useRef(requestViewUrl)
  requestViewUrlRef.current = requestViewUrl

  const lessonForPlayback = React.useCallback(
    (videoElement?: {paused?: boolean} | null): T | null => {
      if (videoElement?.paused) return null
      requestViewUrlRef.current()
      return trackedLessonRef.current
    },
    [],
  )
  const lessonForCompletion = React.useCallback(
    (): T => trackedLessonRef.current,
    [],
  )

  return {trackedLesson, lessonForPlayback, lessonForCompletion}
}
