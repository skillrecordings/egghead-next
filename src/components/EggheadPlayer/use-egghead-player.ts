import * as React from 'react'
import cookies from 'utils/cookies'
import {track} from 'utils/analytics'
import getAccessTokenFromCookie from 'utils/get-access-token-from-cookie'
import axios from 'axios'
import {get, identity, isEmpty, pickBy} from 'lodash'
import {LessonResource} from 'types'

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
      createLessonView(lesson, list).then(incrementViewSegments).then(resolve)
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
    if (roundedProgress === 30) {
      track('started lesson', {
        lesson: lesson.slug,
        tags: lesson.tags.map((tag: {slug: any}) => tag.slug),
      })
    }

    return await storeProgress(roundedProgress, lesson)
  } else {
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
  const percents = [0.1, 0.25, 0.5, 0.75]
  if (series && series.progress && series.published_lesson_count) {
    percents.forEach((percent) => {
      const trackPercent =
          Math.ceil(series.published_lesson_count * percent) ===
          series.progress.completed_lesson_count,
        percentCompleted = Math.floor(percent * 100)
      if (trackPercent) {
        track('progress in course', {
          course: series.slug,
          percent_completed: percentCompleted,
        })
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
    track('started course', {
      first_lesson: lessonView.lesson_slug,
      lesson_count: series.published_lesson_count,
      course: lessonView.series.slug,
    })
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
  return getOrCreateLessonView(lesson, collection)
    .then(trackStartingCourse)
    .then(completeLesson)
    .then(trackPercentComplete)
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
    return Promise.resolve()
  }
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
