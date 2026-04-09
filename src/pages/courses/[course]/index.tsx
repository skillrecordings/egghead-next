import * as React from 'react'
import {loadPublicCourseShell} from '@/lib/playlists'
import {GetStaticPaths, GetStaticProps} from 'next'
import CollectionPageLayout from '@/components/layouts/collection-page-layout'
import MultiModuleCollectionPageLayout from '@/components/layouts/multi-module-collection-page-layout'
import PhpCollectionPageLayout from '@/components/layouts/php-collection-page-layout'
import ScrimbaPageLayout from '@/components/layouts/scrimba-course-layout'
import filter from 'lodash/filter'
import get from 'lodash/get'
import courseDependencies from '@/data/courseDependencies'
import {useViewer} from '@/context/viewer-context'
import {loadResourcesForCourse} from '@/lib/course-resources'
import type {CourseLessonShell} from '@/types'
import {logEvent} from '@/utils/structured-log'
import {withHeaderBannerStaticProps} from '@/server/with-header-banner-props'
import {isWatchLaterCourseSlug} from '@/lib/course-slugs'
import {getAllCourseBuilderPublicCourseSlugs} from '@/lib/load-course-builder-metadata-wrapper'

type CourseProps = {
  course: any
  fullLessons?: CourseLessonShell[]
}

type CourseAuthedBits = {
  favorited?: boolean
  toggle_favorite_url?: string | null
  rss_url?: string | null
}

const COURSE_REVALIDATE_SECONDS = 3600

const loadCourseAuthedBitsClient = async (
  slug: string,
): Promise<CourseAuthedBits | null> => {
  const response = await fetch(
    `/api/courses/${encodeURIComponent(slug)}/authed-bits`,
    {
      credentials: 'same-origin',
    },
  )

  if (!response.ok) return null

  const playlist = await response.json()
  return Object.keys(playlist ?? {}).length > 0 ? playlist : null
}

function sanitizeErrorMessage(error: unknown) {
  if (error == null) return null

  const raw = error instanceof Error ? error.message : String(error)
  const oneLine = raw.replace(/\s+/g, ' ').trim()

  if (!oneLine) return null

  const maxLength = 240
  return oneLine.length > maxLength
    ? `${oneLine.slice(0, maxLength)}...`
    : oneLine
}

const getStaticPathSummaryPayload = (count: number) => ({
  generated_at: null,
  window: null,
  requested_count: count,
  prebuilt_count: count,
  render_mode: 'isr',
  source: 'coursebuilder',
})

const getStaticPropsLogContext = (courseSlug?: string) => ({
  route: '/courses/[course]',
  page: 'course',
  course_slug: courseSlug,
})

const logCourseStaticPropsRender = ({
  courseSlug,
  durationMs,
  ok,
  isNotFound = false,
  isRedirect = false,
  error,
}: {
  courseSlug?: string
  durationMs: number
  ok: boolean
  isNotFound?: boolean
  isRedirect?: boolean
  error?: string
}) => {
  logEvent(
    ok ? 'info' : 'error',
    'static_props.render',
    {
      params: courseSlug ? `course=${courseSlug}` : '',
      duration_ms: durationMs,
      ok,
      is_not_found: isNotFound,
      is_redirect: isRedirect,
      render_mode: 'isr',
      ...(error ? {error} : {}),
    },
    getStaticPropsLogContext(courseSlug),
  )
}

const Course: React.FC<React.PropsWithChildren<CourseProps>> = (props) => {
  const {authToken} = useViewer()
  const [course, setCourse] = React.useState(props.course)

  React.useEffect(() => {
    setCourse(props.course)
  }, [props.course])

  React.useEffect(() => {
    let cancelled = false

    const loadAuthedBits = async () => {
      if (!authToken || !props.course?.slug) return

      try {
        const authedBits = await loadCourseAuthedBitsClient(props.course.slug)
        if (!cancelled && authedBits) {
          setCourse((current: any) => ({
            ...current,
            ...authedBits,
          }))
        }
      } catch {
        // fail open and keep the public shell cacheable
      }
    }

    loadAuthedBits()

    return () => {
      cancelled = true
    }
  }, [authToken, props.course?.slug])

  if (!course) return null

  const {
    slug,
    sections,
    lessons,
    courseBuilderLessons,
  }: {
    slug: string
    sections: any
    lessons: any
    courseBuilderLessons?: any
  } = course

  const items = get(course, 'items', [])

  // Prefer Course Builder lessons (new source) over Sanity, then fallback to fullLessons, then items
  // Course Builder is the authoritative source for new courses
  const courseLessons =
    courseBuilderLessons && courseBuilderLessons.length > 0
      ? courseBuilderLessons
      : lessons && lessons.length > 0
      ? lessons
      : props.fullLessons && props.fullLessons.length > 0
      ? props.fullLessons
      : filter(items, (item) => ['lesson', 'talk'].includes(item.type))

  const multiModuleCourse = courseDependencies(slug)

  switch (true) {
    case slug === 'a-complete-introduction-to-php-33d9d04c':
      return (
        <PhpCollectionPageLayout
          lessons={courseLessons}
          course={course}
          ogImageUrl={course.ogImage}
        />
      )
    case slug === 'build-ai-apps-with-chatgpt-dall-e-and-gpt-4-9bc61e99':
      return (
        <ScrimbaPageLayout
          sections={sections}
          lessons={courseLessons}
          course={course}
          ogImageUrl={course.ogImage}
        />
      )
    case multiModuleCourse?.multiModuleCourse:
      return (
        <MultiModuleCollectionPageLayout
          lessons={courseLessons}
          course={course}
          ogImageUrl={course.ogImage}
        />
      )
  }

  return (
    <CollectionPageLayout
      lessons={courseLessons}
      course={course}
      ogImageUrl={course.ogImage}
    />
  )
}

