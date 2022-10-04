import React from 'react'
import SearchInstructorEssential from '../instructor-essential'
import Image from 'next/image'
import {get} from 'lodash'
import Link from 'next/link'
import groq from 'groq'
import {bpMinMD} from 'utils/breakpoints'
import {track} from 'utils/analytics'
import ExternalTrackedLink from 'components/external-tracked-link'
import {HorizontalResourceCard} from 'components/card/horizontal-resource-card'

export default function SearchHirokoNishimura({instructor}: {instructor: any}) {
  const combinedInstructor = {...instructor}
  const {courses, projects} = instructor
  const primaryProject = projects.resources
  const [primaryCourse, secondaryCourse] = courses.resources
  const location = 'Hiroko Nishimura instructor page'

  return (
    <div>
      <SearchInstructorEssential
        instructor={combinedInstructor}
        CTAComponent={
          <FeaturedCourse resource={primaryCourse} location={location} />
        }
      />

      <section>
        <h2 className="sm:px-5 px-3 my-4 lg:text-2xl sm:text-xl text-lg dark:text-white font-semibold leading-tight">
          Featured Resources
        </h2>
        <div className="flex md:flex-row flex-col max-w-screen-xl mx-auto gap-3 px-5 md:px-0">
          <HorizontalResourceCard
            resource={primaryProject}
            location={location}
            className="md:w-2/5"
          />
          <HorizontalResourceCard
            resource={secondaryCourse}
            location={location}
            className="md:w-3/5"
          />
        </div>
      </section>
    </div>
  )
}

export const hirokoNishimuraQuery = groq`*[_type == 'resource' && slug.current == "hiroko-nishimura-landing-page"][0]{
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
	'projects': resources[slug.current == 'instructor-landing-page-projects'][0]{
    resources[0]{
      title,
      'path': url,
      path,
      description,
      image,
      byline
    }
  }
}`

const FeaturedCourse: React.FC<{location: string; resource: any}> = ({
  location,
  resource,
}) => {
  const {path, title, byline, description, image, background} = resource
  return (
    <ExternalTrackedLink
      eventName="clicked Hiroko Nishimura instructor page CTA"
      params={{location}}
      className="block md:col-span-4 rounded-md w-full h-full overflow-hidden dark:bg-gray-800 border-0 bg-white border-gray-100 shadow-sm relative text-center"
      href={path}
    >
      <div className="absolute top-0 left-0 bg-gradient-to-r from-blue-700 to-blue-800 w-full h-2 z-20"></div>
      <img
        className="absolute w-full object-fit object-left-top"
        src={background}
        alt=""
      />
      <div className="absolute inset-0 bg-gray-200 mix-blend-multiply" />
      <div className="md:min-h-[477px] md:-mt-5 flex items-center justify-center text-white overflow-hidden ">
        <div className="relative z-10 px-5 sm:py-16 py-10 sm:text-left text-center">
          <div className="space-y-5 mx-auto flex items-center justify-center max-w-screen-xl">
            <div className="flex flex-col items-center justify-center sm:space-x-5 sm:space-y-0 space-y-5 gap-10 mt-10">
              <div className="flex-shrink-0">
                <Link href={path}>
                  <a
                    tabIndex={-1}
                    onClick={() =>
                      track('clicked instructor page CTA', {
                        resource: path,
                        linkType: 'image',
                        location: 'hiroko-nishimura',
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
                <p className="text-xs text-gray-900 dark:text-white text-opacity-80 uppercase font-semibold mb-2">
                  {byline}
                </p>
                <Link href={path}>
                  <a
                    className="text-xl font-extrabold leading-tighter text-gray-900 dark:text-white hover:text-blue-300"
                    onClick={() =>
                      track('clicked instructor page CTA', {
                        resource: path,
                        linkType: 'text',
                        location: 'hiroko-nishimura',
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
      </div>
    </ExternalTrackedLink>
  )
}
