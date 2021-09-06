import groq from 'groq'
import Link from 'next/link'
import Image from 'next/image'
import Markdown from 'components/markdown'
import {track} from 'utils/analytics'
import SearchInstructorEssential from '../instructor-essential'
import {CardResource} from 'types'
import CtaCard from 'components/search/components/cta-card'
import {VerticalResourceCard} from 'components/card/verticle-resource-card'
import {HorizontalResourceCard} from 'components/card/horizontal-resource-card'

export default function SearchMatiasHernandez({instructor}: {instructor: any}) {
  let {
    englishFeature,
    spanishFeature,
    featuredCourses,
  } = instructor

  if (!englishFeature || !spanishFeature || !featuredCourses) {
    return (
      <div className="max-w-screen-xl mx-auto">
        <SearchInstructorEssential instructor={instructor} />
      </div>
    )
  }

  let [primaryCourse, ...restCourses] = featuredCourses.resources
  return (
    <div className="mx-auto max-w-screen-xl">
      <SearchInstructorEssential
        instructor={instructor}
        CTAComponent={
          <CtaCard
            resource={primaryCourse}
            trackTitle="clicked instructor landing page CTA resource"
            textLight
            location="Matias Hernandez instructor page"
          />
        }
      />

      <FeatureSection
        resource={spanishFeature}
        location="Matias Hernandez instructor page"
      />

      <FeatureSection
        resource={englishFeature}
        location="Matias Hernandez instructor page"
      />
    </div>
  )
}

type FeatureSectionType = {
  resource: {
    title: string
    description: string
    path?: string
    byline: string
    image: string
    resources: CardResource[]
  }
  location: string
}

const FeatureSection = ({resource, location}: FeatureSectionType) => {
  return (
    <section className="sm:mt-5 xl:px-0 px-5">
      <div className="flex items-center justify-center bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-50 overflow-hidden rounded-lg shadow-sm">
        <div className="px-5 sm:py-8 py-8 sm:text-left text-center">
          <div className="space-y-5 mx-auto flex items-center justify-center lg:px-8 w-full">
            <div className="w-full">
              <div className="grid sm:grid-cols-3 grid-cols-1 gap-5 mb-5">
                <div className="sm:col-span-2 flex flex-col sm:items-start items-center w-full">
                  <h3 className="text-xs text-gray-700 dark:text-gray-300 uppercase font-semibold mb-2">
                    {resource.byline ? resource.byline : ''}
                  </h3>
                  {resource.path ? (
                    <Link href={resource.path}>
                      <a
                        className="font-bold hover:text-blue-300 dark:hover:text-blue-300 transition ease-in-out"
                        onClick={() => {
                          track('clicked resource', {
                            resource: resource.path,
                            location,
                          })
                        }}
                      >
                        <h2 className="sm:text-2xl md:text-4xl text-xl max-w-screen-lg font-extrabold leading-tighter">
                          {resource.title}
                        </h2>
                      </a>
                    </Link>
                  ) : (
                    <h2 className="sm:text-2xl md:text-4xl text-xl max-w-screen-lg font-extrabold leading-tighter">
                      {resource.title}
                    </h2>
                  )}
                  <div>
                    <Markdown className="leading-relaxed text-gray-700 dark:text-gray-50 mt-4">
                      {resource.description}
                    </Markdown>
                  </div>
                </div>
              </div>
              <div className="grid md:grid-cols-3 grid-cols-1 gap-5 mt-8">
                {resource.resources.map((course: any) => {
                  return (
                    <VerticalResourceCard
                      className="col-span-3 sm:col-span-1 text-center shadow"
                      key={course.path}
                      resource={course}
                      location={location}
                    />
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export const MatiasHernandezQuery = groq`*[_type == 'resource' && slug.current == 'matias-hernandez-landing-page'][0]{
  title,
  'englishFeature': resources[slug.current == 'instructor-landing-page-english-resources'][0]{
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
  'spanishFeature': resources[slug.current == 'instructor-landing-page-spanish-resources'][0]{
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
