import {request} from 'graphql-request'
import getAccessTokenFromCookie from '@/utils/get-access-token-from-cookie'
import {getGraphQLClient} from '../utils/configured-graphql-client'
import config from './config'
import {pgQuery} from '@/db'
import {loadCourseMetadata} from './courses'
import {
  loadCourseBuilderMetadata,
  getCourseBuilderLessonStates,
  getCourseBuilderCourseLessons,
} from './load-course-builder-metadata-wrapper'
import {logEvent, timeEvent, type LogContext} from '@/utils/structured-log'
import {sanityAllowlistAllowsCourse} from '@/lib/sanity-allowlist'

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

const DISPLAYED_TAG_CONTEXTS = [
  'frameworks',
  'libraries',
  'tools',
  'languages',
  'platforms',
  'topics',
]

const DEFAULT_COURSE_IMAGE_URL =
  'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1567198446/og-image-assets/eggo.svg'

type PgCourseTagRow = {
  id: number
  name: string
  label: string | null
  http_url: string | null
  image_file_name: string | null
}

type PgCourseShellRow = {
  id: number
  slug: string
  title: string
  description: string | null
  access_state: string | null
  visibility_state: string | null
  state: string | null
  created_at: string | null
  updated_at: string | null
  published_at: string | null
  owner_id: number
  owner_full_name: string | null
  owner_avatar_url: string | null
  instructor_id: number | null
  instructor_full_name: string | null
  instructor_slug: string | null
  instructor_avatar_url: string | null
  instructor_bio_short: string | null
  instructor_twitter: string | null
  square_cover_file_name: string | null
  average_rating_out_of_5: number | null
  rating_count: number | null
  watched_count: number | null
  duration: number | null
  tags: PgCourseTagRow[] | null
}

type PgCourseItemRow = {
  row_order: number | null
  tracklistable_type: string
  lesson_id: number | null
  lesson_slug: string | null
  lesson_title: string | null
  lesson_description: string | null
  lesson_duration: number | null
  lesson_thumb_url: string | null
  lesson_created_at: string | null
  lesson_updated_at: string | null
  lesson_published_at: string | null
  lesson_type: string | null
  playlist_id: number | null
  playlist_slug: string | null
  playlist_title: string | null
  playlist_description: string | null
  playlist_square_cover_file_name: string | null
  playlist_duration: number | null
  playlist_lessons: any[] | null
}

type AuthedCourseBits = {
  favorited?: boolean
  toggle_favorite_url?: string | null
  rss_url?: string | null
} | null

function toPaperclipPartition(id: number) {
  const normalized = String(id).padStart(9, '0')
  return `${normalized.slice(0, 3)}/${normalized.slice(
    3,
    6,
  )}/${normalized.slice(6, 9)}`
}

function buildPaperclipUrl(
  classSegment: string,
  attachmentSegment: string,
  id?: number | null,
  style?: string,
  fileName?: string | null,
) {
  const host = process.env.CLOUDFRONT_IMAGES_DOMAIN

  if (!host || !id || !style || !fileName) return undefined

  return `https://${host}/${classSegment}/${attachmentSegment}/${toPaperclipPartition(
    id,
  )}/${style}/${encodeURIComponent(fileName)}`
}

function mapCourseTag(row: PgCourseTagRow) {
  return {
    name: row.name,
    label: row.label ?? row.name,
    http_url: row.http_url,
    image_url: buildPaperclipUrl(
      'tags',
      'images',
      row.id,
      'thumb',
      row.image_file_name,
    ),
  }
}

