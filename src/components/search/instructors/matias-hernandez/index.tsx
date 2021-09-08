import groq from 'groq'
import Link from 'next/link'
import Markdown from 'components/markdown'
import {track} from 'utils/analytics'
import SearchInstructorEssential from '../instructor-essential'
import {CardResource} from 'types'
import CtaCard from 'components/search/components/cta-card'
import {VerticalResourceCard} from 'components/card/verticle-resource-card'
import ExternalTrackedLink from 'components/external-tracked-link'
import Image from 'next/image'
import {bpMinMD} from 'utils/breakpoints'
import {get} from 'lodash'

export default function SearchMatiasHernandez({instructor}: {instructor: any}) {
  const combinedInstructor = {...instructor}

  const {courses} = instructor
  const [primaryCourse, ...restCourses] = courses.resources

  return (
    <div className="max-w-screen-xl mx-auto">
      <SearchInstructorEssential
        instructor={combinedInstructor}
        CTAComponent={
          <FeaturedReactHooksCourse
            resource={primaryCourse}
            location="Matias Hernandez instructor page"
          />
        }
      />

      <section className="xl:px-0 px-5">
        <h2 className="text-xl sm:font-semibold font-bold mb-3 dark:text-white">
          JavaScript Resources
        </h2>
        <div className="flex sm:flex-nowrap flex-wrap gap-4 mt-4">
          {restCourses.map((course: CardResource) => {
            return (
              <VerticalResourceCard
                className="mt-0 sm:w-1/2 w-full flex flex-col items-center justify-center text-center sm:py-8 py-6"
                resource={course}
                describe
                location="Matias Hernandez instructor Landing page"
              />
            )
          })}
        </div>
      </section>
    </div>
  )
}

export const MatiasHernandezQuery = groq`*[_type == 'resource' && slug.current == "matias-hernandez-landing-page"][0]{
  'courses': resources[slug.current == 'instructor-landing-page-featured-courses'][0]{
    resources[]->{
      title,
      'description': summary,
    	path,
      byline,
    	image,
      'instructor': collaborators[]->[role == 'instructor'][0]{
      	'name': person->.name
    	},
    }
  },
}`

const FeaturedReactHooksCourse: React.FC<{location: string; resource: any}> = ({
  location,
  resource,
}) => {
  const {path, title, byline, description, image, background} = resource
  return (
    <ExternalTrackedLink
      eventName="clicked CSS page CTA"
      params={{location}}
      className="block md:col-span-4 rounded-md w-full h-full overflow-hidden dark:bg-gray-800 border-0 bg-white border-gray-100 shadow-sm relative text-center"
      href={path}
    >
      <div
        className="md:-mt-5 flex items-center justify-center text-white overflow-hidden "
        css={{
          [bpMinMD]: {
            minHeight: 477,
          },
        }}
      >
        <div className="absolute top-0 left-0 bg-gradient-to-r from-blue-400 to-cyan-400 w-full h-2 z-20" />
        <div className="relative z-10 px-5 sm:py-16 py-10 sm:text-left text-center">
          <div className="space-y-5 mx-auto flex items-center justify-center max-w-screen-xl">
            <div className="flex flex-col items-center justify-center sm:space-x-5 sm:space-y-0 space-y-5 gap-10">
              <div className="flex-shrink-0">
                <Link href={path}>
                  <a
                    tabIndex={-1}
                    onClick={() =>
                      track('clicked jumbotron resource', {
                        resource: path,
                        linkType: 'image',
                      })
                    }
                  >
                    <Image
                      quality={100}
                      src={get(image, 'src', image)}
                      width={250}
                      height={250}
                      alt={get(image, 'alt', `illustration for ${title}`)}
                    />
                  </a>
                </Link>
              </div>
              <div className="flex flex-col sm:items-start items-center">
                <h2 className="text-xs text-gray-900 dark:text-white  uppercase font-semibold mb-2">
                  {byline}
                </h2>
                <Link href={path}>
                  <a
                    className="text-xl font-extrabold leading-tighter text-gray-900 dark:text-white hover:text-cyan-400"
                    onClick={() =>
                      track('clicked jumbotron resource', {
                        resource: path,
                        linkType: 'text',
                      })
                    }
                  >
                    <h1>{title}</h1>
                  </a>
                </Link>
                <p className="mt-4 text-gray-900 dark:text-white">
                  {description}
                </p>
              </div>
            </div>
          </div>
        </div>
        <img
          className="absolute top-0 left-0 z-0 w-full"
          src={background}
          alt=""
        />
      </div>
    </ExternalTrackedLink>
  )
}
