import {LessonResource} from '@/types'
import {getGraphQLClient} from '../utils/configured-graphql-client'
import getAccessTokenFromCookie from '../utils/get-access-token-from-cookie'
import {loadLessonComments} from './lesson-comments'
import isEmpty from 'lodash/isEmpty'
import crypto from 'crypto'
import {mergeLessonMetadata} from '@/utils/lesson-metadata'
import {convertUndefinedValuesToNull} from '@/utils/convert-undefined-values-to-null'
import {
  getCourseBuilderLesson,
  getCourseBuilderLessonCourse,
} from '@/lib/get-course-builder-metadata'
import {logEvent, timeEvent, type LogContext} from '@/utils/structured-log'
import {getRedis} from '@/lib/upstash-redis'

const GRAPHQL_LESSON_MISS_CACHE_PREFIX = 'graphql:lesson:miss'
const GRAPHQL_LESSON_MISS_TTL_SECONDS = 60 * 60 * 6 // 6 hours
export const LESSON_NOT_FOUND_MESSAGE = 'Unable to lookup lesson metadata'

const inMemoryGraphqlMisses = new Map<string, number>()

const graphqlLessonMissCacheKey = (slug: string) => {
  const hash = crypto.createHash('sha1').update(slug).digest('hex')
  return `${GRAPHQL_LESSON_MISS_CACHE_PREFIX}:${hash}`
}

const hasFreshInMemoryGraphqlMiss = (slug: string) => {
  const expiresAt = inMemoryGraphqlMisses.get(slug)
  if (!expiresAt) return false
  if (Date.now() >= expiresAt) {
    inMemoryGraphqlMisses.delete(slug)
    return false
  }
  return true
}

const rememberInMemoryGraphqlMiss = (slug: string) => {
  inMemoryGraphqlMisses.set(
    slug,
    Date.now() + GRAPHQL_LESSON_MISS_TTL_SECONDS * 1000,
  )
}

function isGraphQL404(error: unknown): boolean {
  return error instanceof Error && error.message.includes('Code: 404')
}

async function isGraphqlLessonMissCached(
  slug: string,
  logContext: LogContext,
): Promise<boolean> {
  if (hasFreshInMemoryGraphqlMiss(slug)) return true

  const redis = getRedis()
  if (!redis) return false

  try {
    const cached = await redis.get<boolean>(graphqlLessonMissCacheKey(slug))
    if (cached) {
      rememberInMemoryGraphqlMiss(slug)
      return true
    }
  } catch {
    logEvent(
      'warn',
      'lesson.loadLessonMetadataFromGraphQL.kv_get_error',
      {slug},
      logContext,
    )
  }

  return false
}

async function cacheGraphqlLessonMiss(slug: string, logContext: LogContext) {
  rememberInMemoryGraphqlMiss(slug)

  const redis = getRedis()
  if (!redis) return

  try {
    await redis.set(graphqlLessonMissCacheKey(slug), true, {
      ex: GRAPHQL_LESSON_MISS_TTL_SECONDS,
    })
  } catch {
    logEvent(
      'warn',
      'lesson.loadLessonMetadataFromGraphQL.kv_set_error',
      {slug},
      logContext,
    )
  }
}

type LessonMetadataLoadOptions = {
  allowRuntimeCaches?: boolean
}

export async function loadLessonMetadataFromGraphQL(
  slug: string,
  token?: string,
  logContext: LogContext = {},
  options: LessonMetadataLoadOptions = {},
) {
  const {allowRuntimeCaches = true} = options

  if (
    allowRuntimeCaches &&
    (await isGraphqlLessonMissCached(slug, logContext))
  ) {
    logEvent(
      'info',
      'lesson.loadLessonMetadataFromGraphQL.cache_hit',
      {slug, status: 'miss'},
      logContext,
    )
    return {}
  }

  const graphQLClient = getGraphQLClient(token)
  const start = Date.now()

  try {
    const {lesson: lessonMetadataFromGraphQL} = await graphQLClient.request(
      loadLessonGraphQLQuery,
      {
        slug,
      },
    )

    logEvent(
      'info',
      'lesson.loadLessonMetadataFromGraphQL.graphql',
      {
        slug,
        duration_ms: Date.now() - start,
        ok: true,
      },
      logContext,
    )

    return lessonMetadataFromGraphQL
  } catch (e) {
    if (isGraphQL404(e)) {
      if (allowRuntimeCaches) {
        await cacheGraphqlLessonMiss(slug, logContext)
      }
      logEvent(
        'info',
        'lesson.loadLessonMetadataFromGraphQL.not_found',
        {
          slug,
          duration_ms: Date.now() - start,
          ok: true,
        },
        logContext,
      )
      return {}
    }

    logEvent(
      'error',
      'lesson.loadLessonMetadataFromGraphQL.graphql',
      {
        slug,
        duration_ms: Date.now() - start,
        ok: false,
        error_message: e instanceof Error ? e.message : String(e),
      },
      logContext,
    )
    logEvent(
      'warn',
      'lesson.loadLessonMetadataFromGraphQL.error',
      {slug},
      logContext,
    )

    return {}
  }
}

