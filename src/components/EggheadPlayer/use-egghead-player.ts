import * as React from 'react'
import cookies from '@/utils/cookies'
import analytics from '@/utils/analytics'
import getAccessTokenFromCookie from '@/utils/get-access-token-from-cookie'
import axios from 'axios'
import {get, identity, isEmpty, pickBy} from 'lodash'
import {LessonResource} from '@/types'

const getOptions = () =>
  getAccessTokenFromCookie()
    ? {
        headers: {
          Authorization: `Bearer ${getAccessTokenFromCookie()}`,
        },
      }
    : {}

const toLessonViewParams = ({
  collection,
  lesson,
}: {
  collection: any
  lesson: LessonResource
}) => {
  if (isEmpty(lesson)) {
    console.error('Cannot track lesson view for undefined lesson.')
    return
  }

  return {
    lesson_view: pickBy(
      {
        collection_type: get(collection, 'type'),
        collection_id: get(collection, 'id'),
        lesson_id: lesson.id,
      },
      identity,
    ),
  }
}

let lessonProgress: {[x: string]: number}

// --- view-post serialization -------------------------------------------
// Rails find-or-creates one LessonView per (user, lesson, collection) with no
// unique index (egghead-rails db/schema.rb lesson_views), so two concurrent
// creates for the same key can make two rows. Every create for a key (segment,
// completion or late flush) runs through one promise chain, one at a time.
const viewKey = (lesson: {slug?: string}, collection?: any) =>
  `${lesson?.slug}|${get(collection, 'type') ?? ''}:${
    get(collection, 'id') ?? ''
  }`

const viewQueues = new Map<string, Promise<unknown>>()

const enqueueViewPost = <T>(
  key: string,
  task: () => Promise<T>,
): Promise<T> => {
  const next = (viewQueues.get(key) ?? Promise.resolve())
    .catch(() => undefined)
    .then(task)
  viewQueues.set(key, next)
  return next
}

// --- pending views ---------------------------------------------------------
// The per-viewer lesson_view_url arrives from a client fetch, so a segment or
// a completion can happen before it lands. useLessonViewUrl opens one pending
// session per (lesson, viewer) with beginLessonViewSession; only segments the
// player actually plays inside that session, while the URL is missing, are
// counted. Nothing is seeded from cookies or earlier sessions, and a new
// viewer (sign in, sign out, switch) starts a fresh, empty session, so
// anonymous watching is never credited to the user who signs in later.
type PendingView = {
  owner: string
  segments: number
  ended: boolean
  collection?: any
}

const pendingViews = new Map<string, PendingView>()

const beginLessonViewSession = (slug: string, owner: string) => {
  pendingViews.set(slug, {owner, segments: 0, ended: false})
}

const createLessonView = async (lesson: LessonResource, collection?: any) => {
  const {data} = await axios.post(
    lesson.lesson_view_url,
    toLessonViewParams({lesson, collection}),
    getOptions(),
  )

  return data
}

const incrementViewSegments = (lessonView: {increment_url: string}) => {
  return axios
    .put(lessonView.increment_url, {}, getOptions())
    .then(({data}) => data)
}

const storeProgress = (
  playedSeconds: number,
  lesson: LessonResource,
  list?: undefined,
) => {
  return new Promise((resolve) => {
    const isSegment = Math.round(playedSeconds) % 30 === 0
    if (isSegment) {
      enqueueViewPost(viewKey(lesson, list), () =>
        createLessonView(lesson, list).then(incrementViewSegments),
      ).then(resolve)
    }
  })
}

const onProgress = async (
  progress: {
    playedSeconds: any
  },
  lesson: any,
) => {
  const {playedSeconds} = progress
  const roundedProgress = Math.ceil(playedSeconds)
  const isSegment = roundedProgress % 30 === 0

  if (!isSegment) {
    return
  }

  if (!lessonProgress) {
    lessonProgress = {}
  }

  const canTrack =
    isSegment && roundedProgress > (lessonProgress[lesson.slug] || 0)

  if (!canTrack) {
    return
  }

  lessonProgress[lesson.slug] = roundedProgress
  if (lesson.lesson_view_url) {
    return await storeProgress(roundedProgress, lesson)
  } else {
    const pending = pendingViews.get(lesson.slug)
    if (pending) pending.segments += 1
    const segments = lessonProgress[lesson.slug] / 30
    const lessonViews = cookies.get('egghead-lessonViews') || {}
    lessonViews[lesson.id] = segments

    return Promise.resolve(cookies.set('egghead-lessonViews', lessonViews))
  }
}

let emailCaptureCookie: number = 0

const setEmailCaptureCookie = (captureCookie = 0) => {
  console.log(captureCookie)
  cookies.set('egghead-watch-count', captureCookie)
  emailCaptureCookie = cookies.get('egghead-watch-count')
}

const getOrCreateLessonView = async (
  lesson: LessonResource,
  collection?: any,
) => {
  const {data} = await axios.post(
    lesson.lesson_view_url,
    toLessonViewParams({lesson, collection}),
    getOptions(),
  )
  return data
}

const trackPercentComplete = (lessonView: {series: any}) => {
  const series = lessonView.series
  const percents = [0.1, 0.25, 0.5, 0.75, 1]
  if (series && series.progress && series.published_lesson_count) {
    percents.forEach((percent) => {
      const trackPercent =
          Math.ceil(series.published_lesson_count * percent) ===
          series.progress.completed_lesson_count,
        percentCompleted = Math.floor(percent * 100)
      if (trackPercent && percentCompleted <= 75) {
        analytics.events.engagementCourseProgress(series.slug, percentCompleted)
      }
      if (trackPercent && percentCompleted === 100) {
        analytics.events.engagementCompletedCourse(series.slug)
      }
    })
  }
  return lessonView
}

