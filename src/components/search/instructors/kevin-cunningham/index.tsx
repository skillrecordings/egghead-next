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

export default function SearchKevinCunningham({instructor}: {instructor: any}) {
  const {courses} = instructor

  const [primaryCourse, secondaryCourse, thirdCourse] = courses.resources

  return (
    <div>
      <SearchInstructorEssential
        instructor={instructor}
        CTAComponent={
          <FeaturedVue3Course
            resource={primaryCourse}
            location="Kevin Cunningham instructor page"
          />
        }
      />
      <section className="flex md:flex-row flex-col max-w-screen-xl mx-auto gap-4 px-5 md:px-0">
        <HorizontalResourceCard
          resource={secondaryCourse}
          location="Kevin Cunningham instructor page"
          className="md:w-1/2"
        />
        <HorizontalResourceCard
          resource={thirdCourse}
          location="Kevin Cunningham instructor page"
          className="md:w-1/2"
        />
      </section>
    </div>
  )
}

export const kevinCunninghamQuery = groq`*[_type == 'resource' && slug.current == "kevin-cunningham-landing-page"][0]{
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

const FeaturedVue3Course: React.FC<{location: string; resource: any}> = ({
  location,
  resource,
}) => {
  const {path, title, byline, description, image, background} = resource
  return (
    <ExternalTrackedLink
      eventName="clicked kevin cunningham page course CTA"
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
      <div
        className="md:-mt-5 flex items-center justify-center text-white overflow-hidden "
        css={{
          [bpMinMD]: {
            minHeight: 477,
          },
        }}
      >
        <div className="relative z-10 px-5 sm:py-16 py-10 sm:text-left text-center">
          <div className="space-y-5 mx-auto flex items-center justify-center max-w-screen-xl">
            <div className="flex flex-col items-center justify-center sm:space-x-5 sm:space-y-0 space-y-5 gap-10 mt-10">
              <div className="flex-shrink-0">
                <Link href={path}>
                  <a
                    tabIndex={-1}
                    onClick={() =>
                      track('clicked kevin cunningham page course CTA', {
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
                <h2 className="text-xs text-white text-opacity-80 uppercase font-semibold mb-2">
                  {byline}
                </h2>
                <Link href={path}>
                  <a
                    className="text-xl font-extrabold leading-tighter text-white hover:text-blue-300"
                    onClick={() =>
                      track('clicked kevin cunningham page course CTA', {
                        resource: path,
                        linkType: 'text',
                      })
                    }
                  >
                    <h1>{title}</h1>
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