type LoadLessonOptions = {
  includeComments?: boolean
  allowRuntimeCaches?: boolean
}

export async function loadLesson(
  slug: string,
  token?: string,
  useAuth?: boolean,
  logContext: LogContext = {},
  options: LoadLessonOptions = {},
): Promise<LessonResource> {
  const startTime = Date.now()
  const {includeComments = true, allowRuntimeCaches = true} = options
  token = useAuth ? token || getAccessTokenFromCookie() : undefined

  const [
    lessonMetadataFromGraphQL,
    comments,
    lessonMetadataFromCourseBuilder,
    courseBuilderCourse,
  ] = await Promise.all([
    /******************************************
     * Primary Lesson Metadata GraphQL Request
     * ****************************************/
    loadLessonMetadataFromGraphQL(slug, token, logContext, {
      allowRuntimeCaches,
    }),

    /**********************************************
     * Load comments from separate GraphQL Request
     * ********************************************/
    // comments are user-generated content that must come from the egghead-rails
    // backend. For static lesson shells we can skip this and hydrate comments on
    // the client instead of blocking ISR on another GraphQL request.
    includeComments
      ? loadLessonComments(slug, token, logContext)
      : Promise.resolve([]),

    timeEvent(
      'lesson.getCourseBuilderLesson.mysql',
      {slug},
      async () => getCourseBuilderLesson(slug),
      logContext,
    ),

    /****************************************
     * Course Builder parent-course lookup (for the player sidebar).
     * Runs in parallel — when present it overrides the rails collection;
     * when null the rails GraphQL collection passes through unchanged.
     * **************************************/
    timeEvent(
      'lesson.getCourseBuilderLessonCourse.mysql',
      {slug},
      async () => getCourseBuilderLessonCourse(slug),
      logContext,
    ),
  ])

  const lessonMetadataFromCourseBuilderWithCourse = courseBuilderCourse
    ? {
        ...(lessonMetadataFromCourseBuilder ?? {}),
        collection: courseBuilderCourse,
      }
    : lessonMetadataFromCourseBuilder

  /*************************************
   * Merge All Lesson Metadata Together
   * ***********************************/
  // rails GraphQL is the base; Course Builder overrides take highest precedence
  let lessonMetadata = mergeLessonMetadata(
    lessonMetadataFromGraphQL,
    lessonMetadataFromCourseBuilderWithCourse,
  )

  lessonMetadata = convertUndefinedValuesToNull(lessonMetadata)

  // if (!eggheadViewer.is_pro && !lessonMetadata.free_forever) {
  //   delete lessonMetadata.hls_url
  //   delete lessonMetadata.dash_url
  // }

  // if we aren't able to find Lesson metadata at either source, throw an
  // error.
  if (isEmpty(lessonMetadata.slug)) {
    throw new Error(`${LESSON_NOT_FOUND_MESSAGE} (slug: ${slug})`)
  }

  logEvent(
    'info',
    'lesson.loadLesson.summary',
    {
      slug,
      duration_ms: Date.now() - startTime,
      has_graphql: !isEmpty(lessonMetadataFromGraphQL?.slug),
      has_coursebuilder: !!lessonMetadataFromCourseBuilder,
      comments_count: comments?.length ?? 0,
      comments_included: includeComments,
      runtime_caches_enabled: allowRuntimeCaches,
    },
    logContext,
  )

  return {...lessonMetadata, comments}
}

export async function loadAssociatedLessonsByTag(tag: string, token?: string) {
  const graphQLClient = getGraphQLClient(token)

  try {
    const {lessons} = await graphQLClient.request(
      loadAssociatedLessonsByTagQuery,
      {tag},
    )

    return lessons
  } catch (e) {
    throw e
  }
}

const loadAssociatedLessonsByTagQuery = /* GraphQL */ `
  query getAssociatedLessonsByTag($tag: String!) {
    lessons(tag: $tag, per_page: 20) {
      id
      slug
      completed
      title
      description
      duration
      free_forever
      path
    }
  }
`

const loadLessonGraphQLQuery = /* GraphQL */ `
  query getLesson($slug: String!) {
    lesson(slug: $slug) {
      id
      completed
      slug
      title
      description
      duration
      free_forever
      path
      transcript
      transcript_url
      subtitles_url
      hls_url
      dash_url
      http_url
      lesson_view_url
      thumb_url
      icon_url
      download_url
      staff_notes_url
      state
      repo_url
      code_url
      primary_tag {
        name
        label
        http_url
        image_url
      }
      created_at
      updated_at
      published_at
      collection {
        ... on Playlist {
          id
          title
          slug
          type
          square_cover_480_url
          path
          lessons {
            slug
            type
            path
            title
            completed
            duration
            thumb_url
          }
        }
        ... on Course {
          id
          title
          slug
          type
          square_cover_480_url
          path
          lessons {
            slug
            type
            path
            title
            completed
            duration
            thumb_url
          }
        }
      }
      tags {
        name
        label
        http_url
        image_url
      }
      instructor {
        full_name
        avatar_64_url
        slug
        twitter
      }
    }
  }
`
