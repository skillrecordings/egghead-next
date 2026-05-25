import React from 'react'
import SearchInstructorEssential from '../instructor-essential'
import Image from 'next/legacy/image'
import {get} from 'lodash'
import Link from 'next/link'
import {bpMinMD} from '@/utils/breakpoints'
import {track} from '@/utils/analytics'
import ExternalTrackedLink from '@/components/external-tracked-link'

export default function SearchKamranAhmed({instructor}: {instructor: any}) {
  instructor = {...instructor, ...curatedInstructorData}
  const combinedInstructor = {...instructor}

  const {courses} = instructor
  const [primaryCourse] = courses.resources

  return (
    <div>
      <SearchInstructorEssential
        instructor={combinedInstructor}
        CTAComponent={
          <FeaturedTypescriptCourse
            resource={primaryCourse}
            location="Kamran Ahmed instructor page"
          />
        }
      />
    </div>
  )
}

const curatedInstructorData = {
  courses: {
    resources: [
      {
        byline: 'Kamran Ahmed・9m・Course',
        description:
          'Learn to use some of the tips and tricks that can help you write better TypeScript. ',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/352/310/full/typescripts_tipstricks.png',
        instructor: {
          name: 'Kamran Ahmed',
        },
        path: '/courses/typescript-tips-and-tricks-20c4',
        title: 'TypeScript: Tips and Tricks',
      },
    ],
  },
} as Record<string, any>

const FeaturedTypescriptCourse: React.FC<
  React.PropsWithChildren<{location: string; resource: any}>
> = ({location, resource}) => {
  const {path, title, byline, description, image, background} = resource
  return (
    <ExternalTrackedLink
      eventName="clicked Kamran Ahmed instructor page CTA"
      params={{location}}
      className="block md:col-span-4 rounded-md w-full h-full overflow-hidden dark:bg-gray-800 border-0 bg-white border-gray-100 shadow-sm relative text-center"
      href={path}
    >
      <div className="md:min-h-[477px] md:-mt-5 flex items-center justify-center text-white overflow-hidden ">
        <div className="absolute top-0 left-0 bg-gradient-to-r from-yellow-400 to-blue-300 w-full h-2 z-20" />
        <div className="relative z-10 px-5 sm:py-16 py-10 sm:text-left text-center">
          <div className="space-y-5 mx-auto flex items-center justify-center max-w-screen-xl">
            <div className="flex flex-col items-center justify-center sm:space-x-5 sm:space-y-0 space-y-5 gap-10">
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
                <p className="text-xs text-gray-900 dark:text-white  uppercase font-semibold mb-2">
                  {byline}
                </p>
                <Link
                  href={path}
                  className="text-xl font-extrabold leading-tighter text-gray-900 dark:text-white hover:text-blue-300"
                  onClick={() =>
                    track('clicked jumbotron resource', {
                      resource: path,
                      linkType: 'text',
                    })
                  }
                >
                  <h2>{title}</h2>
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
