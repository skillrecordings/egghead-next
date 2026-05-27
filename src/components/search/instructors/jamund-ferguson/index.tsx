import Link from 'next/link'
import Image from 'next/legacy/image'
import Markdown from '@/components/markdown'

import {track} from '@/utils/analytics'

import SearchInstructorEssential from '../instructor-essential'
import {CardResource} from '@/types'
import CtaCard from '@/components/search/components/cta-card'
import {VerticalResourceCard} from '@/components/card/verticle-resource-card'
import {HorizontalResourceCard} from '@/components/card/horizontal-resource-card'

export default function SearchJamundFerguson({instructor}: {instructor: any}) {
  instructor = {...instructor, ...curatedInstructorData}
  let {reduxFeature, featuredCourses} = instructor

  if (!reduxFeature || !featuredCourses) {
    return (
      <div className="max-w-screen-xl mx-auto">
        <SearchInstructorEssential instructor={instructor} />
      </div>
    )
  }

  let [primaryCourse, ...restCourses] = featuredCourses.resources
  return (
    <div className="mx-auto max-w-screen-xl">
      <SearchInstructorEssential
        instructor={instructor}
        CTAComponent={
          <CtaCard
            resource={primaryCourse}
            trackTitle="clicked instructor landing page CTA resource"
            textLight
            location="Jamund Ferguson instructor page"
          />
        }
      />

      <FeatureSection
        resource={reduxFeature}
        location="Jamund Ferguson instructor page"
      />

      <section className="xl:px-0 px-5 mt-20">
        <h2 className="text-xl sm:font-semibold font-bold mb-3 dark:text-white text-center">
          More from Jamund
        </h2>
        <div className="flex sm:flex-nowrap flex-wrap justify-center gap-4 mt-4">
          {restCourses.map((course: CardResource) => {
            return (
              <HorizontalResourceCard
                key={course.id}
                className="mt-0 sm:w-1/2 w-full flex flex-col items-center justify-center text-center sm:py-8 py-6"
                resource={course}
                describe
                location="Kyle Shevlin instructor Landing page"
              />
            )
          })}
        </div>
      </section>
    </div>
  )
}

type FeatureSectionType = {
  resource: {
    title: string
    description: string
    path?: string
    byline: string
    image: string
    resources: CardResource[]
  }
  location: string
}

