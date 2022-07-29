import {LessonResource} from 'types'
import {getGraphQLClient} from '../utils/configured-graphql-client'
import getAccessTokenFromCookie from '../utils/get-access-token-from-cookie'
import {loadLessonComments} from './lesson-comments'
import {sanityClient} from 'utils/sanity-client'
import groq from 'groq'

// next_up_url can be derived on the front-end from collection and
// staff_notes_url seems to be null for all lessons
// code_url is only used in a select few Kent C. Dodds lessons
const lessonQuery = groq`
*[_type == 'lesson' && slug.current == $slug][0]{
  title,
  slug,
  description,
  resource->_type == 'videoResource' => {
    ...(resource[]-> {
      'media_url': hslUrl,
      'transcript': transcriptBody,
      'transcript_url': transcriptUrl
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
    ...(person[]-> {
      'full_name': name,
      'slug': slug.current,
      'avatar_64_url': image.url,
      'twitter_url': twitter
    }),
  },
  'tags': softwareLibraries[] {
    ...(library[]-> {
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
      'thumb_url': null,
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

  return await sanityClient.fetch(lessonQuery, params)
}

// TODO: Derive the next_up_url from the collection and lesson slug
const derivedData = (result: any) => {
  const http_url = `${process.env.NEXT_PUBLIC_DEPLOY_URL}${result.path}`
  const lesson_view_url = `${process.env.NEXT_PUBLIC_AUTH_DOMAIN}/api/v1${result.path}/views`
  const download_url = `${process.env.NEXT_PUBLIC_AUTH_DOMAIN}/api/v1${result.path}/signed_download`

  return {http_url, lesson_view_url, download_url}
}

export async function loadLesson(
  slug: string,
  token?: string,
): Promise<LessonResource> {
  token = token || getAccessTokenFromCookie()
  const graphQLClient = getGraphQLClient(token)

  const variables = {
    slug: slug,
  }

  const {lesson} = await graphQLClient.request(
    loadLessonGraphQLQuery,
    variables,
  )

  const queryResult = await loadLessonMetadataFromSanity(slug)
  const derivedDataFromQuery = derivedData(queryResult)
  const lessonMetadataFromSanity = {...queryResult, ...derivedDataFromQuery}

  const lessonMetadata = {...lesson, ...lessonMetadataFromSanity}

  // comments are user-generated content that must come from the egghead-rails
  // backend, so load those separately from the rest of lesson metadata.
  const comments = await loadLessonComments(slug, token)

  return {...lessonMetadata, comments} as LessonResource
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
