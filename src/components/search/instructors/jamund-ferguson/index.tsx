import groq from 'groq'

import SearchInstructorEssential from '../instructor-essential'
import CtaCard from 'components/search/components/cta-card'

export default function SearchJamundFerguson({instructor}: {instructor: any}) {
  let {reduxFeature, featuredCourses} = instructor

  if (!reduxFeature || !featuredCourses) {
    return (
      <div className="max-w-screen-xl mx-auto">
        <SearchInstructorEssential instructor={instructor} />
      </div>
    )
  }

  let [primaryCourse, secondCourse, thirdCourse] = featuredCourses.resources

  return (
    <div>
      <SearchInstructorEssential
        instructor={instructor}
        CTAComponent={
          <CtaCard
            resource={primaryCourse}
            trackTitle="clicked instructor landing page CTA resource"
            textLight
            location="Jamund Ferguson instructor page"
          />
        }
      />
    </div>
  )
}

export const jamundFergusonQuery = groq`*[_type == 'resource' && slug.current == 'jamund-ferguson-instructor-landing-page'][0]{
  title,
  'reduxFeature': resources[slug.current == 'instructor-landing-page-redux-feature'][0]{
  	description,
  	image,
  	title,
    resources[]->{
       title,
       description,
       path,
       byline,
       image,
       'background': images[label == 'feature-card-background'][0].url,
       'instructor': collaborators[]->[role == 'instructor'][0]{
         'name': person->.name
       },
     }
    },
	'featuredCourses': resources[slug.current == 'instructor-landing-page-featured-courses'][0]{
    resources[]->{
       title,
       'description': summary,
       path,
       byline,
       image,
       'background': images[label == 'feature-card-background'][0].url,
       'instructor': collaborators[]->[role == 'instructor'][0]{
         'name': person->.name
       },
     }
    },
 }`