function mapLessonShell(row: {
  lesson_id?: number | null
  lesson_slug?: string | null
  lesson_title?: string | null
  lesson_description?: string | null
  lesson_duration?: number | null
  lesson_thumb_url?: string | null
  lesson_created_at?: string | null
  lesson_updated_at?: string | null
  lesson_published_at?: string | null
  lesson_type?: string | null
}) {
  if (!row.lesson_slug || !row.lesson_title) return null

  return {
    slug: row.lesson_slug,
    title: row.lesson_title,
    description: row.lesson_description ?? '',
    path: `/lessons/${row.lesson_slug}`,
    http_url: `https://egghead.io/lessons/${row.lesson_slug}`,
    icon_url: row.lesson_thumb_url ?? undefined,
    type: row.lesson_type ?? 'lesson',
    duration: row.lesson_duration ?? 0,
    thumb_url: row.lesson_thumb_url ?? undefined,
    created_at: row.lesson_created_at ?? undefined,
    updated_at: row.lesson_updated_at ?? undefined,
    published_at: row.lesson_published_at ?? undefined,
  }
}

async function loadPgCourseShellCore(
  slug: string,
  logContext: LogContext,
): Promise<PgCourseShellRow | null> {
  const sql = `
    WITH target_playlist AS (
      SELECT
        p.id,
        p.slug,
        p.title,
        p.description,
        p.access_state,
        p.visibility_state,
        p.state,
        p.created_at,
        p.updated_at,
        p.published_at,
        p.owner_id,
        p.square_cover_file_name
      FROM playlists p
      WHERE p.slug = $1
        AND p.site = 'egghead.io'
        AND p.visibility_state = 'indexed'
        AND p.state = ANY($2::text[])
      LIMIT 1
    )
    SELECT
      p.id,
      p.slug,
      p.title,
      p.description,
      p.access_state,
      p.visibility_state,
      p.state,
      p.created_at,
      p.updated_at,
      p.published_at,
      p.owner_id,
      TRIM(CONCAT_WS(' ', owner_user.first_name, owner_user.last_name)) AS owner_full_name,
      owner_user.avatar_url AS owner_avatar_url,
      instructor.id AS instructor_id,
      TRIM(CONCAT_WS(' ', instructor.first_name, instructor.last_name)) AS instructor_full_name,
      instructor.slug AS instructor_slug,
      owner_user.avatar_url AS instructor_avatar_url,
      instructor.bio_short AS instructor_bio_short,
      instructor.twitter AS instructor_twitter,
      p.square_cover_file_name,
      (
        SELECT AVG(r.rating)::float
        FROM ratings r
        WHERE r.rateable_type = 'Playlist'
          AND r.rateable_id = p.id
      ) AS average_rating_out_of_5,
      (
        SELECT COUNT(*)::int
        FROM ratings r
        WHERE r.rateable_type = 'Playlist'
          AND r.rateable_id = p.id
      ) AS rating_count,
      (
        SELECT COUNT(*)::int
        FROM series_progresses sp
        WHERE sp.progressable_type = 'Playlist'
          AND sp.progressable_id = p.id
          AND sp.is_complete = true
      ) AS watched_count,
      (
        WITH top_level_lessons AS (
          SELECT COALESCE(l.duration, 0) AS duration
          FROM tracklists t
          JOIN lessons l
            ON l.id = t.tracklistable_id
           AND t.tracklistable_type = 'Lesson'
          WHERE t.playlist_id = p.id
            AND l.state = ANY($3::text[])
        ),
        nested_playlist_lessons AS (
          SELECT COALESCE(l.duration, 0) AS duration
          FROM tracklists t
          JOIN tracklists nt
            ON nt.playlist_id = t.tracklistable_id
           AND t.tracklistable_type = 'Playlist'
           AND nt.tracklistable_type = 'Lesson'
          JOIN lessons l
            ON l.id = nt.tracklistable_id
          WHERE t.playlist_id = p.id
            AND l.state = ANY($3::text[])
        )
        SELECT COALESCE(SUM(duration), 0)::int
        FROM (
          SELECT duration FROM top_level_lessons
          UNION ALL
          SELECT duration FROM nested_playlist_lessons
        ) durations
      ) AS duration,
      COALESCE((
        SELECT JSON_AGG(
          JSON_BUILD_OBJECT(
            'id', tags.id,
            'name', tags.name,
            'label', COALESCE(tags.label, tags.name),
            'http_url', tags.url,
            'image_file_name', tags.image_file_name
          )
          ORDER BY ARRAY_POSITION($4::text[], taggings.context), tags.popularity_order NULLS LAST, tags.name
        )
        FROM taggings
        JOIN tags ON tags.id = taggings.tag_id
        WHERE taggings.taggable_type = 'Playlist'
          AND taggings.taggable_id = p.id
          AND taggings.context = ANY($4::text[])
      ), '[]'::json) AS tags
    FROM target_playlist p
    JOIN users owner_user ON owner_user.id = p.owner_id
    LEFT JOIN instructors instructor ON instructor.user_id = owner_user.id
  `

  try {
    const result = await timeEvent(
      'course.loadPublicCourseShell.pg_core',
      {slug},
      async () =>
        pgQuery(sql, [
          slug,
          PUBLIC_VIEWABLE_PLAYLIST_STATES,
          PUBLIC_VIEWABLE_LESSON_STATES,
          DISPLAYED_TAG_CONTEXTS,
        ]),
      logContext,
    )

    return ((result?.rows ?? [])[0] as PgCourseShellRow | undefined) ?? null
  } catch {
    logEvent(
      'warn',
      'course.loadPublicCourseShell.pg_core_error',
      {slug},
      logContext,
    )
    return null
  }
}

