import groq from 'groq'
import SearchInstructorEssential from '../instructor-essential'
import CtaCard from 'components/search/components/cta-card'
import {HorizontalResourceCard} from 'components/card/horizontal-resource-card'

const SearchChrisAchard = ({instructor}: any) => {
  const {courses} = instructor

  const [primaryCourse, secondaryCourse, tertiaryCourse] = courses.resources

  const location = 'Chris Achard instructor Landing page'

  return (
    <div className="max-w-screen-xl mx-auto">
      <SearchInstructorEssential
        instructor={instructor}
        CTAComponent={
          <CtaCard
            textLight
            resource={primaryCourse}
            trackTitle="clicked instructor landing page CTA resource"
            location="Chris Achard instructor page"
          />
        }
      />
      <section className="flex md:flex-row flex-col max-w-screen-xl mx-auto gap-3 px-5 md:px-0">
        <HorizontalResourceCard
          resource={secondaryCourse}
          location={location}
          className="md:w-1/2"
        />
        <HorizontalResourceCard
          resource={tertiaryCourse}
          location={location}
          className="md:w-1/2"
        />
      </section>
    </div>
  )
}
export default SearchChrisAchard

export const ChrisAchardQuery = groq`
*[_type == 'resource' && slug.current == 'chris-achard-landing-page'][0]{
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
  }
}
`
