import {sanityClient} from 'utils/sanity-client'
import groq from 'groq'
import {loadPlaylist} from './playlists'

const courseQuery = groq`
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

/**
 * loads COURSE METADATA from Sanity
 * @param id
 */
export async function loadCourseMetadata(id: number) {
  const params = {
    courseId: Number(id),
  }

  const course = await sanityClient.fetch(courseQuery, params)

  if (course?.illustration?.url) {
    course['square_cover_480_url'] = course.illustration.url
  }

  return course
}

export async function loadCourse(slug: string, token?: string) {
  return loadPlaylist(slug, token)
}