async function loadPgCourseShellItems(
  slug: string,
  logContext: LogContext,
): Promise<PgCourseItemRow[] | null> {
  const sql = `
    WITH target_playlist AS (
      SELECT p.id
      FROM playlists p
      WHERE p.slug = $1
        AND p.site = 'egghead.io'
        AND p.visibility_state = 'indexed'
        AND p.state = ANY($2::text[])
      LIMIT 1
    )
    SELECT
      t.row_order,
      t.tracklistable_type,
      lesson.id AS lesson_id,
      lesson.slug AS lesson_slug,
      lesson.title AS lesson_title,
      lesson.summary AS lesson_description,
      lesson.duration AS lesson_duration,
      lesson.thumb_url AS lesson_thumb_url,
      lesson.created_at AS lesson_created_at,
      lesson.updated_at AS lesson_updated_at,
      lesson.published_at AS lesson_published_at,
      lesson.resource_type AS lesson_type,
      child_playlist.id AS playlist_id,
      child_playlist.slug AS playlist_slug,
      child_playlist.title AS playlist_title,
      child_playlist.description AS playlist_description,
      child_playlist.square_cover_file_name AS playlist_square_cover_file_name,
      nested_playlist.duration AS playlist_duration,
      nested_playlist.lessons AS playlist_lessons
    FROM target_playlist p
    JOIN tracklists t ON t.playlist_id = p.id
    LEFT JOIN lessons lesson
      ON t.tracklistable_type = 'Lesson'
     AND lesson.id = t.tracklistable_id
     AND lesson.state = ANY($3::text[])
    LEFT JOIN playlists child_playlist
      ON t.tracklistable_type = 'Playlist'
     AND child_playlist.id = t.tracklistable_id
     AND child_playlist.state = ANY($2::text[])
    LEFT JOIN LATERAL (
      SELECT
        COALESCE(SUM(COALESCE(nested_lesson.duration, 0)), 0)::int AS duration,
        COALESCE(
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'lesson_id', nested_lesson.id,
              'lesson_slug', nested_lesson.slug,
              'lesson_title', nested_lesson.title,
              'lesson_description', nested_lesson.summary,
              'lesson_duration', nested_lesson.duration,
              'lesson_thumb_url', nested_lesson.thumb_url,
              'lesson_created_at', nested_lesson.created_at,
              'lesson_updated_at', nested_lesson.updated_at,
              'lesson_published_at', nested_lesson.published_at,
              'lesson_type', nested_lesson.resource_type
            )
            ORDER BY nested_tracklist.row_order
          ),
          '[]'::json
        ) AS lessons
      FROM tracklists nested_tracklist
      JOIN lessons nested_lesson
        ON nested_tracklist.tracklistable_type = 'Lesson'
       AND nested_lesson.id = nested_tracklist.tracklistable_id
      WHERE child_playlist.id IS NOT NULL
        AND nested_tracklist.playlist_id = child_playlist.id
        AND nested_lesson.state = ANY($3::text[])
    ) nested_playlist ON true
    ORDER BY t.row_order ASC NULLS LAST, t.id ASC
  `

  try {
    const result = await timeEvent(
      'course.loadPublicCourseShell.pg_items',
      {slug},
      async () =>
        pgQuery(sql, [
          slug,
          PUBLIC_VIEWABLE_PLAYLIST_STATES,
          PUBLIC_VIEWABLE_LESSON_STATES,
        ]),
      logContext,
    )

    return (result?.rows ?? []) as PgCourseItemRow[]
  } catch {
    logEvent(
      'warn',
      'course.loadPublicCourseShell.pg_items_error',
      {slug},
      logContext,
    )
    return null
  }
}