const FeatureSection = ({resource, location}: FeatureSectionType) => {
  return (
    <section className="sm:mt-5 xl:px-0 px-5">
      <div className="flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-50 overflow-hidden rounded-lg shadow-sm">
        <div className="px-5 sm:py-16 py-10 sm:text-left text-center">
          <div className="space-y-5 mx-auto flex items-center justify-center lg:px-8 w-full">
            <div className="w-full">
              <div className="grid sm:grid-cols-3 grid-cols-1 gap-5 mb-5">
                <div className="sm:col-span-1 flex-shrink-0 text-center mb-4">
                  {resource.path ? (
                    <Link
                      href={resource.path}
                      tabIndex={-1}
                      onClick={() => {
                        track('clicked resource', {
                          resource: resource.path,
                          location,
                        })
                      }}
                    >
                      <Image
                        quality={100}
                        src={
                          'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1617475003/egghead-next-pages/home-page/eggo-gardening.png'
                        }
                        width={250}
                        height={305}
                        alt={resource.title}
                      />
                    </Link>
                  ) : (
                    <Image
                      quality={100}
                      src={resource.image}
                      width={305}
                      height={305}
                      alt={resource.title}
                    />
                  )}
                </div>
                <div className="sm:col-span-2 flex flex-col sm:items-start items-center w-full">
                  {resource.byline && (
                    <h3 className="text-xs text-gray-700 dark:text-gray-300 uppercase font-semibold mb-2">
                      {resource.byline}
                    </h3>
                  )}
                  {resource.path ? (
                    <Link
                      href={resource.path}
                      className="font-bold hover:text-blue-300 dark:hover:text-blue-300 transition ease-in-out"
                      onClick={() => {
                        track('clicked resource', {
                          resource: resource.path,
                          location,
                        })
                      }}
                    >
                      <h2 className="sm:text-2xl md:text-4xl text-xl max-w-screen-lg font-extrabold leading-tighter">
                        {resource.title}
                      </h2>
                    </Link>
                  ) : (
                    <h2 className="sm:text-2xl md:text-4xl text-xl max-w-screen-lg font-extrabold leading-tighter">
                      {resource.title}
                    </h2>
                  )}
                  <div>
                    <Markdown className="leading-relaxed text-gray-700 dark:text-gray-50 mt-4">
                      {resource.description}
                    </Markdown>
                  </div>
                </div>
              </div>
              <div className="grid md:grid-cols-3 grid-cols-1 gap-5 mt-12">
                {resource.resources.map((course: any) => {
                  return (
                    <VerticalResourceCard
                      className="col-span-3 sm:col-span-1 text-center shadow"
                      key={course.path}
                      resource={course}
                      location={location}
                    />
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

const curatedInstructorData = {
  featuredCourses: {
    resources: [
      {
        background:
          'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1629835497/egghead-next-pages/redux/feature-card-background--redux-rtk-typescript.png',
        byline: 'Jamund Ferguson • Course • 40m',
        description:
          'Learn how Redux Toolkit simplifies the process of setting up and maintaining your redux application when building slices, reducers, selectors, and thunks.',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/478/578/full/Redux_RTK-v2.png',
        instructor: {
          name: 'Jamund Ferguson',
        },
        path: '/courses/modern-redux-with-redux-toolkit-rtk-and-typescript-64f243c8',
        title: 'Modern Redux with Redux Toolkit (RTK) and TypeScript',
      },
      {
        background: null,
        byline: 'Jamund Ferguson • Course • 26m',
        description:
          "Learn common JavaScript patterns through implementing various lodash functions. You'll be prepared for your next technical job interview!",
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/205/full/javascriptlang.png',
        instructor: {
          name: 'Jamund Ferguson',
        },
        path: '/courses/recreating-popular-javascript-utility-methods-from-lodash-5653',
        title: 'Recreating Popular JavaScript Utility Methods from Lodash',
      },
      {
        background: null,
        byline: 'Jamund Ferguson • Course • 28m',
        description:
          'Learn how to build a simple REST API to store notes using the latest built-in node features including native ES modules, the fs/promises API, async/await, and more!',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/359/full/expressjslogo.png',
        instructor: {
          name: 'Jamund Ferguson',
        },
        path: '/courses/building-an-express-api-with-express-5-and-node-14-7b96',
        title: 'Build a REST API with Express 5 and node 14',
      },
    ],
  },
  reduxFeature: {
    description:
      "Redux was first released in 2015, since it's release it has had a staying force in the community as it continues to be one of the most popular libraries to manage application state. Having a single source of truth and ways to update it in a pure fashion makes Redux a great choice for managing your application as it grows.\n\nLearn what Redux looks like in the modern era with React hooks and Redux Toolkit.",
    image:
      'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/386/full/redux.png',
    resources: [
      {
        background:
          'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1629835497/egghead-next-pages/redux/feature-card-background--redux-rtk-typescript.png',
        byline: 'Jamund Ferguson • Course • 40m',
        description:
          'In this course we take a basic shopping cart application built with React and fully power it with Redux and RTK using TypeScript. For those of you familiar with Redux Hooks, we use those here, but the emphasis is more on how the Redux Toolkit simplifies the process of setting up your redux application including building slices, reducers, selectors and thunks. Everything we do in the course is typed with TypeScript to make your application development process as smooth and powerful as possible.',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/478/578/full/Redux_RTK-v2.png',
        instructor: {
          name: 'Jamund Ferguson',
        },
        path: '/courses/modern-redux-with-redux-toolkit-rtk-and-typescript-64f243c8',
        title: 'Modern Redux with Redux Toolkit (RTK) and TypeScript',
      },
      {
        background:
          'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1624459144/next.egghead.io/resources/redux-hooks/redux-hooks-feature-card-background.svg',
        byline: 'Jamund Ferguson • Course • 42m ',
        description:
          "Redux was [announced back in 2015](https://www.youtube.com/watch?v=xsSnOQynTHs) and immediately took off as the de-facto state management solution for React. As it gained widespread traction, it also became clear that in many cases it was brought into applications prematurely. The community in some ways started to push back on its use and recommended the built-in `setState` method as an alternative. Several other state libraries also started popping up around this time. Finally, as React Hooks were announced with a built-in `useReducer` method it appeared that Redux's time was up. However, these claims have proven to be premature. Redux is not dead and instead remains React's most popular state management library`*`.\n\nRecent updates to redux exposing a [hooks-based API](https://react-redux.js.org/api/hooks) address some of its most serious drawbacks and make it even more appealing. This course will show you how to apply redux to a modern react hooks application. I hope you leave this course with a continued appreciation for React Hooks and renewed enthusiasm for Redux.\n\nRedux is still a very popular and effective way of managing state in React. If you used Redux in the past and maybe found it too difficult to work with and too complicated, I don't think you'll feel that way after trying it with Hooks. \n\nThanks for watching 📺.\n\n- `*` Comparing [redux](https://www.npmjs.com/package/redux) with [mobx](https://www.npmjs.com/package/mobx),  [xstate](https://www.npmjs.com/package/xstate) and [flux](https://www.npmjs.com/package/flux)\n\n",
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/423/944/full/egh_redux-with-hooks.png',
        instructor: {
          name: 'Jamund Ferguson',
        },
        path: '/courses/apply-redux-to-a-modern-react-hooks-application-8a37',
        title: 'Apply Redux to a Modern React Hooks Application',
      },
      {
        background: null,
        byline: 'Jamund Ferguson • Course • 25m',
        description:
          "Many engineers working with redux have felt burdened by large amounts of boilerplate code and confusing indirection. These apps often rely on legacy patterns that are no longer recommended, but are still commonly found in production code bases. If you are are an engineer working on such an application, this course is for you. In it I will show you how to modernize your application, with react hooks, one component at a time. At the end of it, we'll still be using redux, but the structure and content of your code will be significantly improved.\n\nWe will cover migrating class components to functional components with [react hooks](https://reactjs.org/docs/hooks-reference.html) and how to replace `connect()` with [redux hooks](https://react-redux.js.org/api/hooks). This course will serve as a good tutorial for learning react hooks. It will also help you apply  modern patterns for using redux. These patterns, powered by the new [useSelector](https://react-redux.js.org/api/hooks#useselector) and [useDispatch](https://react-redux.js.org/api/hooks#usedispatch) hooks will transform your redux applications for the better.",
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/430/191/full/Redux_Lv1_Base.png',
        instructor: {
          name: 'Jamund Ferguson',
        },
        path: '/courses/modernizing-a-legacy-redux-application-with-react-hooks-c528',
        title: 'Modernizing a Legacy Redux Application with React Hooks',
      },
    ],
    title: 'Learn Redux for 2021 and Beyond',
  },
  title: 'Jamund Ferguson Instructor Landing Page',
} as Record<string, any>
