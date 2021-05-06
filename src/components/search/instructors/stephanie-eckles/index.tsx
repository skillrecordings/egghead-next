import React, {FunctionComponent} from 'react'
import SearchInstructorEssential from '../instructor-essential'
import Image from 'next/image'
import Textfit from 'react-textfit'
import {get} from 'lodash'
import Link from 'next/link'
import groq from 'groq'
import Markdown from 'react-markdown'

import Card, {CardResource} from 'components/pages/home/card'

import {bpMinMD} from 'utils/breakpoints'
import {track} from 'utils/analytics'
import ExternalTrackedLink from 'components/external-tracked-link'

export default function SearchStephanieEckles({instructor}: {instructor: any}) {
  const combinedInstructor = {...instructor}

  const {projects, courses} = instructor
  const [
    primaryCourse,
    secondCourse,
    thirdCourse,
    fourthCourse,
  ] = courses.resources

  return (
    <div>
      <SearchInstructorEssential
        instructor={combinedInstructor}
        CTAComponent={
          <CssFormStyling
            resource={primaryCourse}
            location="Stephanie Eckles instructor page"
          />
        }
      />
      <section className="grid lg:grid-cols-6 grid-cols-1 -mt-10 mb-10 pb-10 xl:px-0 px-5 max-w-screen-xl mx-auto dark:bg-gray-900 w-full gap-0 lg:gap-3">
        <ProjectStack
          className="col-span-2 mb-3 lg:mb-0"
          data={projects.resources}
        />
        <div className="col-span-4 grid lg:grid-cols-2 grid-cols-1 auto-cols-max gap-3">
          <CardHorizontal className="col-span-2" resource={secondCourse} />
          <CardVerticalLarge className="col-span-1" data={thirdCourse} />
          <CardVerticalLarge className="col-span-1" data={fourthCourse} />
        </div>
      </section>
    </div>
  )
}

