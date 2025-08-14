import {getGraphQLClient} from '@/utils/configured-graphql-client'
import {loadCourseMetadata} from '@/lib/courses'
import {loadLesson} from '@/lib/lessons'
import type {LessonResource} from '@/types'

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

async function loadRailsPlaylistLessonSlugs(slug: string): Promise<string[]> {
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
    const {playlist} = (await graphQLClient.request(query, {
      slug,
    })) as RailsPlaylistResponse

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

    console.debug(
      `loadResourcesForCourse: Rails returned ${lessonSlugs.length} lesson slugs for course ${slug}`,
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
): Promise<string[]> {
  try {
    const sanityCourse = await loadCourseMetadata(Number(id || 0), slug || '')

    // Prefer sections if present, otherwise top-level lessons
    const sectionLessons = (sanityCourse?.sections ?? [])
      .flatMap((section: any) => section?.lessons ?? [])
      .map((l: any) => deriveSlugFromPath(l?.path))
      .filter(Boolean) as string[]

    const topLevelLessons = (sanityCourse?.lessons ?? [])
      .map((l: any) => deriveSlugFromPath(l?.path))
      .filter(Boolean) as string[]

    const slugs = sectionLessons.length > 0 ? sectionLessons : topLevelLessons

    console.debug(
      `loadResourcesForCourse: Sanity returned ${
        slugs.length
      } lesson slugs for course ${slug ?? id}`,
    )

    return slugs
  } catch (e) {
    console.warn('loadResourcesForCourse: Error fetching Sanity course', e)
    return []
  }
}

export async function loadResourcesForCourse(
  params: LoadResourcesForCourseParams,
): Promise<LessonResource[]> {
  const {slug, id} = params

  if (!slug && !id) {
    throw new Error('loadResourcesForCourse requires a slug or id')
  }

  // 1) Default to Rails for course membership (order source)
  let lessonSlugs: string[] = []
  if (slug) {
    lessonSlugs = await loadRailsPlaylistLessonSlugs(slug)
  }

  // 2) Fallback to Sanity for membership if Rails empty
  if (lessonSlugs.length === 0) {
    const sanitySlugs = await loadSanityCourseLessonSlugsByIdOrSlug(id, slug)
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

  console.debug(
    `loadResourcesForCourse: Resolving ${orderedUniqueSlugs.length} lessons with merged metadata`,
  )

  // 4) Resolve each lesson using existing per-lesson merge logic
  const mergedLessons = await Promise.all(
    orderedUniqueSlugs.map(async (lessonSlug) => {
      try {
        const lesson = await loadLesson(lessonSlug)
        return lesson
      } catch (e) {
        console.warn(
          `loadResourcesForCourse: Failed to load merged lesson for slug ${lessonSlug}`,
          e,
        )
        return null
      }
    }),
  )

  // 5) Drop failures/nulls
  const lessons: LessonResource[] = mergedLessons.filter(
    Boolean,
  ) as LessonResource[]

  console.debug(
    `loadResourcesForCourse: Loaded ${lessons.length}/${orderedUniqueSlugs.length} lessons with merged metadata`,
  )

  return lessons
}
