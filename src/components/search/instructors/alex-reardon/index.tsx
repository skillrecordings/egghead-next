import React from 'react'
import SearchInstructorEssential from '../instructor-essential'
import Image from 'next/image'
import {get} from 'lodash'
import Link from 'next/link'
import groq from 'groq'
import {bpMinMD} from 'utils/breakpoints'
import {track} from 'utils/analytics'
import ExternalTrackedLink from 'components/external-tracked-link'

export default function SearchAlexReardon({instructor}: {instructor: any}) {
  const combinedInstructor = {...instructor}

  const {courses} = instructor
  const [primaryCourse] = courses.resources

  return (
    <div>
      <SearchInstructorEssential
        instructor={combinedInstructor}
        CTAComponent={
          <FeaturedDomEventsCourse
            resource={primaryCourse}
            location="Alex Reardon instructor page"
          />
        }
      />
    </div>
  )
}

export const alexReardonQuery = groq`*[_type == 'resource' && slug.current == "alex-reardon-landing-page"][0]{
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
}`

const FeaturedDomEventsCourse: React.FC<
  React.PropsWithChildren<{location: string; resource: any}>
> = ({location, resource}) => {
  const {path, title, byline, description, image, background} = resource
  return (
    <ExternalTrackedLink
      eventName="clicked Alex Reardon instructor page CTA"
      params={{location}}
      className="block md:col-span-4 rounded-md w-full h-full overflow-hidden dark:bg-gray-800 border-0 bg-white border-gray-100 shadow-sm relative text-center"
      href={path}
    >
      <img
        className="absolute h-full w-full object-cover object-left-top"
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
                <p className="text-xs text-white text-opacity-80 uppercase font-semibold mb-2">
                  {byline}
                </p>
                <Link href={path}>
                  <a
                    className="text-xl font-extrabold leading-tighter text-white hover:text-blue-300"
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
                <p className="mt-4 text-white">{description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ExternalTrackedLink>
  )
}
