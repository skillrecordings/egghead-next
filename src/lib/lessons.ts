import {LessonResource} from 'types'
import {getGraphQLClient} from '../utils/configured-graphql-client'
import getAccessTokenFromCookie from '../utils/get-access-token-from-cookie'
import {loadLessonComments} from './lesson-comments'
import {sanityClient} from 'utils/sanity-client'
import groq from 'groq'
import some from 'lodash/some'
import isEmpty from 'lodash/isEmpty'

// code_url is only used in a select few Kent C. Dodds lessons
const lessonQuery = groq`
*[_type == 'lesson' && slug.current == $slug][0]{
  title,
  'slug': slug.current,
  description,
  resource->_type == 'videoResource' => {
    ...(resource-> {
      'media_url': hslUrl,
      'transcript': transcriptBody,
      'transcript_url': transcriptUrl,
      duration,
      'subtitles_url': subtitlesUrl,
    })
  },
  'free_forever': isCommunityResource,
  'path': '/lessons/' + slug.current,
  'thumb_url': thumbnailUrl,
  'repo_url': repoUrl,
  'code_url': codeUrl,
  'createdAt': eggheadRailsCreatedAt,
  'updatedAt': eggheadRailsUpdatedAt,
  'publishedAt': eggheadRailsPublishedAt,
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
       name,
      'label': slug.current,
      'http_url': url,
      'image_url': image.url
    }),
  },
  'collection': *[_type=='course' && references(^._id)][0]{
    title,
    'slug': slug.current,
    'type': 'playlist',
    'square_cover_480_url': image,
    'path': '/courses/' + slug.current,
    'lessons': lessons[]-> {
      'slug': slug.current,
      'type': 'lesson',
      'path': '/lessons/' + slug.current,
      title,
      'thumb_url': thumbnailUrl,
      resource->_type == 'videoResource' => {
        'media_url': resource->hslUrl,
        duration,
      }
    }
  }
}`

/**
 * loads LESSON METADATA from Sanity
 * @param slug
 */
async function loadLessonMetadataFromSanity(slug: string) {
  const params = {
    slug,
  }

  try {
    const baseValues = await sanityClient.fetch(lessonQuery, params)

    const derivedValues = deriveDataFromBaseValues(baseValues)

    return {...baseValues, ...derivedValues}
  } catch (e) {
    // Likely a 404 Not Found error
    console.log('Error fetching from Sanity: ', e)

    return {}
  }
}

const deriveDataFromBaseValues = (result: any) => {
  const http_url = `${process.env.NEXT_PUBLIC_DEPLOY_URL}${result.path}`
  const lesson_view_url = `${process.env.NEXT_PUBLIC_AUTH_DOMAIN}/api/v1${result.path}/views`
  const download_url = `${process.env.NEXT_PUBLIC_AUTH_DOMAIN}/api/v1${result.path}/signed_download`

  return {http_url, lesson_view_url, download_url}
}

async function loadLessonMetadataFromGraphQL(slug: string, token?: string) {
  const graphQLClient = getGraphQLClient(token)

  try {
    const {lesson: lessonMetadataFromGraphQL} = await graphQLClient.request(
      loadLessonGraphQLQuery,
      {slug},
    )

    return lessonMetadataFromGraphQL
  } catch (e) {
    // Likely a 404 Not Found error
    console.log('Error fetching from GraphQL: ', e)

    return {}
  }
}

export async function loadLesson(
  slug: string,
  token?: string,
): Promise<LessonResource> {
  token = token || getAccessTokenFromCookie()

  /******************************************
   * Primary Lesson Metadata GraphQL Request
   * ****************************************/
  const lessonMetadataFromGraphQL = await loadLessonMetadataFromGraphQL(
    slug,
    token,
  )

  /**********************************************
   * Load comments from separate GraphQL Request
   * ********************************************/
  // comments are user-generated content that must come from the egghead-rails
  // backend, so load those separately from the rest of lesson metadata.
  const comments = await loadLessonComments(slug, token)

  /*************************************
   * Sanity Request for Lesson Metadata
   * ***********************************/
  // this will be used to override values from graphql
  const lessonMetadataFromSanity = await loadLessonMetadataFromSanity(slug)

  /*************************************
   * Merge All Lesson Metadata Together
   * ***********************************/
  // with preference for data coming from Sanity
  const lessonMetadata = mergeLessonMetadata(
    lessonMetadataFromGraphQL,
    lessonMetadataFromSanity,
  )

  // if we aren't able to find Lesson metadata at either source, throw an
  // error.
  if (isEmpty(lessonMetadata.slug)) {
    throw new Error(`Unable to lookup lesson metadata (slug: ${slug})`)
  }

  return {...lessonMetadata, comments} as LessonResource
}

const mergeLessonMetadata = (
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

  const rest = {...secondaryRest, ...primaryRest}

  return {collection, instructor, tags, ...rest}
}

const collectionIsPresent = (collection: {lessons: any[] | undefined}) => {
  const {lessons, ...collectionMetadata} = collection || {}

  // if there are lessons and some collectionMetadata is present, then the
  // collection is considered present.
  return some(lessons) && some(collectionMetadata)
}

const loadLessonGraphQLQuery = /* GraphQL */ `
  query getLesson($slug: String!) {
    lesson(slug: $slug) {
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
      media_url
      lesson_view_url
      thumb_url
      icon_url
      download_url
      staff_notes_url
      repo_url
      code_url
      created_at
      updated_at
      published_at
      collection {
        ... on Playlist {
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
            media_url
          }
        }
        ... on Course {
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
            media_url
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