async function loadPgPublicCourseShell(slug: string, logContext: LogContext) {
  const core = await loadPgCourseShellCore(slug, logContext)
  if (!core) return null

  const itemRows = await loadPgCourseShellItems(slug, logContext)
  if (!itemRows) return null

  const unsupportedItemTypes = itemRows
    .map((row) => row.tracklistable_type)
    .filter((type) => !['Lesson', 'Playlist'].includes(type))

  if (unsupportedItemTypes.length > 0) {
    logEvent(
      'info',
      'course.loadPublicCourseShell.pg_fallback',
      {
        slug,
        reason: 'unsupported_tracklistable_types',
        unsupported_item_types: Array.from(new Set(unsupportedItemTypes)),
      },
      logContext,
    )
    return null
  }

  const tags = (core.tags ?? []).map(mapCourseTag)
  const squareCover480Url = buildPaperclipUrl(
    'playlists',
    'square_covers',
    core.id,
    'square_480',
    core.square_cover_file_name,
  )
  const squareCoverThumbUrl = buildPaperclipUrl(
    'playlists',
    'square_covers',
    core.id,
    'thumb',
    core.square_cover_file_name,
  )

  const items = itemRows
    .map((row) => {
      if (row.tracklistable_type === 'Lesson') {
        return mapLessonShell(row)
      }

      if (row.tracklistable_type === 'Playlist' && row.playlist_slug) {
        const playlistLessons = (row.playlist_lessons ?? [])
          .map((lessonRow) => mapLessonShell(lessonRow))
          .filter(Boolean)

        return {
          slug: row.playlist_slug,
          title: row.playlist_title,
          description: row.playlist_description ?? '',
          path: `/courses/${row.playlist_slug}`,
          square_cover_url: buildPaperclipUrl(
            'playlists',
            'square_covers',
            row.playlist_id,
            'thumb',
            row.playlist_square_cover_file_name,
          ),
          type: 'playlist',
          url: undefined,
          duration: row.playlist_duration ?? 0,
          lessons: playlistLessons,
        }
      }

      return null
    })
    .filter(Boolean)

  logEvent(
    'info',
    'course.loadPublicCourseShell.pg_summary',
    {
      slug,
      item_count: items.length,
      tag_count: tags.length,
      lessons_in_nested_playlists: items
        .filter((item: any) => item?.type === 'playlist')
        .reduce(
          (count: number, playlist: any) =>
            count + (playlist.lessons?.length ?? 0),
          0,
        ),
    },
    logContext,
  )

  return {
    id: core.id,
    slug: core.slug,
    title: core.title,
    description: core.description ?? '',
    image_thumb_url:
      squareCoverThumbUrl ??
      tags.find((tag) => tag.image_url)?.image_url ??
      DEFAULT_COURSE_IMAGE_URL,
    square_cover_480_url: squareCover480Url,
    average_rating_out_of_5: core.average_rating_out_of_5 ?? 0,
    rating_count: core.rating_count ?? 0,
    watched_count: core.watched_count ?? 0,
    path: `/courses/${core.slug}`,
    url: `https://egghead.io/courses/${core.slug}`,
    duration: core.duration ?? 0,
    type: 'playlist',
    created_at: core.created_at,
    updated_at: core.updated_at,
    published_at: core.published_at,
    access_state: core.access_state,
    visibility_state: core.visibility_state,
    state: core.state,
    tags,
    items,
    instructor: core.instructor_id
      ? {
          id: core.instructor_id,
          full_name: core.instructor_full_name,
          slug: core.instructor_slug,
          avatar_url: core.instructor_avatar_url,
          avatar_64_url: core.instructor_avatar_url,
          bio_short: core.instructor_bio_short,
          twitter: core.instructor_twitter,
        }
      : null,
    owner: {
      id: core.owner_id,
      full_name: core.owner_full_name,
      avatar_url: core.owner_avatar_url,
    },
  }
}

