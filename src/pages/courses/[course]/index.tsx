import * as React from 'react'
import {loadPublicCourseShell} from '@/lib/playlists'
import {GetServerSideProps} from 'next'
import {withSSRLogging} from '@/lib/logging'
import CollectionPageLayout from '@/components/layouts/collection-page-layout'
import MultiModuleCollectionPageLayout from '@/components/layouts/multi-module-collection-page-layout'
import PhpCollectionPageLayout from '@/components/layouts/php-collection-page-layout'
import ScrimbaPageLayout from '@/components/layouts/scrimba-course-layout'
import filter from 'lodash/filter'
import get from 'lodash/get'
import getTracer from '@/utils/honeycomb-tracer'
import crypto from 'crypto'
import {setupHttpTracing} from '@/utils/tracing-js/dist/src'
import courseDependencies from '@/data/courseDependencies'
import {ACCESS_TOKEN_KEY} from '@/utils/auth'
import {useViewer} from '@/context/viewer-context'
import {loadResourcesForCourse} from '@/lib/course-resources'
import type {CourseLessonShell} from '@/types'
import {logEvent} from '@/utils/structured-log'
import {canonicalizeInternalQueryParams} from '@/server/nxtp-query'
const tracer = getTracer('course-page')

type CourseProps = {
  course: any
  fullLessons?: CourseLessonShell[]
}

type CourseAuthedBits = {
  favorited?: boolean
  toggle_favorite_url?: string | null
  rss_url?: string | null
}

const PUBLIC_PAGE_CACHE_CONTROL =
  'public, s-maxage=300, stale-while-revalidate=3600'

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

const setCourseCacheHeaders = (
  res: {setHeader: (name: string, value: string) => void},
  blocker: string | null = null,
) => {
  res.setHeader('Cache-Control', PUBLIC_PAGE_CACHE_CONTROL)
  res.setHeader('x-egghead-cache-scope', 'public-swr')
  res.setHeader('x-egghead-cache-blocker', blocker ?? 'none')
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

export const getServerSideProps: GetServerSideProps = withSSRLogging(
  async ({res, req, params, query}) => {
    setupHttpTracing({name: getServerSideProps.name, tracer, req, res})
    const requestId = crypto.randomUUID()
    res.setHeader('x-egghead-request-id', requestId)
    const logContext = {
      request_id: requestId,
      route: '/courses/[course]',
      page: 'course',
      course_slug: params?.course as string,
    }

    try {
      const courseSlugParam = params?.course as string

      const canonicalRedirect = canonicalizeInternalQueryParams({
        pathname: `/courses/${courseSlugParam}`,
        query,
        omitKeys: ['course'],
      })

      if (canonicalRedirect) {
        setCourseCacheHeaders(res, 'internal_query_params')
        return {
          redirect: {
            destination: canonicalRedirect.destination,
            permanent: false,
          },
        }
      }

      const course = await loadPublicCourseShell(courseSlugParam, logContext)

      if (!course) {
        throw new Error(
          `Unable to load public course shell for ${courseSlugParam}`,
        )
      }

      const fullLessons = await loadResourcesForCourse(
        {
          slug: courseSlugParam,
        },
        logContext,
      )

      const resolvedCourse = course
      const cachePolicy = 'public-swr'
      const cacheBlocker: string | null = null

      const courseSlug = getSlugFromPath(resolvedCourse?.path)
      if (resolvedCourse && courseSlug !== params?.course) {
        return {
          redirect: {
            destination: resolvedCourse.path,
            permanent: true,
          },
        }
      } else {
        setCourseCacheHeaders(res, cacheBlocker)
        logEvent(
          'info',
          'page.cache.policy',
          {
            route: '/courses/[course]',
            course_slug: courseSlugParam,
            policy: cachePolicy,
            cache_blocker: cacheBlocker,
          },
          logContext,
        )

        return {
          props: {
            course: {
              ...resolvedCourse,
              sections: resolvedCourse?.sections ?? null,
            },
            fullLessons,
          },
        }
      }
    } catch (e) {
      logEvent(
        'warn',
        'course.ssr.catch',
        {
          course_slug: params?.course as string,
          has_token: Boolean(req.cookies[ACCESS_TOKEN_KEY]),
          error_message: sanitizeErrorMessage(e),
        },
        logContext,
      )

      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      }
    }
  },
)