const trackStartingCourse = (lessonView: {
  series: {progress: any; slug: string; published_lesson_count: any}
  lesson_slug: any
}) => {
  const series = lessonView.series
  const progress = series && lessonView.series.progress

  if (progress && progress.completed_lesson_count === 0) {
    analytics.events.engagementStartCourse(lessonView.series.slug)
  }

  return lessonView
}

const completeLesson = (lessonView: {
  complete_url?: any
  series: {progress: any; slug: string; published_lesson_count: any}
  lesson_slug: any
}) =>
  axios.put(lessonView.complete_url, {}, getOptions()).then(({data}) => data)

const onComplete = (lesson: any, collection?: any) => {
  return enqueueViewPost(viewKey(lesson, collection), () =>
    getOrCreateLessonView(lesson, collection)
      .then(trackStartingCourse)
      .then(completeLesson),
  ).then(trackPercentComplete)
}

const onEnded = async (lesson: {
  lesson_view_url: any
  slug: any
  tags: any[]
}) => {
  setEmailCaptureCookie(emailCaptureCookie + 1)

  if (lesson.lesson_view_url) {
    return await onComplete(lesson)
  } else {
    const pending = pendingViews.get(lesson.slug)
    if (pending) pending.ended = true
    return Promise.resolve()
  }
}

/**
 * Post what the player recorded before `lesson_view_url` arrived, once, for
 * the viewer the URL was granted to: the completion if the lesson already
 * ended, otherwise one create plus one increment per segment played while
 * waiting (RevenueShareQuery sums `segments`, and Rails' increment adds one
 * per call). Uses the same (lesson, collection) key and queue as the segment
 * path, so it can't race a segment into a second row. Does nothing without a
 * URL, without an open session for this owner, or without pending progress.
 */
const flushPendingLessonView = async (
  lesson: LessonResource,
  owner: string,
) => {
  if (!lesson?.lesson_view_url || !lesson.slug) return
  const pending = pendingViews.get(lesson.slug)
  if (!pending || pending.owner !== owner) return
  // consume: later segments carry the URL and post on their own
  pendingViews.set(lesson.slug, {owner, segments: 0, ended: false})

  if (pending.ended) {
    return await onComplete(lesson, pending.collection)
  }
  if (pending.segments < 1) return
  return await enqueueViewPost(
    viewKey(lesson, pending.collection),
    async () => {
      const created = await createLessonView(lesson, pending.collection)
      let lessonView = created
      for (let i = 0; i < pending.segments; i++) {
        lessonView = await incrementViewSegments(created)
      }
      return lessonView
    },
  )
}

function onError() {}

const PLAY_PREFS_KEY = 'egghead-player-prefs'

export const defaultSubtitlePreference = {
  id: null,
  kind: null,
  label: 'off',
  language: null,
}

export type PlayerPrefs = {
  volumeRate: number
  playbackRate: number

  autoplay: boolean
  videoQuality: {
    bitrate: any
    height: any
    id: string
    width: any
  }
  subtitle: {
    id: any
    kind: any
    label: any
    language: any
  }
  muted: boolean
  theater: boolean
  defaultView: string
  activeSidebarTab: number
  muteNotes: boolean
}

const defaultPlayerPreferences: PlayerPrefs = {
  volumeRate: 80,
  playbackRate: 1,
  autoplay: false,
  videoQuality: {
    bitrate: null,
    height: null,
    id: 'auto',
    width: null,
  },
  subtitle: defaultSubtitlePreference,
  muted: false,
  theater: false,
  defaultView: 'transcript',
  activeSidebarTab: 0,
  muteNotes: false,
}

export const getPlayerPrefs = () => {
  if (typeof window === 'undefined') {
    return defaultPlayerPreferences
  }

  return (
    cookies.get(PLAY_PREFS_KEY) ||
    cookies.set(PLAY_PREFS_KEY, defaultPlayerPreferences)
  )
}

export const savePlayerPrefs = (options: any) => {
  return cookies.set(PLAY_PREFS_KEY, {
    ...defaultPlayerPreferences,
    ...getPlayerPrefs(),
    ...options,
  })
}

export const useEggheadPlayerPrefs = () => {
  const [playerPrefs, setPlayerPrefs] = React.useState<PlayerPrefs>(
    getPlayerPrefs(),
  )

  const setPlayerPrefsOptions = React.useCallback((options: any) => {
    console.debug('setting player prefs', {options})
    const newPrefs = savePlayerPrefs(options)
    setPlayerPrefs(newPrefs)
  }, [])

  return {
    setPlayerPrefs: setPlayerPrefsOptions,
    getPlayerPrefs: React.useCallback(getPlayerPrefs, []),
    ...playerPrefs,
  }
}

export default function useEggheadPlayer(lesson: LessonResource) {
  const {setPlayerPrefs, ...playerPrefs} = useEggheadPlayerPrefs()

  React.useEffect(() => {
    setPlayerPrefs(getPlayerPrefs())
  }, [lesson.slug])

  return {
    onProgress,
    onEnded,
    onError,
    setPlayerPrefs,
    ...playerPrefs,
    getPlayerPrefs: React.useCallback(getPlayerPrefs, []),
  }
}

// onProgress/onEnded are module-level (shared progress state) and only reach
// callers through useEggheadPlayer; named exports let tests drive the real
// view-tracking path without rendering a player. flushPendingLessonView is
// used by useLessonViewUrl.
export {
  onProgress as trackLessonProgress,
  onEnded as trackLessonEnded,
  beginLessonViewSession,
  flushPendingLessonView,
}
