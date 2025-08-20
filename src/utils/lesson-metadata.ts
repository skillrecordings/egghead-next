import {LessonResource} from '@/types'
import some from 'lodash/some'
import isEmpty from 'lodash/isEmpty'
import compactedMerge from '@/utils/compacted-merge'
import invariant from 'tiny-invariant'
import {extractCourseBuilderIdSHA} from '@/lib/course-builder'
import {Post} from '@/schemas/post'

// Type for Course Builder lesson data that includes transcript from video resource
type CourseBuilderLessonData = {
  transcript?: string
  description?: string
  title?: string
  ogImage?: string
  slug?: string
  repo_url?: string
}

export const mergeLessonMetadata = (
  lessonMetadataFromGraphQL: LessonResource,
  lessonMetadataFromSanity: LessonResource,
  lessonMetadataFromCourseBuilder: CourseBuilderLessonData | null,
): LessonResource => {
  // we can merge most of it together as is, but there are a few nested pieces
  // that need to be handled manually.
  //
  // e.g. if tags haven't been set yet on Sanity, they will appear as an empty
  // array. With a standard spread, they empty tags from Sanity would override
  // an actual list of tags from graphql. We can instead handle this manually
  // by checking for `_.some()` and falling back to graphql if there aren't
  // any.

  // Nested fields:
  // - `tags`
  // - `instructor`
  // - `collection`
  //   - `lessons`

  /*
   * Extract primary and secondary fields
   */
  const {
    tags: secondaryTags,
    instructor: secondaryInstructor,
    collection: secondaryCollection,
    ...secondaryRest
  } = lessonMetadataFromGraphQL

  const {
    tags: primaryTags,
    instructor: primaryInstructor,
    collection: primaryCollection,
    ...primaryRest
  } = lessonMetadataFromSanity

  /*
   * Determine which value to take for each complex type (`collection`, `tags`,
   * and `instructor`).
   */

  const collection = collectionIsPresent(primaryCollection)
    ? primaryCollection
    : secondaryCollection

  const tags = some(primaryTags) ? primaryTags : secondaryTags

  const instructor = some(primaryInstructor)
    ? primaryInstructor
    : secondaryInstructor

  const rest = compactedMerge(secondaryRest, primaryRest)

  // Course Builder data takes highest preference - spread last to override other sources
  const courseBuilderIdSHA = extractCourseBuilderIdSHA(
    lessonMetadataFromSanity?.slug || '',
  )
  const courseBuilderOverrides = lessonMetadataFromCourseBuilder
    ? {
        ...(lessonMetadataFromCourseBuilder.title && {
          title: lessonMetadataFromCourseBuilder.title,
        }),
        ...(lessonMetadataFromCourseBuilder.description && {
          description: lessonMetadataFromCourseBuilder.description,
        }),
        ...(lessonMetadataFromCourseBuilder.transcript && {
          transcript: lessonMetadataFromCourseBuilder.transcript,
        }),
        ...(lessonMetadataFromCourseBuilder.repo_url && {
          repo_url: lessonMetadataFromCourseBuilder.repo_url,
        }),
        ogImage:
          (lessonMetadataFromCourseBuilder?.ogImage &&
            lessonMetadataFromCourseBuilder.ogImage.trim()) ||
          `${process.env.NEXT_PUBLIC_COURSE_BUILDER_DOMAIN}/api/og?resource=post_${courseBuilderIdSHA}`,
      }
    : {
        ogImage: `https://og-image-react-egghead.now.sh/lesson/${lessonMetadataFromGraphQL.slug}?v=20201027`,
        // Allow Course Builder to override GitHub repo url
      }

  return {collection, instructor, tags, ...rest, ...courseBuilderOverrides}
}

const collectionIsPresent = (collection: {lessons: any[] | undefined}) => {
  const {lessons} = collection || {}
  return some(lessons)
}

export const deriveDataFromBaseValues = ({path}: {path?: string}) => {
  if (!isEmpty(path)) {
    invariant(
      path?.startsWith('/'),
      'Path value must begin with a forward slash (`/`).',
    )

    const http_url = `${process.env.NEXT_PUBLIC_DEPLOY_URL}${path}`
    const lesson_view_url = `${process.env.NEXT_PUBLIC_AUTH_DOMAIN}/api/v1${path}/views`
    const download_url = `${process.env.NEXT_PUBLIC_AUTH_DOMAIN}/api/v1${path}/signed_download`

    return {http_url, lesson_view_url, download_url}
  } else {
    return {}
  }
}