function filterCourseItemsByLessonStates(
  items: any[] = [],
  lessonStates: Map<string, string>,
) {
  return items.filter((item: any) => {
    if (item?.slug && lessonStates.has(item.slug)) {
      return lessonStates.get(item.slug) === 'published'
    }

    return true
  })
}

function filterCourseSectionsByLessonStates(
  sections: any[] = [],
  lessonStates: Map<string, string>,
) {
  return sections.map((section: any) => ({
    ...section,
    lessons:
      section?.lessons?.filter((lesson: any) => {
        if (lesson?.slug && lessonStates.has(lesson.slug)) {
          return lessonStates.get(lesson.slug) === 'published'
        }

        return true
      }) ?? [],
  }))
}

async function mergeCourseShellSources(
  playlist: any,
  slug: string,
  logContext: LogContext,
) {
  const courseMetaAllowlist = await sanityAllowlistAllowsCourse(
    {slug: playlist.slug, courseId: playlist.id},
    logContext,
  )

  const courseMeta =
    courseMetaAllowlist.ready && !courseMetaAllowlist.allowed
      ? null
      : await timeEvent(
          'course.loadCourseMetadata.sanity',
          {slug, course_id: playlist.id},
          async () => loadCourseMetadata(playlist.id, playlist.slug),
          logContext,
        )

  const courseBuilderMetadata = await timeEvent(
    'course.loadCourseBuilderMetadata.mysql',
    {slug},
    async () => loadCourseBuilderMetadata(playlist.slug),
    logContext,
  )
  const lessonStates = await timeEvent(
    'course.getCourseBuilderLessonStates.mysql',
    {slug},
    async () => getCourseBuilderLessonStates(playlist.slug),
    logContext,
  )
  const courseBuilderLessons = await timeEvent(
    'course.getCourseBuilderCourseLessons.mysql',
    {slug},
    async () => getCourseBuilderCourseLessons(playlist.slug),
    logContext,
  )

  const mergedSectionsSource = courseMeta?.sections ?? playlist.sections ?? []

  let filteredItems = playlist.items ?? []
  let filteredSections = mergedSectionsSource

  if (courseBuilderMetadata && lessonStates && lessonStates.size > 0) {
    filteredItems = filterCourseItemsByLessonStates(
      playlist.items ?? [],
      lessonStates,
    )
    filteredSections = filterCourseSectionsByLessonStates(
      mergedSectionsSource,
      lessonStates,
    )
  }

  const courseBuilderOverrides = {
    ogImage:
      courseBuilderMetadata?.fields?.ogImage ||
      playlist.customOgImage?.url ||
      `https://og-image-react-egghead.now.sh/playlists/${slug}?v=20201103`,
    description: courseBuilderMetadata?.fields?.body || playlist.description,
    title: courseBuilderMetadata?.fields?.title || playlist.title,
    courseBuilderLessons,
  }

  const mergedInstructor =
    courseMeta?.instructor != null
      ? {...playlist.instructor, ...courseMeta.instructor}
      : playlist.instructor

  return {
    result: {
      ...playlist,
      ...courseMeta,
      ...courseBuilderOverrides,
      instructor: mergedInstructor,
      items: filteredItems,
      sections: filteredSections,
      slug,
    },
    metrics: {
      items_count: playlist?.items?.length ?? 0,
      sections_count: mergedSectionsSource?.length ?? 0,
      filtered_items_count: filteredItems?.length ?? 0,
      filtered_sections_count: filteredSections?.length ?? 0,
      has_course_meta: !!courseMeta,
      sanity_allowlist_ready: courseMetaAllowlist.ready,
      sanity_allowlist_allowed: courseMetaAllowlist.allowed,
      sanity_allowlist_reason: courseMetaAllowlist.reason,
      has_coursebuilder_meta: !!courseBuilderMetadata,
      lesson_states_count: lessonStates?.size ?? 0,
      coursebuilder_lessons_count: courseBuilderLessons?.length ?? 0,
    },
  }
}

