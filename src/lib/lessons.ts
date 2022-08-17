import {LessonResource} from 'types'
import {getGraphQLClient} from '../utils/configured-graphql-client'
import getAccessTokenFromCookie from '../utils/get-access-token-from-cookie'
import {loadLessonComments} from './lesson-comments'
import {sanityClient} from 'utils/sanity-client'
import groq from 'groq'
import isEmpty from 'lodash/isEmpty'
import {
  mergeLessonMetadata,
  deriveDataFromBaseValues,
} from 'utils/lesson-metadata'
import compactedMerge from 'utils/compacted-merge'

// code_url is only used in a select few Kent C. Dodds lessons
const lessonQuery = groq`
*[_type == 'lesson' && slug.current == $slug][0]{
  title,
  'slug': slug.current,
  description,
  resource->_type == 'videoResource' => {
    ...(resource-> {
      'media_url': hlsUrl,
      'transcript': transcriptBody,
      'transcript_url': transcriptUrl,
      duration,
      'subtitles_url': subtitlesUrl,
    })
  },
  'free_forever': isCommunityResource,
  'path': '/lessons/' + slug.current,
  'thumb_url': thumbnailUrl,
  'icon_url': coalesce(softwareLibraries[0].library->image.url, 'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1567198446/og-image-assets/eggo.svg'),
  'repo_url': repoUrl,
  'code_url': codeUrl,
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
        'media_url': resource->hlsUrl,
        'duration': resource->duration,
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

    return compactedMerge(baseValues, derivedValues)
  } catch (e) {
    // Likely a 404 Not Found error
    console.log('Error fetching from Sanity: ', e)

    return {}
  }
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

// values in the graphql that are being skipped/ignored by Sanity
//
// - dash_url - not used
// - staff_notes_url - not used

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
