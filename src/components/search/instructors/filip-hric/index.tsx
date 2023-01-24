import React, {FunctionComponent} from 'react'
import SearchInstructorEssential from '../instructor-essential'
import Image from 'next/image'
import {get} from 'lodash'
import Link from 'next/link'
import groq from 'groq'
import {isFunction} from 'formik'
import analytics from 'utils/analytics'

import {Card} from 'components/card'

import {track} from 'utils/analytics'
import {HorizontalResourceCard} from 'components/card/horizontal-resource-card'
import {VerticalResourceCard} from 'components/card/verticle-resource-card'

export default function SearchFilipHric({
  instructor,
}: {
  instructor: any
  props: any
}) {
  const {
    courses,
    resources: {socials, workshopCta},
    articles,
  } = instructor
  const [primaryCourse, secondCourse] = courses.resources

  return (
    <div>
      <SearchInstructorEssential
        instructor={instructor}
        socials={socials}
        CTAComponent={
          <CypressCourseCTA
            currentLocation="instructor landing page"
            instructor="Filip Hric"
            topic="cypress"
            redirectTo="https://filiphric.com/cypress-core-workshop-november-2022"
            image={workshopCta.image}
            url={workshopCta.url}
          />
        }
      />
      <div className="flex flex-wrap justify-center gap-4 xl:flex-nowrap">
        <section className="text-center xl:text-left">
          <h2 className="my-4 text-lg font-semibold leading-tight lg:text-2xl sm:text-xl dark:text-white">
            Courses
          </h2>
          <div className="my-4">
            <div className="flex flex-wrap sm:flex-nowrap gap-3 justify-center sm:h-[424px]">
              <VerticalResourceCard
                className="flex flex-col justify-center h-full col-span-1 p-4 text-center bg-white rounded shadow-sm sm:w-64 dark:bg-gray-800 dark:text-gray-200"
                resource={primaryCourse}
                as="h3"
              />
              <VerticalResourceCard
                className="flex flex-col justify-center col-span-1 p-4 text-center bg-white rounded shadow-sm sm:w-64 dark:bg-gray-800 dark:text-gray-200"
                resource={secondCourse}
                as="h3"
              />
            </div>
          </div>
        </section>
        <section className="text-center xl:text-left">
          <h2 className="my-4 text-lg font-semibold leading-tight lg:text-2xl sm:text-xl dark:text-white">
            Articles
          </h2>
          <div className="grid justify-center max-w-xl grid-cols-1 gap-3 mx-auto lg:grid-cols-2">
            <HorizontalResourceCard
              className="col-span-2"
              resource={articles.resources[0]}
            />
            <HorizontalResourceCard
              className="col-span-2"
              resource={articles.resources[1]}
            />
          </div>
        </section>
      </div>
    </div>
  )
}

export const filipHricQuery = groq`*[_type == 'resource' && slug.current == "filip-hric-landing-page"][0]{
	resources[slug.current == 'instructor-landing-page-projects'][0]{
    'socials': resources[slug.current == 'socials'][0] {
      'discord': resources[slug.current == 'discord'][0]{
        title,
        'url': urls[0].url
      },
      'youtube': resources[slug.current == 'youtube'][0]{
        title,
        'url': urls[0].url
      },
      'github': resources[slug.current == 'github'][0]{
        title,
        'url': urls[0].url
      },
      'linkedin': resources[slug.current == 'linkedin'][0]{
        title,
        'url': urls[0].url
      },
    },
    'workshopCta': resources[slug.current == 'workshop-cta'][0] {
      'url': urls[0].url,
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

const isModifiedEvent = (event: any) =>
  !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)

const NewExternalTrackedLink: React.FunctionComponent<any> = ({
  currentLocation,
  instructor,
  topic,
  redirectTo,
  label,
  children,
  onClick = () => {},
  ...props
}) => {
  const handleClick = (event: any) => {
    const {href} = props

    if (isFunction(props.onClick)) props.onClick(event)

    function updateLocation() {
      window.location.href = href || '#'
    }

    if (
      !event.defaultPrevented && // onClick prevented default
      event.button === 0 && // ignore right clicks
      !props.target && // let browser handle "target=_blank" etc.
      !isModifiedEvent(event) // ignore clicks with modifier keys
    ) {
      event.preventDefault()
      event.stopPropagation()

      analytics.events
        .activityCtaClick(
          'workshop',
          currentLocation,
          instructor,
          topic,
          redirectTo,
        )
        .then(() => {
          if (isFunction(onClick)) {
            onClick()
          }
          updateLocation()
        })
      return false
    }
  }

  let {eventName, ...rest} = props

  return (
    <a {...rest} aria-label={label || ''} onClick={handleClick}>
      {children}
    </a>
  )
}

const CypressCourseCTA: React.FC<{
  instructor: string
  currentLocation: string
  topic: string
  redirectTo: string
  image: string
  url: string
}> = ({instructor, currentLocation, topic, redirectTo, image, url}) => {
  return (
    <NewExternalTrackedLink
      eventName="clicked epic react banner"
      params={{currentLocation, instructor, topic, redirectTo}}
      className="relative block h-full overflow-hidden text-center border-0 border-gray-100 md:col-span-4 lg:w-full"
      href={url}
      target="_blank"
      rel="noopener"
    >
      <Image
        priority
        quality={100}
        width={417}
        height={463}
        alt="Get Really Good at Cypress on with Filip Hric"
        src={image}
      />
    </NewExternalTrackedLink>
  )
}
