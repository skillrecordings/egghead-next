import React, {FunctionComponent} from 'react'
import SearchInstructorEssential from '../instructor-essential'
import Image from 'next/legacy/image'
import {get} from 'lodash'
import Link from 'next/link'
import {isFunction} from 'formik'
import analytics from '@/utils/analytics'

import {Card} from '@/components/card'

import {track} from '@/utils/analytics'
import {HorizontalResourceCard} from '@/components/card/horizontal-resource-card'
import {VerticalResourceCard} from '@/components/card/verticle-resource-card'

export default function SearchFilipHric({
  instructor,
}: {
  instructor: any
  props: any
}) {
  instructor = {...instructor, ...curatedInstructorData}
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

const curatedInstructorData = {
  articles: {
    resources: [
      {
        byline: 'Filip Hric • Article',
        collaborators: {
          image:
            'https://d2eip9sf3oo6c2.cloudfront.net/instructors/avatars/000/000/555/medium/photo_edit_4.png',
          name: 'Filip Hric',
        },
        image:
          'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1618432104/egghead-next-ebombs/intercepting-network-requests-in-cypress/ball_of_yarn_1.png',
        path: '/blog/intercepting-network-requests-in-cypress',
        summary:
          'Walk through some of the capabilities of Cypress’ `.intercept()` command. Super useful tool, especially for testing hard-to-reach places of your app.',
        title: 'A Practical Guide to Intercepting Network Requests in Cypress',
      },
      {
        byline: 'Filip Hric • Article',
        collaborators: {
          image:
            'https://d2eip9sf3oo6c2.cloudfront.net/instructors/avatars/000/000/555/medium/photo_edit_4.png',
          name: 'Filip Hric',
        },
        image:
          'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1665510470/next.egghead.io/pages/learn/javascript/handling-copy-and-paste-in-cypress/copy-and-paste_square.png',
        path: '/blog/handling-copy-and-paste-in-cypress',
        summary:
          'Clipboard or pasting text is not available in Cypress. But Cypress is pure JavaScript, so you can do anything that JS allows you to do.',
        title: 'Handling Copy and Paste in Cypress',
      },
    ],
  },
  courses: {
    resources: [
      {
        background: null,
        byline: 'Filip Hric • 14m • Course',
        description:
          'Learn how to set up and test different network conditions using the Cypress intercept command.',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/529/470/full/cypress.png',
        instructor: {
          name: 'Filip Hric',
        },
        path: '/playlists/test-network-edge-cases-with-intercept-command-in-cypress-0fd94c68',
        title: 'Test Network Edge Cases with .intercept() Command in Cypress',
      },
      {
        background: null,
        byline: 'Filip Hric • 37m • Course',
        description:
          'With Cypress’ component testing, you can now take the best of both worlds. Render components and interact with them in a real browser.',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/599/439/full/egh_vue-cypress_2000.png',
        instructor: {
          name: 'Filip Hric',
        },
        path: '/playlists/write-test-and-debug-vue-3-components-in-the-browser-using-cypress-3723fe80',
        title:
          'Write, Test, and Debug Vue 3 Components in the Browser Using Cypress',
      },
    ],
  },
  resources: {
    socials: {
      discord: {
        title: 'Discord',
        url: 'https://filiphric.com/discord',
      },
      github: {
        title: 'GitHub',
        url: 'https://github.com/filiphric/',
      },
      linkedin: {
        title: 'LinkedIn',
        url: 'https://www.linkedin.com/in/filip-hric-11a5b1126/',
      },
      youtube: {
        title: 'Youtube',
        url: 'https://www.youtube.com/channel/UCDOCAVIhSh5VpJMEfdak1OA',
      },
    },
    workshopCta: {
      image:
        'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1665172332/egghead-next-pages/instructors/Filip%20Hric/filip-cypress-workshop-cta.png',
      url: 'https://filiphric.com/cypress-core-workshop-november-2022',
    },
  },
} as Record<string, any>

const isModifiedEvent = (event: any) =>
  !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)

const NewExternalTrackedLink: React.FunctionComponent<
  React.PropsWithChildren<any>
> = ({
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

const CypressCourseCTA: React.FC<
  React.PropsWithChildren<{
    instructor: string
    currentLocation: string
    topic: string
    redirectTo: string
    image: string
    url: string
  }>
> = ({instructor, currentLocation, topic, redirectTo, image, url}) => {
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
