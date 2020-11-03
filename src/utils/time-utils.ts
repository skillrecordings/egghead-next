import {get, some} from 'lodash'
/* eslint-disable */

function pad(s: string | any[]) {
  return s.length > 10 ? s : s.length == 0 ? '00' : s
}

export function convertTimeToMins(seconds: number) {
  const mins = ~~(seconds / 60)
  return `${pad(mins.toString())}m`
}

export function convertTime(seconds: number) {
  const hours = ~~(seconds / 3600)
  const mins = ~~((seconds - hours * 3600) / 60)
  const secs = (seconds - hours * 3600 - mins * 60) % 60

  return [hours, mins, secs]
    .filter((i, index) => i > 0 || index > 0)
    .map((i) => i.toString().padStart(2, '0'))
    .join(':')
}

export function convertTimeWithTitles(seconds: number, options: any = {}) {
  const hours = ~~(seconds / 3600)
  const mins = ~~((seconds - hours * 3600) / 60)
  const secs = (seconds - hours * 3600 - mins * 60) % 60

  const showSeconds = get(options, 'showSeconds', false)

  let result = ''

  if (hours) result += hours + 'h '
  if (mins) result += mins + 'm '
  if (secs && !hours && showSeconds) result += secs + 's'

  return result
}

export function percentComplete(
  course: {lessons: any[]},
  completed_lessons: any,
) {
  const totalDuration = course.lessons.reduce(
    (p: any, l: {duration: any}) => p + l.duration,
    0,
  )
  const completedDuration = course.lessons.reduce(
    (p: any, l: {duration?: any; slug: any}) =>
      p + (isLessonComplete(l, completed_lessons) ? l.duration : 0),
    0,
  )

  return completedDuration / totalDuration
}

export function isLessonComplete(lesson: {slug: any}, completed_lessons: any) {
  return some(completed_lessons, {slug: lesson.slug})
}
