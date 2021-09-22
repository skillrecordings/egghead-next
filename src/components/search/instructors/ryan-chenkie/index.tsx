import groq from 'groq'

import CtaCard from 'components/search/components/cta-card'
import {CardResource} from 'types'
import SearchInstructorEssential from '../instructor-essential'
import {VerticalResourceCard} from 'components/card/verticle-resource-card'

const SearchRyanChenkie = ({instructor}: {instructor: any}) => {
  const {courses} = instructor

  if (!courses) {
    return (
      <div className="max-w-screen-xl mx-auto">
        <SearchInstructorEssential instructor={instructor} />
      </div>
    )
  }

  const [primaryCourse, ...restCourses] = courses.resources

  return (
    <div className="max-w-screen-xl mx-auto">
      <SearchInstructorEssential
        instructor={instructor}
        CTAComponent={
          <CtaCard
            resource={primaryCourse}
            textLight
            trackTitle="clicked instructor landing page CTA resource"
            location="Ryan Chenkie instructor page"
          />
        }
      />
    </div>
  )
}
export default SearchRyanChenkie

export const RyanChenkieQuery = groq`
*[_type == 'resource' && slug.current == 'ryan-chenkie-landing-page'][0]{
  title,
  'courses': resources[slug.current == 'instructor-landing-page-featured-courses'][0]{
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
 }
`