export const stephanieEcklesQuery = groq`*[_type == 'resource' && slug.current == "stephanie-eckles-landing-page"][0]{
	'projects': resources[slug.current == 'instructor-landing-page-projects'][0]{
    resources[]{
      title,
      'path': url,
      description,
      image
    }
},
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

type CardProps = {
  data: CardResource
  className?: string
  memberTitle?: string
}

const ProjectStack: FunctionComponent<any> = ({data, className}) => {
  return (
    <Card className={className}>
      <>
        <h2 className="uppercase font-semibold text-xs mb-1 text-gray-700 dark:text-gray-300">
          Stephanie's Projects
        </h2>
        <hr />
        <div className="h-full">
          <ul className="flex flex-col h-full justify-evenly">
            {data.map((item: any) => {
              const {description, title, image, path} = item
              return (
                <li key={path} className="my-5">
                  {path && (
                    <Link href={path}>
                      <a
                        onClick={() => {
                          track('clicked instructor project resource', {
                            resource: path,
                            linkType: 'image',
                            location: 'instructor page',
                          })
                        }}
                        tabIndex={-1}
                      >
                        <div className="flex items-center gap-4 rounded transition duration-200 ease-in-out">
                          <div className="flex-shrink-0">
                            {image && (
                              <Image
                                src={get(image, 'src', image)}
                                width="40"
                                height="40"
                                alt={`illustration for ${title}`}
                              />
                            )}
                          </div>
                          <div>
                            <h2 className="text-lg font-bold leading-tighter hover:text-blue-600 dark:hover:text-blue-300 mb-1">
                              {title}
                            </h2>
                            <p className=" text-sm leading-tight max-w-none">
                              {description}
                            </p>
                          </div>
                        </div>
                      </a>
                    </Link>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      </>
    </Card>
  )
}

const CardVerticalLarge: FunctionComponent<CardProps> = ({data}) => {
  const {path, image, title, name, byline} = data
  return (
    <Card className="border-none flex flex-col items-center justify-center text-center sm:py-8 py-6">
      <>
        {image && (
          <Link href={path}>
            <a
              onClick={() => {
                track('clicked home page resource', {
                  resource: path,
                  linkType: 'image',
                })
              }}
              className="mb-2 mx-auto w-32"
              tabIndex={-1}
            >
              <Image
                width={220}
                height={220}
                src={get(image, 'src', image)}
                alt={`illustration for ${title}`}
              />
            </a>
          </Link>
        )}
        <h2 className="uppercase font-semibold text-xs mb-1 text-gray-700 dark:text-gray-300">
          {name}
        </h2>
        <Link href={path}>
          <a
            onClick={() => {
              track('clicked home page resource', {
                resource: path,
                linkType: 'text',
              })
            }}
            className="hover:text-blue-600 dark:hover:text-blue-300"
          >
            <h3 className="md:text-lg text-base sm:font-semibold font-bold leading-tight">
              <Textfit mode="multi" min={14} max={20}>
                {title}
              </Textfit>
            </h3>
          </a>
        </Link>
        <div className="text-xs text-gray-600 dark:text-gray-300 mt-1">
          {byline}
        </div>
      </>
    </Card>
  )
}

export const CardHorizontal: FunctionComponent<{
  resource: CardResource
  className?: string
  location?: string
}> = ({resource, className = 'border-none my-4', location = 'home'}) => {
  return (
    <Card className={className}>
      <>
        <div className="flex sm:flex-row flex-col sm:space-x-5 space-x-0 sm:space-y-0 space-y-5 items-center sm:text-left text-center">
          {resource.image && (
            <Link href={resource.path}>
              <a
                onClick={() => {
                  track('clicked resource', {
                    resource: resource.path,
                    linkType: 'image',
                    location,
                  })
                }}
                className="block flex-shrink-0 sm:w-auto m:w-24 w-36"
                tabIndex={-1}
              >
                <Image
                  src={get(resource.image, 'src', resource.image)}
                  width={160}
                  height={160}
                  layout="fixed"
                  className="object-cover rounded-md"
                  alt={`illustration for ${resource.title}`}
                />
              </a>
            </Link>
          )}
          <div className="flex flex-col justify-center sm:items-start items-center">
            <h2 className=" uppercase font-semibold text-xs tracking-tight text-gray-700 dark:text-gray-300 mb-1">
              {resource.name}
            </h2>
            <Link href={resource.path}>
              <a
                onClick={() => {
                  track('clicked resource', {
                    resource: resource.path,
                    linkType: 'text',
                    location,
                  })
                }}
                className="hover:text-blue-600 dark:hover:text-blue-300"
              >
                <h3 className="text-xl font-bold leading-tighter">
                  {resource.title}
                </h3>
              </a>
            </Link>
            <div className="text-xs text-gray-600 dark:text-gray-300 mb-2 mt-1">
              {resource.byline}
            </div>
            <Markdown
              source={resource.description || ''}
              className="prose dark:prose-dark dark:prose-dark-sm prose-sm max-w-none"
            />
          </div>
        </div>
      </>
    </Card>
  )
}

const CssFormStyling: React.FC<{location: string; resource: any}> = ({
  location,
  resource,
}) => {
  const {path, title, byline, description, image, background} = resource
  return (
    <ExternalTrackedLink
      eventName="clicked CSS page CTA"
      params={{location}}
      className="block md:col-span-4 rounded-md w-full h-full overflow-hidden border-0 border-gray-100 relative text-center"
      href={path}
    >
      <div
        className="md:-mt-5 flex items-center justify-center bg-white dark:bg-gray-900 text-white overflow-hidden rounded-b-lg md:rounded-t-none rounded-t-lg shadow-sm"
        css={{
          [bpMinMD]: {
            minHeight: 477,
          },
        }}
      >
        <div className="absolute top-0 left-0 bg-gradient-to-r from-yellow-500 to-lightBlue-500 w-full h-2 z-20" />
        <div className="relative z-10 px-5 sm:py-16 py-10 sm:text-left text-center">
          <div className="space-y-5 mx-auto flex items-center justify-center max-w-screen-xl">
            <div className="flex flex-col items-center justify-center sm:space-x-5 sm:space-y-0 space-y-5">
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
                    className="text-xl font-extrabold leading-tighter text-gray-900 dark:text-white hover:text-blue-300"
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
