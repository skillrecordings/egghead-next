import groq from 'groq'

import {VerticalResourceCard} from 'components/card/verticle-resource-card'
import {get} from 'lodash'
import CtaCard from 'components/search/components/cta-card'
import SearchInstructorEssential from '../instructor-essential'

const SearchChrisAchard = ({instructor}: {instructor: any}) => {
  const {chrisAchardCta} = instructor

  if (!chrisAchardCta) {
    return (
      <div className="max-w-screen-xl mx-auto">
        <SearchInstructorEssential instructor={instructor} />
      </div>
    )
  }

  const location = 'chris achard landing page'

  const [cta, ...restCta] = chrisAchardCta.resources
  const courses = get(instructor, 'courses')

  return (
    <div className="max-w-screen-xl mx-auto">
      <SearchInstructorEssential
        instructor={instructor}
        CTAComponent={
          <CtaCard
            resource={cta}
            textLight
            trackTitle="clicked instructor landing page CTA resource"
            location="Chris Achard instructor page"
          />
        }
      />
      <div className="lg:col-span-8 col-span-12 space-y-5 flex flex-col">
        <div className="flex flex-col flex-grow">
          <h2 className="sm:px-5 px-3 mt-4 lg:text-2xl sm:text-xl text-lg dark:text-white font-semibold leading-tight">
            Featured Courses
          </h2>
          <div className="grid lg:grid-cols-12 grid-cols-1 gap-5 mt-5 flex-grow">
            {courses.resources.map((resource: any) => {
              return (
                <VerticalResourceCard
                  className="col-span-4 text-center flex flex-col items-center justify-center"
                  key={resource.path}
                  resource={resource}
                  location={location}
                  describe={true}
                />
              )
            })}
          </div>
        </div>
      </div>
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
    },
	'chrisAchardCta': resources[slug.current == 'chris-achard-cta'][0]{
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