export default Course

const getSlugFromPath = (path: string) => {
  return path.split('/').pop()
}

export const getStaticPaths: GetStaticPaths = async () => {
  const courseSlugs = await getAllCourseBuilderPublicCourseSlugs()

  logEvent(
    'info',
    'course.static_paths.summary',
    getStaticPathSummaryPayload(courseSlugs.length),
  )

  return {
    paths: courseSlugs.map((course) => ({params: {course}})),
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = withHeaderBannerStaticProps(
  '/courses/[course]',
  async function ({params}) {
    const start = performance.now()
    const courseSlugParam = params?.course as string | undefined

    if (!courseSlugParam) {
      logCourseStaticPropsRender({
        durationMs: Math.round(performance.now() - start),
        ok: true,
        isNotFound: true,
      })

      return {
        notFound: true,
        revalidate: 60,
      }
    }

    const logContext = {
      ...getStaticPropsLogContext(courseSlugParam),
      render_mode: 'isr',
      suppress_info_logs: true,
    }

    if (isWatchLaterCourseSlug(courseSlugParam)) {
      logEvent(
        'warn',
        'course.static_props.redirect_watch_later',
        {
          course_slug: courseSlugParam,
          destination: '/bookmarks',
          render_mode: 'isr',
        },
        logContext,
      )

      logCourseStaticPropsRender({
        courseSlug: courseSlugParam,
        durationMs: Math.round(performance.now() - start),
        ok: true,
        isRedirect: true,
      })

      return {
        redirect: {
          destination: '/bookmarks',
          permanent: false,
        },
        revalidate: 300,
      }
    }

    try {
      const course = await loadPublicCourseShell(courseSlugParam, logContext)

      if (!course) {
        logEvent(
          'warn',
          'course.static_props.not_found',
          {
            course_slug: courseSlugParam,
            render_mode: 'isr',
          },
          logContext,
        )

        logCourseStaticPropsRender({
          courseSlug: courseSlugParam,
          durationMs: Math.round(performance.now() - start),
          ok: true,
          isNotFound: true,
        })

        return {
          notFound: true,
          revalidate: 300,
        }
      }

      const fullLessons = await loadResourcesForCourse(
        {
          slug: courseSlugParam,
        },
        logContext,
      )

      const resolvedCourseSlug = getSlugFromPath(course.path)

      if (resolvedCourseSlug !== courseSlugParam) {
        logEvent(
          'warn',
          'course.static_props.redirect_slug',
          {
            course_slug: courseSlugParam,
            canonical_slug: resolvedCourseSlug,
            canonical_path: course.path,
            render_mode: 'isr',
          },
          logContext,
        )

        logCourseStaticPropsRender({
          courseSlug: courseSlugParam,
          durationMs: Math.round(performance.now() - start),
          ok: true,
          isRedirect: true,
        })

        return {
          redirect: {
            destination: course.path,
            permanent: true,
          },
          revalidate: 60,
        }
      }

      logCourseStaticPropsRender({
        courseSlug: courseSlugParam,
        durationMs: Math.round(performance.now() - start),
        ok: true,
      })

      return {
        props: {
          course: {
            ...course,
            sections: course?.sections ?? null,
          },
          fullLessons,
        },
        revalidate: COURSE_REVALIDATE_SECONDS,
      }
    } catch (error) {
      logEvent(
        'error',
        'course.static_props.error',
        {
          course_slug: courseSlugParam,
          render_mode: 'isr',
          error_message: sanitizeErrorMessage(error),
        },
        logContext,
      )

      logCourseStaticPropsRender({
        courseSlug: courseSlugParam,
        durationMs: Math.round(performance.now() - start),
        ok: false,
        error: sanitizeErrorMessage(error) ?? 'unknown error',
      })

      throw error
    }
  },
)