async function loadLegacyPublicPlaylist(
  slug: string,
  logContext: LogContext = {},
) {
  const query = /* GraphQL */ `
    query getPlaylist($slug: String!) {
      playlist(slug: $slug) {
        id
        slug
        title
        description
        image_thumb_url
        square_cover_480_url
        average_rating_out_of_5
        rating_count
        watched_count
        path
        url
        duration
        type
        created_at
        updated_at
        published_at
        access_state
        visibility_state
        state
        tags {
          name
          image_url
          label
        }
        ratings_with_comment {
          count
          data {
            id
            created_at
            rating_out_of_5
            user {
              full_name
              avatar_url
            }
            comment {
              id
              state
              hide_url
              restore_url
              prompt
              comment
            }
          }
        }
        primary_tag {
          name
          image_url
          slug
        }
        items {
          ... on Course {
            slug
            title
            summary
            description
            path
            square_cover_url
            type
            duration
          }
          ... on Playlist {
            slug
            title
            description
            path
            square_cover_url
            type
            url
            duration
            lessons {
              title
              path
              slug
              icon_url
              duration
              thumb_url
            }
          }
          ... on Lesson {
            slug
            title
            description
            path
            http_url
            icon_url
            type
            duration
            thumb_url
            created_at
            updated_at
            published_at
            primary_tag {
              name
            }
          }
          ... on File {
            slug
            title
            url
            description
            square_cover_480_url
            square_cover_url
            type
          }
          ... on Download {
            slug
            title
            url
            summary
            description
            square_cover_480_url
            square_cover_url
            type
          }
          ... on Url {
            title
            url
            description
            square_cover_480_url
            square_cover_url
            type
          }
          ... on Podcast {
            transcript
            simplecast_uid
            type
          }
          ... on GenericResource {
            title
            url
            description
            square_cover_480_url
            square_cover_url
            type
          }
        }
        instructor {
          id
          full_name
          slug
          avatar_url
          avatar_64_url
          bio_short
          twitter
        }
        owner {
          id
          full_name
          avatar_url
        }
      }
    }
  `
  const graphQLClient = getGraphQLClient()

  const {playlist} = await timeEvent(
    'course.loadPlaylist.graphql',
    {slug},
    async () => graphQLClient.request(query, {slug}),
    logContext,
  )

  return playlist
}

export async function loadAllPlaylistsByPage(retryCount = 0): Promise<any> {
  const query = /* GraphQL */ `
    query PagedPlaylists($page: Int!, $per_page: Int!) {
      playlists(page: $page, per_page: $per_page) {
        data {
          slug
          title
          average_rating_out_of_5
          watched_count
          path
          description
          access_state
          created_at
          tags {
            name
            label
            image_url
          }
          image_thumb_url
          instructor {
            id
            full_name
            path
          }
        }
        count
        current_page
        total_pages
      }
    }
  `
  try {
    let currentPage = 1
    let allPlaylists: any[] = []
    let hasNextPage = true

    while (hasNextPage) {
      const {
        playlists: {data, count},
      } = await request(config.graphQLEndpoint, query, {
        page: currentPage,
        per_page: 200,
      })

      currentPage = currentPage + 1
      allPlaylists = [...allPlaylists, ...data]

      console.debug(
        `\n\n~> loading playlists: ${allPlaylists.length}/${count}\n`,
      )

      hasNextPage = allPlaylists.length < count
    }

    return allPlaylists
  } catch (error) {
    if (retryCount <= 4) {
      return loadAllPlaylistsByPage(retryCount + 1)
    } else {
      throw error
    }
  }
}

