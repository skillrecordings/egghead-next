import isEmpty from 'lodash/isEmpty'
import invariant from 'tiny-invariant'
import {extractCourseBuilderIdSHA} from '@/lib/course-builder'
import type {CourseBuilderLessonCourse} from '@/lib/get-course-builder-metadata'

// Course Builder lesson overrides (includes transcript from video resource)
type CourseBuilderLessonData = {
  transcript?: string
  description?: string
  title?: string
  ogImage?: string
  slug?: string
  repo_url?: string
  download_url?: string
  muxPlaybackId?: string
  collection?: CourseBuilderLessonCourse
  free_forever?: true
}

type LessonMetadataMergeInput = {
  slug?: string
  [key: string]: unknown
}

type LessonMetadataMergeResult<T extends LessonMetadataMergeInput> = T & {
  ogImage: string
  title?: string
  description?: string
  transcript?: string
  repo_url?: string
  download_url?: string
}

export const mergeLessonMetadata = <T extends LessonMetadataMergeInput>(
  lessonMetadataFromGraphQL: T,
  lessonMetadataFromCourseBuilder: CourseBuilderLessonData | null,
): LessonMetadataMergeResult<T> => {
  // Course Builder overrides take highest precedence over the rails GraphQL
  // baseline. Spread CB fields last so they win on key collisions, but only
  // when they're actually populated.
  const courseBuilderIdSHA = extractCourseBuilderIdSHA(
    lessonMetadataFromGraphQL?.slug || '',
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
        ...(lessonMetadataFromCourseBuilder.download_url && {
          download_url: lessonMetadataFromCourseBuilder.download_url,
        }),
        ...(lessonMetadataFromCourseBuilder.free_forever && {
          free_forever: true,
        }),
        ...(lessonMetadataFromCourseBuilder.collection && {
          collection: {
            ...lessonMetadataFromCourseBuilder.collection,
            square_cover_480_url:
              lessonMetadataFromCourseBuilder.collection.square_cover_480_url ||
              (lessonMetadataFromGraphQL as any)?.collection
                ?.square_cover_480_url ||
              null,
          },
        }),
        ogImage:
          (lessonMetadataFromCourseBuilder?.ogImage &&
            lessonMetadataFromCourseBuilder.ogImage.trim()) ||
          (process.env.NEXT_PUBLIC_COURSE_BUILDER_DOMAIN
            ? `${process.env.NEXT_PUBLIC_COURSE_BUILDER_DOMAIN}/api/og?resource=post_${courseBuilderIdSHA}`
            : `https://og-image-react-egghead.now.sh/lesson/${lessonMetadataFromGraphQL.slug}?v=20201027`),
      }
    : {
        ogImage: `https://og-image-react-egghead.now.sh/lesson/${lessonMetadataFromGraphQL.slug}?v=20201027`,
      }

  return {...lessonMetadataFromGraphQL, ...courseBuilderOverrides}
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
