import {sanityClient} from 'utils/sanity-client'
import groq from 'groq'
import {loadPlaylist} from './playlists'

const courseResourceQuery = groq`
*[_type == 'resource' && externalId == $courseId][0]{
  title,
  challengeRating,
  description,
  summary,
  essentialQuestions[]->{
    question
   },
  "pairWithResources": related[]->{
    name,
    title,
    byline,
    "description": summary,
    path,
    image,
    'instructor': collaborators[]->[role == 'instructor']{
    	'name': person->name,
  	}
	},
	"customOgImage": images[label == 'og-image'][0]{
    url
  },
  "illustration": images[label == 'illustration'][0]{
    url
  },
	'illustrator': collaborators[]->[role == 'illustrator'][0]{
    'name': person->name,
    'image': person->image.url
  },
	'instructor': collaborators[]->[role == 'instructor'][0]{
    'full_name': person->name,
    'avatar_url': person->image.url,
    'slug': person->slug.current
  },
	'dependencies': softwareLibraries[]{
    version,
    ...library->{
      description,
      "slug": slug.current,
      path,
      name,
      'label': name,
      'image_url': image.url
    }
  },
	"topics": content[title == 'topics'][0]{
    items[],
		description
  },
	"features": content[title == 'features'][0]{
    items[],
		description
  },
	"prerequisites": prerequisites[]->{
    "id": eggheadId,
    title,
    path,
    type
  },
	projects[]{
    label,
    url,
  }
}
`

// TODO: go through the minimum Course page requirements, find the overlap with
// what this Course document supports, and then lineup the naming.
//
// - `image_thumb_url`: can this also get the value of image or does it need to be a scaled down version?
// - `url` is not used, this can probably be removed from the playlist graphql query
// - `type` doesn't appear to be used by the course page either, assumed to be 'course` anyway
// - `primary_tag` isn't being used, it can be removed
const courseQuery = groq`
*[_type == 'course' && slug.current == $slug][0]{
  _id,
  sharedId,
  'slug': slug.current,
  title,
  description,
  summary,
  byline,
  'square_cover_480_url': image,
  'image_thumb_url': image,
  'path': '/courses/' + slug.current,
  duration,
  'created_at': coalesce(eggheadRailsCreatedAt, _createdAt),
  'updated_at': displayedUpdatedAt,
  'published_at': publishedAt,
  'access_state': accessLevel,
  'state': productionProcessState,
  'visibility_state': searchIndexingState,
  'tags': softwareLibraries[] {
    ...(library-> {
       name,
      'label': slug.current,
      'http_url': url,
      'image_url': image.url
    }),
  },
  'instructor': collaborators[0]-> {
    ...(person-> {
      'full_name': name,
      'slug': slug.current,
      'avatar_url': image.url,
      'twitter_url': twitter
    }),
  },
  'illustrator': imageIllustrator-> {
    ...(person-> {
      'full_name': name,
      'slug': slug.current,
      'avatar_url': image.url,
      'twitter_url': twitter
    }),
  },
  'lessons': lessons[]-> {
    'slug': slug.current,
    'type': 'lesson',
    'path': '/lessons/' + slug.current,
    title,
    'thumb_url': thumbnailUrl,
    resource->_type == 'videoResource' => {
      ...(resource-> {
        'media_url': hlsUrl,
        duration
      })
    }
  }
}
`

/**
 * loads COURSE METADATA from Sanity
 * @param id
 */
export async function loadCourseMetadata(slug: string, id: number) {
  const params = {
    courseId: Number(id),
  }

  // Try loading the course from `Course` document, if it is there, use it.
  // Otherwise fallback to loading it from the `Resource` document.
  const course = await sanityClient.fetch(courseQuery, {slug})

  if (course) {
    return course
  } else {
    const courseResource = await sanityClient.fetch(courseResourceQuery, params)

    return courseResource
  }
}

export async function loadCourse(slug: string, token?: string) {
  return loadPlaylist(slug, token)
}
