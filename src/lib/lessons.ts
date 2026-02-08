import {LessonResource} from '@/types'
import {getGraphQLClient} from '../utils/configured-graphql-client'
import getAccessTokenFromCookie from '../utils/get-access-token-from-cookie'
import {loadLessonComments} from './lesson-comments'
import {sanityClient} from '@/utils/sanity-client'
import groq from 'groq'
import isEmpty from 'lodash/isEmpty'
import crypto from 'crypto'
import {
  mergeLessonMetadata,
  deriveDataFromBaseValues,
} from '@/utils/lesson-metadata'
import compactedMerge from '@/utils/compacted-merge'
import {convertUndefinedValuesToNull} from '@/utils/convert-undefined-values-to-null'
import {getCourseBuilderLesson} from '@/lib/get-course-builder-metadata'
import {logEvent, timeEvent, type LogContext} from '@/utils/structured-log'
import {getRedis} from '@/lib/upstash-redis'
import {sanityAllowlistAllowsLesson} from '@/lib/sanity-allowlist'

// code_url is only used in a select few Kent C. Dodds lessons
const lessonQuery = groq`
*[_type == 'lesson' && slug.current == $slug][0]{
  title,
   "id": railsLessonId,
  'slug': slug.current,
  description,
  ...resources[@->["_type"] == "videoResource"][0]->{
    "transcript": transcript.text,
    duration,
  },
  'path': '/lessons/' + slug.current,
  'thumb_url': thumbnailUrl,
  'icon_url': coalesce(softwareLibraries[0].library->image.url, 'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1567198446/og-image-assets/eggo.svg'),
  'repo_url': repoUrl,
  'code_url': codeUrl,
  'scrimba': resources[_type == 'scrimbaResource'][0],
  'created_at': eggheadRailsCreatedAt,
  'updated_at': displayedUpdatedAt,
  'published_at': publishedAt,
  'instructor': collaborators[0]-> {
    ...(person-> {
      'full_name': name,
      'slug': slug.current,
      'avatar_64_url': image.url,
      'twitter_url': twitter
    }),
  },
  'tags': softwareLibraries[] {
    ...(library-> {
      'name': slug.current,
      'label': name,
      'http_url': url,
      'image_url': image.url
    }),
  },
  'collection': *[_type == 'course' && references(^._id)][0]{
    "lessons": resources[]->{
      title,
      "type": _type,
      "icon_url": softwareLibraries[0].library->image.url,
      "duration": resource->duration,
      "path": "/lessons/" + slug.current,
      'slug': slug.current,
      'scrimba': resources[_type == 'scrimbaResource'][0],
    },
    "id": railsCourseId,
    'slug': slug.current,
    'type': 'playlist',
    'square_cover_480_url': coalesce(image, 'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1567198446/og-image-assets/eggo.svg'),
    'path': '/courses/' + slug.current,
    'title': title,
  }
}`

const SANITY_LESSON_CACHE_PREFIX = 'sanity:lesson'
const SANITY_LESSON_CACHE_TTL_SECONDS = 60 * 60 // 1 hour
const SANITY_LESSON_CACHE_MISS_TTL_SECONDS = 60 * 60 * 24 // 24 hours

type SanityLessonCacheValue =
  | {ok: true; value: Record<string, unknown>}
  | {ok: false}

const sanityLessonCacheKey = (slug: string) => {
  const hash = crypto.createHash('sha1').update(slug).digest('hex')
  return `${SANITY_LESSON_CACHE_PREFIX}:${hash}`
}

/**
 * loads LESSON METADATA from Sanity
 * @param slug
 */
