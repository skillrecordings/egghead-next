import {getGraphQLClient} from '@/utils/configured-graphql-client'
import {loadCourseMetadata} from '@/lib/courses'
import {loadLesson} from '@/lib/lessons'
import type {LessonResource} from '@/types'
import {logEvent, timeEvent, type LogContext} from '@/utils/structured-log'

type LoadResourcesForCourseParams = {
  slug?: string
  id?: number
  token?: string
}

type RailsPlaylistLesson = {
  slug: string
  path?: string
}

type RailsPlaylistItem =
  | {__typename: 'Lesson'; slug: string; path?: string}
  | {__typename: 'Playlist'; lessons?: RailsPlaylistLesson[]}
  | {__typename: 'Course'}

type RailsPlaylistResponse = {
  playlist?: {
    id: number
    slug: string
    items?: RailsPlaylistItem[]
  }
}

async function loadRailsPlaylistLessonSlugs(
  slug: string,
  logContext: LogContext,
): Promise<string[]> {
  const query = /* GraphQL */ `
    query getPlaylistLessonSlugs($slug: String!) {
      playlist(slug: $slug) {
        id
        slug
        items {
          __typename
          ... on Lesson {
            slug
            path
          }
          ... on Playlist {
            lessons {
              slug
              path
            }
          }
          ... on Course {
            __typename
          }
        }
      }
    }
  `

  try {
    const graphQLClient = getGraphQLClient()
    const {playlist} = (await timeEvent(
      'course.loadRailsPlaylistLessonSlugs.graphql',
      {slug},
      async () => graphQLClient.request(query, {slug}),
      logContext,
    )) as RailsPlaylistResponse

    const items = playlist?.items ?? []

    const lessonSlugs: string[] = []
    for (const item of items) {
      if (item.__typename === 'Lesson') {
        lessonSlugs.push(item.slug)
      } else if (item.__typename === 'Playlist') {
        const lessons = item.lessons ?? []
        for (const l of lessons) {
          if (l?.slug) lessonSlugs.push(l.slug)
        }
      }
    }

    logEvent(
      'info',
      'course.loadRailsPlaylistLessonSlugs.summary',
      {
        slug,
        lesson_slugs_count: lessonSlugs.length,
      },
      logContext,
    )

    return lessonSlugs
  } catch (e) {
    console.warn('loadResourcesForCourse: Error fetching Rails playlist', e)
    return []
  }
}

function deriveSlugFromPath(path?: string): string | null {
  if (!path) return null
  const parts = path.split('/')
  return parts[parts.length - 1] || null
}

async function loadSanityCourseLessonSlugsByIdOrSlug(
  id: number | undefined,
  slug: string | undefined,
  logContext: LogContext,
): Promise<string[]> {
  try {
    const sanityCourse = await timeEvent(
      'course.loadCourseMetadata.sanity',
      {slug, course_id: id},
      async () => loadCourseMetadata(Number(id || 0), slug || ''),
      logContext,
    )

    // Prefer sections if present, otherwise top-level lessons
    const sectionLessons = (sanityCourse?.sections ?? [])
      .flatMap((section: any) => section?.lessons ?? [])
      .map((l: any) => deriveSlugFromPath(l?.path))
      .filter(Boolean) as string[]

    const topLevelLessons = (sanityCourse?.lessons ?? [])
      .map((l: any) => deriveSlugFromPath(l?.path))
      .filter(Boolean) as string[]

    const slugs = sectionLessons.length > 0 ? sectionLessons : topLevelLessons

    logEvent(
      'info',
      'course.loadSanityCourseLessonSlugs.summary',
      {
        slug,
        course_id: id,
        lesson_slugs_count: slugs.length,
      },
      logContext,
    )

    return slugs
  } catch (e) {
    console.warn('loadResourcesForCourse: Error fetching Sanity course', e)
    return []
  }
}

export async function loadResourcesForCourse(
  params: LoadResourcesForCourseParams,
  logContext: LogContext = {},
): Promise<LessonResource[]> {
  const startTime = Date.now()
  const {slug, id} = params

  if (!slug && !id) {
    throw new Error('loadResourcesForCourse requires a slug or id')
  }

  // 1) Default to Rails for course membership (order source)
  let lessonSlugs: string[] = []
  if (slug) {
    lessonSlugs = await loadRailsPlaylistLessonSlugs(slug, logContext)
  }

  // 2) Fallback to Sanity for membership if Rails empty
  if (lessonSlugs.length === 0) {
    const sanitySlugs = await loadSanityCourseLessonSlugsByIdOrSlug(
      id,
      slug,
      logContext,
    )
    lessonSlugs = sanitySlugs
  }

  // 3) De-duplicate while preserving order
  const seen = new Set<string>()
  const orderedUniqueSlugs = lessonSlugs.filter((s) => {
    if (!s) return false
    if (seen.has(s)) return false
    seen.add(s)
    return true
  })

  logEvent(
    'info',
    'course.loadResourcesForCourse.resolve',
    {
      slug,
      course_id: id,
      ordered_unique_slugs_count: orderedUniqueSlugs.length,
    },
    logContext,
  )

  // 4) Resolve each lesson using existing per-lesson merge logic
  const mergedLessons = await Promise.all(
    orderedUniqueSlugs.map(async (lessonSlug) => {
      try {
        const lesson = await loadLesson(lessonSlug, undefined, false, {
          ...logContext,
          lesson_slug: lessonSlug,
        })
        return lesson
      } catch (e) {
        logEvent(
          'warn',
          'course.loadResourcesForCourse.lesson_error',
          {
            slug,
            lesson_slug: lessonSlug,
          },
          logContext,
        )
        return null
      }
    }),
  )

  // 5) Drop failures/nulls
  const lessons: LessonResource[] = mergedLessons.filter(
    Boolean,
  ) as LessonResource[]

  logEvent(
    'info',
    'course.loadResourcesForCourse.summary',
    {
      slug,
      course_id: id,
      lessons_loaded: lessons.length,
      lessons_requested: orderedUniqueSlugs.length,
      duration_ms: Date.now() - startTime,
    },
    logContext,
  )

  return lessons
}
