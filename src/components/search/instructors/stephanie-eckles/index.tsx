import React, {FunctionComponent} from 'react'
import SearchInstructorEssential from '../instructor-essential'
import Image from 'next/legacy/image'
import {get} from 'lodash'
import Link from 'next/link'

import {Card} from '@/components/card'

import {bpMinMD} from '@/utils/breakpoints'
import {track} from '@/utils/analytics'
import ExternalTrackedLink from '@/components/external-tracked-link'
import {HorizontalResourceCard} from '@/components/card/new-horizontal-resource-card'
import {VerticalResourceCard} from '@/components/card/new-vertical-resource-card'

export default function SearchStephanieEckles({instructor}: {instructor: any}) {
  instructor = {...instructor, ...curatedInstructorData}
  const combinedInstructor = {...instructor}

  const {projects, courses} = instructor
  const [primaryCourse, secondCourse, thirdCourse, fourthCourse] =
    courses.resources

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
      <section>
        <h2 className="sm:px-5 px-3 my-4 lg:text-2xl sm:text-xl text-lg dark:text-white font-semibold leading-tight">
          Featured Resources
        </h2>
        <div className="grid lg:grid-cols-6  mb-10 pb-10 w-full gap-2">
          <ProjectStack
            className="mb-3 lg:mb-0 col-span-2"
            data={projects.resources}
          />
          <HorizontalResourceCard
            className="col-span-2 sm:col-span-4"
            resource={secondCourse}
          />

          <HorizontalResourceCard
            className="col-span-2 sm:col-span-3"
            resource={thirdCourse}
          />
          <HorizontalResourceCard
            className="col-span-2 sm:col-span-3"
            resource={fourthCourse}
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
          'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1633545274/next.egghead.io/resources/accessible-cross-browser-css-form-styling-7297/feature-card-background--css-form-styling.png',
        byline: 'Stephanie Eckles・1h 52m・Course',
        description:
          'Confidently build out accessibility-focused form design systems that works in all browsers.',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/425/628/full/EGH_accessible-css.png',
        instructor: {
          name: 'Stephanie Eckles',
        },
        path: '/courses/accessible-cross-browser-css-form-styling-7297',
        title: 'Accessible Cross-Browser CSS Form Styling',
      },
      {
        background: null,
        byline: 'Stephanie Eckles・20m・Course',
        description:
          'Learn how to progressively style a responsive landing page template while building your knowledge on when to select grid or flexbox for any layout scenario.',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/371/940/full/css-grid-flexbox.png',
        instructor: {
          name: 'Stephanie Eckles',
        },
        path: '/courses/create-a-landing-page-with-css-grid-and-flexbox-6048',
        title: 'Create a Landing Page with CSS Grid and Flexbox',
      },
      {
        background: null,
        byline: 'Stephanie Eckles・19m・Course',
        description: 'Build a blog with 11ty and style with Sass.',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/001/284/full/11ty.png',
        instructor: {
          name: 'Stephanie Eckles',
        },
        path: '/courses/build-an-eleventy-11ty-site-from-scratch-bfd3',
        title: 'Build An Eleventy (11ty) Site From Scratch',
      },
      {
        background: null,
        byline: 'Stephanie Eckles・27m・Course',
        description:
          'Techniques to improve your CSS, Sass, and HTML implementations for everyday scenarios.',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/175/full/csslang.png',
        instructor: {
          name: 'Stephanie Eckles',
        },
        path: '/courses/learn-the-fundamentals-of-css-and-sass-to-create-modern-and-responsive-layouts-f341',
        title:
          'Learn the Fundamentals of CSS and Sass to Create Modern and Responsive Layouts ',
      },
    ],
  },
  projects: {
    resources: [
      {
        description:
          'A video series with enhanced transcripts to help beginners learn the essentials of HTML and CSS.',
        image:
          'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1619633972/next.egghead.io/pages/instructors/stephanie-eckles/learnfromsteph.svg',
        path: 'https://learnfromsteph.dev/',
        title: 'learnfromsteph.dev',
      },
      {
        description:
          'A tutorial series exploring modern CSS solutions to old CSS problems.',
        image:
          'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1619633876/next.egghead.io/pages/instructors/stephanie-eckles/moderncss.svg',
        path: 'https://moderncss.dev/',
        title: 'moderncss.dev',
      },
      {
        description: 'A modern CSS showcase styled by community contributions',
        image:
          'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1619633876/next.egghead.io/pages/instructors/stephanie-eckles/stylestage.svg',
        path: 'https://stylestage.dev/',
        title: 'stylestage.dev',
      },
    ],
  },
} as Record<string, any>

const ProjectStack: FunctionComponent<React.PropsWithChildren<any>> = ({
  data,
  className,
}) => {
  return (
    <Card className={className}>
      <>
        <h3 className="uppercase font-semibold text-xs mb-1 text-gray-700 dark:text-gray-300">
          Stephanie's Projects
        </h3>
        <hr />
        <div className="h-full">
          <ul className="flex flex-col h-full ">
            {data.map((item: any) => {
              const {description, title, image, path} = item
              return (
                <li key={path} className="my-5">
                  {path && (
                    <Link
                      href={path}
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
                          <h3 className="text-lg font-bold leading-tighter hover:text-blue-600 dark:hover:text-blue-300 mb-1">
                            {title}
                          </h3>
                          <p className=" text-sm leading-tight max-w-none">
                            {description}
                          </p>
                        </div>
                      </div>
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

const CssFormStyling: React.FC<
  React.PropsWithChildren<{location: string; resource: any}>
> = ({location, resource}) => {
  const {path, title, byline, description, image, background} = resource
  return (
    <ExternalTrackedLink
      eventName="clicked Stephanie Eckles instructor page CTA"
      params={{location}}
      className="block md:col-span-4 w-full h-full overflow-hidden border-0 border-gray-100 relative text-center"
      href={path}
    >
      <div className="md:min-h-[477px] md:-mt-5 flex items-center justify-center bg-white dark:bg-gray-900 text-white overflow-hidden rounded-b-lg md:rounded-t-none rounded-t-lg shadow-sm">
        {/* <div className="absolute top-0 left-0 bg-gradient-to-r from-yellow-500 to-sky-500 w-full h-2 z-20" /> */}
        <div className="relative z-10 px-5 sm:py-16 py-10 sm:text-left text-center h-full">
          <div className="space-y-5 mx-auto flex items-center justify-center max-w-screen-xl">
            <div className="flex flex-col items-center justify-center sm:space-x-5 sm:space-y-0 space-y-5">
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
                <p className="text-xs text-white  uppercase font-semibold mb-2">
                  {byline}
                </p>
                <Link
                  href={path}
                  className="text-xl font-extrabold leading-tighter text-white hover:text-blue-300"
                  onClick={() =>
                    track('clicked jumbotron resource', {
                      resource: path,
                      linkType: 'text',
                    })
                  }
                >
                  <h2>{title}</h2>
                </Link>
                <p className="mt-4text-white">{description}</p>
              </div>
            </div>
          </div>
        </div>
        <img
          className="absolute top-0 left-0 z-0 h-full w-full"
          src={background}
          alt=""
        />
      </div>
    </ExternalTrackedLink>
  )
}
