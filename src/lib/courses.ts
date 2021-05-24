import {sanityClient} from 'utils/sanity-client'
import {pickBy, identity} from 'lodash'
import groq from 'groq'

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
	"freshness": staffReviews[0]{
    status,
    title,
    "text": summary
  },
	"customOgImage": images[label == 'og-image'][0]{
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
      'image': image.url
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

export async function loadCourse(id: string) {
  const params = {
    courseId: id,
  }
  const course = await sanityClient.fetch(courseQuery, params)

  return course
}
