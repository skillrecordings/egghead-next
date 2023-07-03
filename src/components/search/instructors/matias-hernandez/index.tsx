import groq from 'groq'
import Link from 'next/link'
import Markdown from 'components/markdown'
import {track} from 'utils/analytics'
import SearchInstructorEssential from '../instructor-essential'
import {CardResource} from 'types'
import CtaCard from 'components/search/components/cta-card'
import {VerticalResourceCard} from 'components/card/new-vertical-resource-card'
import ExternalTrackedLink from 'components/external-tracked-link'
import Image from 'next/image'
import {bpMinMD} from 'utils/breakpoints'
import {get} from 'lodash'
import Grid from 'components/grid'
import {HorizontalResourceCard} from 'components/card/new-horizontal-resource-card'

export default function SearchMatiasHernandez({
  instructor,
}: {
  instructor: any
  props: any
}) {
  const combinedInstructor = {...instructor}

  const {courses, articles} = instructor
  const [primaryCourse, ...restCourses] = courses.resources

  return (
    <div className="max-w-screen-xl mx-auto">
      <SearchInstructorEssential
        instructor={combinedInstructor}
        CTAComponent={
          <FeaturedPrimaryCourse
            resource={primaryCourse}
            location="Matias Hernandez instructor page"
          />
        }
      />

      <section className="xl:px-0 px-5 mt-8">
        <h2 className="text-xl sm:font-semibold font-bold mb-3 dark:text-white">
          Courses
        </h2>
        <div className="flex sm:flex-nowrap flex-wrap justify-center gap-4 mt-4">
          {restCourses.map((course: CardResource) => {
            return (
              <VerticalResourceCard
                className=" dark:bg-gray-800 bg-white dark:bg-opacity-60 shadow-smooth dark:hover:bg-gray-700 dark:hover:bg-opacity-50 rounded w-4/5 sm:w-1/3"
                resource={course}
                location="Matias Hernandez instructor Landing page"
              />
            )
          })}
        </div>
      </section>

      <section className="xl:px-0 px-5">
        <h2 className="text-xl sm:font-semibold font-bold mb-3 mt-4 dark:text-white">
          Articles
        </h2>
        <Grid>
          {articles.resources.map((resource: CardResource, i: number) => {
            switch (articles.resources.length) {
              case 3:
                return i === 0 ? (
                  <HorizontalResourceCard
                    className="col-span-2"
                    key={resource.id}
                    resource={resource}
                    location="Matias Hernandez instructor page"
                  />
                ) : (
                  <VerticalResourceCard
                    key={resource.id}
                    resource={resource}
                    location="Matias Hernandez instructor page"
                  />
                )
              case 6:
                return i === 0 || i === 1 ? (
                  <HorizontalResourceCard
                    className="col-span-2"
                    key={resource.id}
                    resource={resource}
                    location="Matias Hernandez instructor page"
                  />
                ) : (
                  <VerticalResourceCard
                    key={resource.id}
                    resource={resource}
                    location="Matias Hernandez instructor page"
                  />
                )
              case 7:
                return i === 0 ? (
                  <HorizontalResourceCard
                    className="col-span-2"
                    key={resource.id}
                    resource={resource}
                    location="Matias Hernandez instructor page"
                  />
                ) : (
                  <VerticalResourceCard
                    key={resource.id}
                    resource={resource}
                    location="Matias Hernandez instructor page"
                  />
                )
              default:
                return (
                  <VerticalResourceCard
                    key={resource.id}
                    resource={resource}
                    location="Matias Hernandez instructor page"
                  />
                )
            }
          })}
        </Grid>
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
  'articles': resources[slug.current == 'instructor-landing-page-featured-articles'][0]{
    resources[] {
      title,
      summary,
      image,
      byline,
      path,
      collaborators[0]-> {
        'name': person->name,
        'image': person->image.url
      }
    }
  }
}`

const FeaturedPrimaryCourse: React.FC<{location: string; resource: any}> = ({
  location,
  resource,
}) => {
  const {path, title, byline, description, image, background} = resource
  return (
    <ExternalTrackedLink
      eventName="clicked Matiaz Hernandez instructor page CTA"
      params={{location}}
      className="block md:col-span-4 rounded-md w-full h-full overflow-hidden dark:bg-gray-800 border-0 bg-white border-gray-100 shadow-sm relative text-center"
      href={path}
    >
      <div className="md:min-h-[477px] md:-mt-5 flex items-center justify-center text-white overflow-hidden ">
        <div className="absolute top-0 left-0 bg-gradient-to-r from-indigo-500 to-pink-900 w-full h-2 z-20" />
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
                <p className="text-xs text-gray-900 dark:text-white  uppercase font-semibold mb-2">
                  {byline}
                </p>
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
                    <h2>{title}</h2>
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