export async function loadAllPlaylists() {
  const query = /* GraphQL */ `
    query getPlaylists {
      all_playlists {
        slug
        title
        average_rating_out_of_5
        watched_count
        path
        description
        access_state
        created_at
        tags {
          name
          label
          image_url
        }
        image_thumb_url
        instructor {
          id
          full_name
          path
        }
      }
    }
  `
  const graphQLClient = getGraphQLClient()
  const {all_playlists} = await graphQLClient.request(query)

  return all_playlists
}

export async function loadAuthedCourseBits(
  slug: string,
  accessToken?: string,
  logContext: LogContext = {},
): Promise<AuthedCourseBits> {
  if (slug === 'undefined') return null

  const query = /* GraphQL */ `
    query getPlaylist($slug: String!) {
      playlist(slug: $slug) {
        favorited
        toggle_favorite_url
        rss_url
      }
    }
  `
  const token = accessToken ?? getAccessTokenFromCookie()
  const graphQLClient = getGraphQLClient(token)

  const {playlist} = await timeEvent(
    'course.loadAuthedCourseBits.graphql',
    {slug},
    async () => graphQLClient.request(query, {slug}),
    logContext,
  )

  logEvent(
    'info',
    'course.loadAuthedCourseBits.summary',
    {
      slug,
      has_token: Boolean(token),
      has_bits: Boolean(playlist),
      has_favorited: playlist?.favorited ?? null,
      has_toggle_favorite_url: Boolean(playlist?.toggle_favorite_url),
      has_rss_url: Boolean(playlist?.rss_url),
    },
    logContext,
  )

  return playlist ?? null
}

export async function loadAuthedPlaylistForUser(
  slug: string,
  accessToken?: string,
) {
  return loadAuthedCourseBits(slug, accessToken)
}

export async function loadPublicCourseShell(
  slug: string,
  logContext: LogContext = {},
) {
  const startTime = Date.now()

  try {
    const pgPlaylist = await loadPgPublicCourseShell(slug, logContext)

    if (pgPlaylist) {
      const {result, metrics} = await mergeCourseShellSources(
        pgPlaylist,
        slug,
        logContext,
      )

      logEvent(
        'info',
        'course.loadPublicCourseShell.summary',
        {
          slug,
          duration_ms: Date.now() - startTime,
          source: 'pg',
          ...metrics,
        },
        logContext,
      )

      return result
    }
  } catch {
    logEvent(
      'warn',
      'course.loadPublicCourseShell.pg_error',
      {slug},
      logContext,
    )
  }

  const playlist = await loadLegacyPublicPlaylist(slug, logContext)

  if (!playlist) {
    logEvent(
      'warn',
      'course.loadPublicCourseShell.not_found',
      {
        slug,
        duration_ms: Date.now() - startTime,
      },
      logContext,
    )
    return null
  }

  const {result, metrics} = await mergeCourseShellSources(
    playlist,
    slug,
    logContext,
  )

  logEvent(
    'info',
    'course.loadPublicCourseShell.summary',
    {
      slug,
      duration_ms: Date.now() - startTime,
      source: 'legacy',
      ...metrics,
    },
    logContext,
  )

  return result
}

/**
 * in the database a Course is called a Playlist
 * @param slug
 * @param token
 */
export async function loadPlaylist(
  slug: string,
  token?: string,
  logContext: LogContext = {},
) {
  const course = await loadPublicCourseShell(slug, logContext)

  if (!course) {
    return null
  }

  if (!token) {
    return course
  }

  try {
    const authedBits = await loadAuthedCourseBits(slug, token, logContext)
    return authedBits ? {...course, ...authedBits} : course
  } catch {
    logEvent(
      'warn',
      'course.loadPlaylist.authed_bits_error',
      {slug},
      logContext,
    )
    return course
  }
}
