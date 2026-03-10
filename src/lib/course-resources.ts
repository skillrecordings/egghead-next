import {z} from 'zod'
import {pgQuery} from '@/db'
import {getGraphQLClient} from '@/utils/configured-graphql-client'
import {loadCourseMetadata} from '@/lib/courses'
import {loadLesson} from '@/lib/lessons'
import type {CourseLessonShell} from '@/types'
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

const PgCourseLessonRowSchema = z.object({
  id: z.number(),
  slug: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  duration: z.number().nullable(),
  thumb_url: z.string().nullable(),
  published_at: z.string().nullable(),
  updated_at: z.string().nullable(),
  created_at: z.string().nullable(),
  free_forever: z.boolean().nullable(),
  state: z.string().nullable(),
  type: z.string().nullable(),
  access_state: z.string().nullable(),
  parent_row_order: z.number().nullable(),
  child_row_order: z.number().nullable(),
})

type PgCourseLessonRow = z.infer<typeof PgCourseLessonRowSchema>

const PUBLIC_VIEWABLE_PLAYLIST_STATES = [
  'published',
  'approved',
  'flagged',
  'revised',
  'retired',
]

const PUBLIC_VIEWABLE_LESSON_STATES = [
  'published',
  'approved',
  'flagged',
  'revised',
  'retired',
]

function mapPgCourseLessonRowToShell(
  row: PgCourseLessonRow,
): CourseLessonShell {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description ?? '',
    path: `/lessons/${row.slug}`,
    type: row.type ?? 'lesson',
    duration: row.duration ?? 0,
    thumb_url: row.thumb_url ?? undefined,
    icon_url: row.thumb_url ?? undefined,
    completed: false,
    free_forever: Boolean(row.free_forever),
    published_at: row.published_at ?? undefined,
    updated_at: row.updated_at ?? undefined,
    created_at: row.created_at ?? undefined,
    access_state: row.access_state ?? undefined,
  }
}

function isDefined<T>(value: T | null): value is T {
  return value !== null
}

async function loadPgCourseLessons(
  slug: string,
  logContext: LogContext,
): Promise<CourseLessonShell[]> {
  const sql = `
    WITH target_playlist AS (
      SELECT p.id, p.slug
      FROM playlists p
      WHERE p.slug = $1
        AND p.site = 'egghead.io'
        AND p.visibility_state = 'indexed'
        AND p.state = ANY($2::text[])
      LIMIT 1
    ),
    top_level_lessons AS (
      SELECT
        t.row_order AS parent_row_order,
        0::integer AS child_row_order,
        l.id,
        l.slug,
        l.title,
        l.summary AS description,
        l.duration,
        l.thumb_url,
        l.published_at,
        l.updated_at,
        l.created_at,
        l.free_forever,
        l.state,
        l.resource_type AS type,
        CASE
          WHEN l.free_forever THEN 'free'
          WHEN l.is_pro_content THEN 'pro'
          ELSE 'free'
        END AS access_state
      FROM target_playlist p
      JOIN tracklists t
        ON t.playlist_id = p.id
       AND t.tracklistable_type = 'Lesson'
      JOIN lessons l
        ON l.id = t.tracklistable_id
      WHERE l.state = ANY($3::text[])
    ),
    nested_playlist_lessons AS (
      SELECT
        t.row_order AS parent_row_order,
        nt.row_order AS child_row_order,
        l.id,
        l.slug,
        l.title,
        l.summary AS description,
        l.duration,
        l.thumb_url,
        l.published_at,
        l.updated_at,
        l.created_at,
        l.free_forever,
        l.state,
        l.resource_type AS type,
        CASE
          WHEN l.free_forever THEN 'free'
          WHEN l.is_pro_content THEN 'pro'
          ELSE 'free'
        END AS access_state
      FROM target_playlist p
      JOIN tracklists t
        ON t.playlist_id = p.id
       AND t.tracklistable_type = 'Playlist'
      JOIN tracklists nt
        ON nt.playlist_id = t.tracklistable_id
       AND nt.tracklistable_type = 'Lesson'
      JOIN lessons l
        ON l.id = nt.tracklistable_id
      WHERE l.state = ANY($3::text[])
    ),
    ordered_lessons AS (
      SELECT * FROM top_level_lessons
      UNION ALL
      SELECT * FROM nested_playlist_lessons
    ),
    deduped AS (
      SELECT *,
        row_number() OVER (
          PARTITION BY slug
          ORDER BY parent_row_order ASC NULLS LAST, child_row_order ASC NULLS LAST, id ASC
        ) AS slug_rank
      FROM ordered_lessons
    )
    SELECT
      id,
      slug,
      title,
      description,
      duration,
      thumb_url,
      published_at,
      updated_at,
      created_at,
      free_forever,
      state,
      type,
      access_state,
      parent_row_order,
      child_row_order
    FROM deduped
    WHERE slug_rank = 1
    ORDER BY parent_row_order ASC NULLS LAST, child_row_order ASC NULLS LAST, id ASC
  `

  try {
    const result = await timeEvent(
      'course.loadResourcesForCourse.pg',
      {slug},
      async () =>
        pgQuery(sql, [
          slug,
          PUBLIC_VIEWABLE_PLAYLIST_STATES,
          PUBLIC_VIEWABLE_LESSON_STATES,
        ]),
      logContext,
    )

    const parsedRows = PgCourseLessonRowSchema.array().safeParse(
      result?.rows ?? [],
    )

    if (!parsedRows.success) {
      const firstIssue = parsedRows.error.issues[0]

      logEvent(
        'warn',
        'course.loadResourcesForCourse.pg_invalid_rows',
        {
          slug,
          issues_count: parsedRows.error.issues.length,
          first_issue_path: firstIssue?.path?.join('.') ?? null,
          first_issue_message: firstIssue?.message ?? null,
        },
        logContext,
      )

      return []
    }

    const rows = parsedRows.data

    logEvent(
      'info',
      'course.loadResourcesForCourse.pg_summary',
      {
        slug,
        lessons_loaded: rows.length,
      },
      logContext,
    )

    return rows.map(mapPgCourseLessonRowToShell)
  } catch (e) {
    logEvent(
      'warn',
      'course.loadResourcesForCourse.pg_error',
      {
        slug,
      },
      logContext,
    )

    return []
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

async function loadLegacyMergedLessons(
  params: LoadResourcesForCourseParams,
  logContext: LogContext,
): Promise<CourseLessonShell[]> {
  const {slug, id} = params

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

  return mergedLessons.filter(isDefined)
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

  const pgLessons = slug ? await loadPgCourseLessons(slug, logContext) : []

  if (pgLessons.length > 0) {
    logEvent(
      'info',
      'course.loadResourcesForCourse.summary',
      {
        slug,
        course_id: id,
        lessons_loaded: pgLessons.length,
        lessons_requested: pgLessons.length,
        duration_ms: Date.now() - startTime,
        source: 'pg',
      },
      logContext,
    )

    return pgLessons
  }

  const lessons = await loadLegacyMergedLessons(params, logContext)

  logEvent(
    'info',
    'course.loadResourcesForCourse.summary',
    {
      slug,
      course_id: id,
      lessons_loaded: lessons.length,
      lessons_requested: lessons.length,
      duration_ms: Date.now() - startTime,
      source: 'legacy',
    },
    logContext,
  )

  return lessons
}
