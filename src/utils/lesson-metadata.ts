import {LessonResource} from 'types'
import some from 'lodash/some'
import compactedMerge from 'utils/compacted-merge'

export const mergeLessonMetadata = (
  lessonMetadataFromGraphQL: LessonResource,
  lessonMetadataFromSanity: LessonResource,
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

  return {collection, instructor, tags, ...rest}
}

const collectionIsPresent = (collection: {lessons: any[] | undefined}) => {
  const {lessons, ...collectionMetadata} = collection || {}

  // if there are lessons and some collectionMetadata is present, then the
  // collection is considered present.
  return some(lessons) && some(collectionMetadata)
}
