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

const onProgress = (lesson: LessonResource) => async (progress: {
  playedSeconds: any
}) => {
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

let emailCaptureCookie: any = {
  watchCount: 0,
}

const setEmailCaptureCookie = (captureCookie = {}) => {
  cookies.set('egghead-email', captureCookie)
  emailCaptureCookie = cookies.get('egghead-email')
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
  axios.put(lessonView.complete_url, {}, getOptions()).then(({data}) => {
    const lessonView = data
    const series = lessonView.series
    const courseProgress = series && lessonView.series.progress

    if (courseProgress && courseProgress.is_completed) {
      track('finished course', {
        final_lesson: lessonView.lesson_slug,
        course: lessonView.series.slug,
        enhanced_transcripts_complete:
          series.lesson_count - series.enhanced_transcript_count === 0,
        lesson_count: series.published_lesson_count,
      })
    }

    return lessonView
  })

const onComplete = (lesson: any, collection?: any) => {
  return getOrCreateLessonView(lesson, collection)
    .then(trackStartingCourse)
    .then(completeLesson)
    .then(trackPercentComplete)
}

const onEnded = (lesson: {
  lesson_view_url: any
  slug: any
  tags: any[]
}) => async () => {
  setEmailCaptureCookie({
    ...emailCaptureCookie,
    watchCount: emailCaptureCookie.watchCount + 1,
  })

  if (lesson.lesson_view_url) {
    return await onComplete(lesson)
  } else {
    return Promise.resolve()
  }
}

function onError() {}

const PLAY_PREFS_KEY = 'egghead-player-prefs'

const defaultPlayerPreferences = {
  volumeRate: 80,
  playbackRate: 1,
  autoplay: false,
  videoQuality: {
    bitrate: null,
    height: null,
    id: 'auto',
    width: null,
  },
  subtitle: {
    id: null,
    kind: null,
    label: 'off',
    lang: null,
  },
  muted: false,
  theater: false
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
  const [playerPrefs, setPlayerPrefs] = React.useState<any>()
  React.useEffect(() => {
    setPlayerPrefs(getPlayerPrefs())
  }, [])

  const setPlayerPrefsCallback = React.useCallback((options: any) => {
    setPlayerPrefs(savePlayerPrefs(options))
  }, [])

  return {
    setPlayerPrefs: setPlayerPrefsCallback,
    ...playerPrefs,
  }
}

export default function useEggheadPlayer(lesson: LessonResource) {
  const [playerPrefs, setPlayerPrefs] = React.useState<any>()

  React.useEffect(() => {
    setPlayerPrefs(getPlayerPrefs())
  }, [lesson.slug])

  const onProgressCallback = React.useCallback(onProgress(lesson), [lesson])

  const onEndedCallback = React.useCallback(onEnded(lesson), [lesson])

  const setPlayerPrefsCallback = React.useCallback((options: any) => {
    setPlayerPrefs(savePlayerPrefs(options))
  }, [])

  return {
    onProgress: onProgressCallback,
    onEnded: onEndedCallback,
    onError,
    setPlayerPrefs: setPlayerPrefsCallback,
    ...playerPrefs,
  }
}