async function loadLessonMetadataFromSanity(
  slug: string,
  logContext: LogContext,
) {
  const params = {
    slug,
  }

  try {
    // If the allowlist is ready and this slug is not in it, skip Sanity entirely.
    // This is the big win: 1 Redis check vs 1 Sanity GROQ call for every unique slug.
    const allowlist = await sanityAllowlistAllowsLesson(slug, logContext)
    if (allowlist.ready && !allowlist.allowed) return {}

    const redis = getRedis()

    // KV-cached to avoid paying the Sanity roundtrip for the ~96% of slugs
    // that don't have Sanity overrides.
    const cacheKey = sanityLessonCacheKey(slug)
    try {
      if (redis) {
        const cached = await redis.get<SanityLessonCacheValue>(cacheKey)
        if (cached) {
          if (!cached.ok) return {}
          return (cached.value ?? {}) as Record<string, unknown>
        }
      }
    } catch {
      logEvent(
        'warn',
        'lesson.loadLessonMetadataFromSanity.kv_get_error',
        {slug},
        logContext,
      )
    }

    const baseValues = await timeEvent(
      'lesson.loadLessonMetadataFromSanity.groq',
      {slug},
      async () => sanityClient.fetch(lessonQuery, params),
      logContext,
    )

    const derivedValues = baseValues ? deriveDataFromBaseValues(baseValues) : {}

    const merged = compactedMerge(baseValues || {}, derivedValues)
    const hasSanity = !isEmpty((merged as any)?.slug)

    // Cache both hits and misses. Miss TTL is longer because new legacy Sanity
    // lessons aren't expected to appear frequently.
    const valueToCache: SanityLessonCacheValue = hasSanity
      ? {ok: true, value: merged as Record<string, unknown>}
      : {ok: false}

    try {
      if (redis) {
        await redis.set(cacheKey, valueToCache, {
          ex: hasSanity
            ? SANITY_LESSON_CACHE_TTL_SECONDS
            : SANITY_LESSON_CACHE_MISS_TTL_SECONDS,
        })
      }
    } catch {
      logEvent(
        'warn',
        'lesson.loadLessonMetadataFromSanity.kv_set_error',
        {slug, has_sanity: hasSanity},
        logContext,
      )
    }

    return hasSanity ? merged : {}
  } catch (e) {
    // Likely a 404 Not Found error
    logEvent(
      'warn',
      'lesson.loadLessonMetadataFromSanity.error',
      {slug},
      logContext,
    )

    return {}
  }
}

export async function loadLessonMetadataFromGraphQL(
  slug: string,
  token?: string,
  logContext: LogContext = {},
) {
  const graphQLClient = getGraphQLClient(token)

  try {
    const {lesson: lessonMetadataFromGraphQL} = await timeEvent(
      'lesson.loadLessonMetadataFromGraphQL.graphql',
      {slug},
      async () =>
        graphQLClient.request(loadLessonGraphQLQuery, {
          slug,
        }),
      logContext,
    )

    return lessonMetadataFromGraphQL
  } catch (e) {
    // Likely a 404 Not Found error
    logEvent(
      'warn',
      'lesson.loadLessonMetadataFromGraphQL.error',
      {slug},
      logContext,
    )

    return {}
  }
}

export async function loadLesson(
  slug: string,
  token?: string,
  useAuth?: boolean,
  logContext: LogContext = {},
): Promise<LessonResource> {
  const startTime = Date.now()
  token = useAuth ? token || getAccessTokenFromCookie() : undefined

  /******************************************
   * Primary Lesson Metadata GraphQL Request
   * ****************************************/
  const lessonMetadataFromGraphQL = await loadLessonMetadataFromGraphQL(
    slug,
    token,
    logContext,
  )

  /**********************************************
   * Load comments from separate GraphQL Request
   * ********************************************/
  // comments are user-generated content that must come from the egghead-rails
  // backend, so load those separately from the rest of lesson metadata.
  const comments = await loadLessonComments(slug, token, logContext)

  /*************************************
   * Sanity Request for Lesson Metadata
   * ***********************************/
  // this will be used to override values from graphql
  const lessonMetadataFromSanity = await loadLessonMetadataFromSanity(
    slug,
    logContext,
  )

  const lessonMetadataFromCourseBuilder = await timeEvent(
    'lesson.getCourseBuilderLesson.mysql',
    {slug},
    async () => getCourseBuilderLesson(slug),
    logContext,
  )

  /*************************************
   * Merge All Lesson Metadata Together
   * ***********************************/
  // with preference for data coming from Sanity
  let lessonMetadata = mergeLessonMetadata(
    lessonMetadataFromGraphQL,
    lessonMetadataFromSanity,
    lessonMetadataFromCourseBuilder,
  )

  lessonMetadata = convertUndefinedValuesToNull(lessonMetadata)

  // if (!eggheadViewer.is_pro && !lessonMetadata.free_forever) {
  //   delete lessonMetadata.hls_url
  //   delete lessonMetadata.dash_url
  // }

  // if we aren't able to find Lesson metadata at either source, throw an
  // error.
  if (isEmpty(lessonMetadata.slug)) {
    throw new Error(`Unable to lookup lesson metadata (slug: ${slug})`)
  }

  logEvent(
    'info',
    'lesson.loadLesson.summary',
    {
      slug,
      duration_ms: Date.now() - startTime,
      has_graphql: !isEmpty(lessonMetadataFromGraphQL?.slug),
      has_sanity: !isEmpty(lessonMetadataFromSanity?.slug),
      has_coursebuilder: !!lessonMetadataFromCourseBuilder,
      comments_count: comments?.length ?? 0,
    },
    logContext,
  )

  return {...lessonMetadata, comments} as LessonResource
}

// values in the graphql that are being skipped/ignored by Sanity
//
// - dash_url - not used
// - staff_notes_url - not used

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
