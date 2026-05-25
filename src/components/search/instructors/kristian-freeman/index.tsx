import React from 'react'
import SearchInstructorEssential from '../instructor-essential'
import Image from 'next/legacy/image'
import {get} from 'lodash'
import Link from 'next/link'
import {bpMinMD} from '@/utils/breakpoints'
import {track} from '@/utils/analytics'
import ExternalTrackedLink from '@/components/external-tracked-link'
import {HorizontalResourceCard} from '@/components/card/horizontal-resource-card'

export default function SearchKristianFreeman({instructor}: {instructor: any}) {
  instructor = {...instructor, ...curatedInstructorData}
  const combinedInstructor = {...instructor}
  const {courses} = instructor
  const [primaryCourse, secondaryCourse, tertiaryCourse] = courses.resources
  const location = 'Kristian Freeman instructor page'

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
          Featured Courses
        </h2>
        <div className="flex md:flex-row flex-col max-w-screen-xl mx-auto gap-3 px-5 md:px-0">
          <HorizontalResourceCard
            resource={secondaryCourse}
            location={location}
            className="md:w-3/5"
          />
          <HorizontalResourceCard
            resource={tertiaryCourse}
            location={location}
            className="md:w-3/5"
          />
        </div>
      </section>
    </div>
  )
}

const curatedInstructorData = {
  courses: {
    resources: [
      {
        background:
          'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1628704067/next.egghead.io/resources/build-a-real-time-data-syncing-chat-application-with-supabase-and-next-js/feature-card-background--nextjs--supabase.png',
        byline: 'Kristian Freeman • 2h 1m • Course',
        description:
          'Learn to model real-world scenarios in actual relational databases, understand how to manage real-time data, and leverage key functionality provided by Supabase.',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/476/205/full/next_supabase_212_2x.png',
        instructor: {
          name: 'Kristian Freeman',
        },
        path: '/courses/build-a-real-time-data-syncing-chat-application-with-supabase-and-next-js-84e58958',
        title:
          'Build a Real-Time Data Syncing Chat Application with Supabase and Next.js',
      },
      {
        background:
          'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1623765767/egghead-next-pages/build-a-serverless-api-with-cloudflare-workers/feature-card--cloudflare-workers.svg',
        byline: 'Kristian Freeman • 47m • Course',
        description:
          'You will learn how to build and deploy a Serverless API with Cloudflare Workers. Enabling you to effectively manage a highly available backend for your projects. ',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/441/045/full/EGH_cloudflare-workers_424_2x.png',
        instructor: {
          name: 'Kristian Freeman',
        },
        path: '/courses/build-a-serverless-api-with-cloudflare-workers-d67ca551',
        title: 'Build a Serverless API with Cloudflare Workers',
      },
      {
        background: null,
        byline: 'Kristian Freeman ・47m・Course',
        description:
          "Follow along with Kristian Freeman as you build a localization engine that renders data based on the Edge location nearest to the application's user.",
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/418/892/full/EGH_IntroCloudFlareWorkers_Final.png',
        instructor: {
          name: 'Kristian Freeman',
        },
        path: '/courses/introduction-to-cloudflare-workers-5aa3',
        title: 'Introduction to Cloudflare Workers',
      },
    ],
  },
} as Record<string, any>

const FeaturedCourse: React.FC<
  React.PropsWithChildren<{location: string; resource: any}>
> = ({location, resource}) => {
  const {path, title, byline, description, image} = resource
  return (
    <ExternalTrackedLink
      eventName="clicked Kristian Freeman instructor page CTA"
      params={{location}}
      className="block md:col-span-4 rounded-md w-full h-full overflow-hidden dark:bg-gray-800 border-0 bg-white border-gray-100 shadow-sm relative text-center"
      href={path}
    >
      <div className="absolute top-0 left-0 bg-gradient-to-r from-green-400 to-green-500 w-full h-2 z-20"></div>
      <div className="absolute inset-0 bg-white mix-blend-multiply" />
      <div className="md:min-h-[477px] md:-mt-5 flex items-center justify-center text-white overflow-hidden ">
        <div className="relative z-10 px-5 sm:py-16 py-10 sm:text-left text-center">
          <div className="space-y-5 mx-auto flex items-center justify-center max-w-screen-xl">
            <div className="flex flex-col items-center justify-center sm:space-x-5 sm:space-y-0 space-y-5 gap-10 mt-10">
              <div className="flex-shrink-0">
                <Link
                  href={path}
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
                </Link>
              </div>
              <div className="flex flex-col sm:items-start items-center">
                <p className="text-xs text-gray-700 dark:text-gray-300 text-opacity-80 uppercase font-semibold mb-2">
                  {byline}
                </p>
                <Link
                  href={path}
                  className="text-xl font-extrabold leading-tighter text-gray-900 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-300"
                  onClick={() =>
                    track('clicked jumbotron resource', {
                      resource: path,
                      linkType: 'text',
                    })
                  }
                >
                  <h2>{title}</h2>
                </Link>
                <p className="mt-4 text-gray-700 dark:text-gray-300">
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
