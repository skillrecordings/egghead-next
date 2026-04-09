import {
  getCourseBuilderCourseLessons,
  type CourseBuilderLesson,
} from '@/lib/load-course-builder-metadata-wrapper'
import type {CourseLessonShell} from '@/types'
import {logEvent, timeEvent, type LogContext} from '@/utils/structured-log'

type LoadResourcesForCourseParams = {
  slug?: string
  id?: number
  token?: string
}

function mapCourseBuilderLessonToShell(
  lesson: CourseBuilderLesson,
): CourseLessonShell {
  return {
    id: lesson.slug,
    slug: lesson.slug,
    title: lesson.title,
    description: '',
    path: lesson.path,
    type: lesson.type ?? 'lesson',
    duration: lesson.duration ?? 0,
    completed: false,
  }
}

export async function loadResourcesForCourse(
  params: LoadResourcesForCourseParams,
  logContext: LogContext = {},
): Promise<CourseLessonShell[]> {
  const startTime = Date.now()
  const {slug, id} = params

  if (!slug && !id) {
    throw new Error('loadResourcesForCourse requires a slug or id')
  }

  const courseBuilderLessons = slug
    ? await timeEvent(
        'course.getCourseBuilderCourseLessons.mysql',
        {slug},
        async () => getCourseBuilderCourseLessons(slug),
        logContext,
      )
    : null

  const lessons = (courseBuilderLessons ?? []).map(
    mapCourseBuilderLessonToShell,
  )

  logEvent(
    lessons.length > 0 ? 'info' : 'warn',
    'course.loadResourcesForCourse.summary',
    {
      slug,
      course_id: id,
      lessons_loaded: lessons.length,
      lessons_requested: lessons.length,
      duration_ms: Date.now() - startTime,
      source: 'coursebuilder',
      missing_lessons: lessons.length === 0,
    },
    logContext,
  )

  return lessons
}
