import groq from 'groq'

import CtaCard from 'components/search/components/cta-card'
import {CardResource} from 'types'
import SearchInstructorEssential from '../instructor-essential'
import {VerticalResourceCard} from 'components/card/verticle-resource-card'

const SearchKyleShevlin = ({instructor}: {instructor: any}) => {
  const {courses} = instructor

  if (!courses) {
    return (
      <div className="max-w-screen-xl mx-auto">
        <SearchInstructorEssential instructor={instructor} />
      </div>
    )
  }

  const [primaryCourse, ...restCourses] = courses.resources

  console.log(restCourses)

  return (
    <div className="max-w-screen-xl mx-auto">
      <SearchInstructorEssential
        instructor={instructor}
        CTAComponent={
          <CtaCard
            resource={primaryCourse}
            textLight
            trackTitle="clicked instructor landing page CTA resource"
            location="Kyle Shevlin instructor page"
          />
        }
      />

      <section className="xl:px-0 px-5">
        <h2 className="text-xl sm:font-semibold font-bold mb-3 dark:text-white">
          Get Good at JavaScript
        </h2>
        <div className="flex sm:flex-nowrap flex-wrap gap-4 mt-4">
          {restCourses.map((course: CardResource) => {
            return (
              <VerticalResourceCard
                className="mt-0 sm:w-1/2 w-full flex flex-col items-center justify-center text-center sm:py-8 py-6"
                resource={course}
                describe
                location="Kyle Shevlin instructor Landing page"
              />
            )
          })}
        </div>
      </section>
    </div>
  )
}
export default SearchKyleShevlin

export const KyleShevlinQuery = groq`
*[_type == 'resource' && slug.current == 'kyle-shevlin-landing-page'][0]{
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
