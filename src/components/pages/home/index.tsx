import React, {FunctionComponent} from 'react'
import {Card} from 'components/card'
import Link from 'next/link'
import Image from 'next/image'
import {map, get, isEmpty} from 'lodash'

import Markdown from 'react-markdown'
import {useViewer} from 'context/viewer-context'
import useEggheadSchedule, {ScheduleEvent} from 'hooks/use-egghead-schedule'
import {loadUserProgress} from 'lib/users'
import {track} from 'utils/analytics'
import axios from 'utils/configured-axios'
import VideoCard from 'components/pages/home/video-card'
import WhatsNew from 'pages/new'
import {HorizontalResourceCard} from 'components/card/horizontal-resource-card'

import {CardResource} from 'types'
import {VerticalResourceCard} from '../../card/verticle-resource-card'
import {VerticalResourceCollectionCard} from '../../card/vertical-resource-collection-card'
import ExternalTrackedLink from 'components/external-tracked-link'

const Home: FunctionComponent<any> = ({homePageData}) => {
  const location = 'home landing'
  const {viewer, loading} = useViewer()
  const [progress, setProgress] = React.useState<any>([])

  const video: any = get(homePageData, 'video')
  let featured: any = get(homePageData, 'featured.resources', {})
  const devEssentials: any = get(homePageData, 'devEssentials')
  const freeCourses: any = get(homePageData, 'freeCourses')
  const getStarted: any = get(homePageData, 'getStarted')
  const aws: any = get(homePageData, 'aws')
  const wordpressWithGraphql: any = get(homePageData, 'cms')
  const portfolioProjectOne: any = get(homePageData, 'portfolioProjectOne')
  const typescriptFeature: any = get(homePageData, 'typescriptFeature')
  const reactFeature: any = get(homePageData, 'reactFeature')
  const topics: any = get(homePageData, 'topics')
  const portfolioProjectTwo: any = get(homePageData, 'portfolioProjectTwo')
  const featureDigitalGardening: any = get(
    homePageData,
    'featureDigitalGardening',
  )

  const featureWhatsNew: any = get(homePageData, 'featureWhatsNew')
  const concurrentReactTalk: any = get(
    homePageData,
    'react-concurrent-react-from-scratch',
  )
  const reactMetaphorTalk: any = get(
    homePageData,
    'drawing-the-invisible-react-explained-in-five-visual-metaphors',
  )

  React.useEffect(() => {
    if (viewer) {
      const loadProgressForUser = async (user_id: number) => {
        if (user_id) {
          const {data} = await loadUserProgress(user_id)
          setProgress(data)
        }
      }

      loadProgressForUser(viewer.id)
    }
  }, [viewer?.id])

  return (
    <>
      <div className="mt-8">
        <WhatsNew resource={featureWhatsNew} />

        <section className="mt-32">
          <h2 className="md:text-xl text-lg sm:font-semibold font-bold mb-3 dark:text-white text-center">
            Browse Curated Developer Resources on the Best Tools
          </h2>
          <TopicsList topics={topics} />
        </section>

        <section className="mt-20 sm:mt-24">
          <h2 className="text-xl sm:font-semibold font-bold mb-3 dark:text-white">
            egghead Talks and Events
          </h2>
          <div className="">
            <div className="grid lg:grid-cols-8 grid-cols-1 col-span-8 gap-4">
              <VideoCard className="lg:col-span-6" resource={video} />
              <EventSchedule />
            </div>
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
              <HorizontalResourceCard
                resource={concurrentReactTalk}
                location={location}
                className="m-0 mt-4"
              />
              <HorizontalResourceCard
                resource={reactMetaphorTalk}
                location={location}
                className="m-0 lg:mt-4"
              />
            </div>
          </div>
        </section>

        <section className="mt-20 sm:mt-24">
          <h2 className="text-xl sm:font-semibold font-bold mb-3 dark:text-white">
            Popular Courses & Topics
          </h2>
          <div className="grid lg:grid-cols-2 grid-cols-1 space-y-3 lg:space-y-0 gap-4">
            <VerticalResourceCollectionCard
              className="sm:py-8 py-6"
              resource={getStarted}
              location={location}
            />
            <VerticalResourceCollectionCard
              resource={devEssentials}
              location={location}
              className="text-left"
            />
          </div>
        </section>

        <section className="mt-20 sm:mt-24">
          <h2 className="text-xl sm:font-semibold font-bold mb-3 dark:text-white">
            Staff Picks and Favorites
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 grid-cols-1 gap-4">
            {map(featured, (resource) => {
              return (
                <VerticalResourceCard
                  key={resource.path}
                  resource={resource}
                  location={location}
                  className="text-center"
                />
              )
            })}
          </div>
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
            <HorizontalResourceCard
              resource={reactFeature}
              location={location}
            />
            <HorizontalResourceCard
              resource={typescriptFeature}
              location={location}
            />
          </div>
        </section>

        <section className="mt-20 sm:mt-24">
          <div className="flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-50 overflow-hidden rounded-lg shadow-sm">
            <div className="px-5 sm:py-16 py-10 sm:text-left text-center">
              <div className="space-y-5 mx-auto flex items-center justify-center lg:px-8 w-full">
                <div className="w-full xl:pr-16">
                  <div className="grid sm:grid-cols-3 grid-cols-1 gap-5 mb-5">
                    <div className="sm:col-span-1 flex-shrink-0 text-center mb-4">
                      <Link href={featureDigitalGardening.path}>
                        <a
                          tabIndex={-1}
                          onClick={() => {
                            track('clicked resource', {
                              resource: featureDigitalGardening.path,
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
                            alt={featureDigitalGardening.title}
                          />
                        </a>
                      </Link>
                    </div>
                    <div className="sm:col-span-2 flex flex-col sm:items-start items-center w-full">
                      <h3 className="text-xs text-green-600 dark:text-green-300 uppercase font-semibold mb-2">
                        Learn in public with a digital garden
                      </h3>
                      <Link href={featureDigitalGardening.path}>
                        <a
                          className="font-bold hover:text-blue-600 dark:hover:text-blue-300 transition ease-in-out"
                          onClick={() => {
                            track('clicked resource', {
                              resource: featureDigitalGardening.path,
                              location,
                            })
                          }}
                        >
                          <h2 className="sm:text-2xl md:text-4xl text-xl max-w-screen-lg font-extrabold leading-tighter">
                            {featureDigitalGardening.title}
                          </h2>
                        </a>
                      </Link>
                      <div>
                        <Markdown className="prose dark:prose-dark dark:prose-sm-dark mt-4">
                          {featureDigitalGardening.description}
                        </Markdown>
                        <Markdown className="prose dark:prose-dark dark:prose-sm-dark mt-4 font-medium">
                          {featureDigitalGardening.quote.description}
                        </Markdown>
                      </div>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-3 grid-cols-1 gap-5 mt-12">
                    {featureDigitalGardening.featured.courses.map(
                      (resource: any) => {
                        return (
                          <VerticalResourceCard
                            className="col-span-3 sm:col-span-1 text-center shadow"
                            key={resource.path}
                            resource={resource}
                            location={location}
                          />
                        )
                      },
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-20 sm:mt-24">
          <h2 className="text-xl sm:font-semibold font-bold mb-3 dark:text-white">
            Build a New Portfolio Project
          </h2>
          <div className="grid lg:grid-cols-3 grid-cols-1 gap-4">
            <VerticalResourceCard
              resource={portfolioProjectOne}
              location={location}
              className="text-center"
            />
            <VerticalResourceCard
              resource={portfolioProjectTwo}
              location={location}
              className="text-center"
            />
            <VerticalResourceCard
              resource={wordpressWithGraphql}
              location={location}
              className="text-center"
            />
          </div>
        </section>

        <section className="mt-20 sm:mt-24">
          <h2 className="text-xl sm:font-semibold font-bold mb-3 dark:text-white">
            Learn React with Kent
          </h2>
          <div className="grid lg:grid-cols-4 grid-cols-1 gap-4">
            {get(homePageData, 'learnWithKent').map((i: any) => (
              <VerticalResourceCard
                key={i.path}
                resource={i}
                location={location}
                className="text-center"
              />
            ))}
            <ExternalTrackedLink
              eventName="clicked epic react banner"
              params={{location}}
              href="https://epicreact.dev"
              target="_blank"
              rel="noopener"
              className="block"
            >
              <div className="overflow-hidden flex items-center justify-center rounded-lg">
                <Image
                  src="https://res.cloudinary.com/dg3gyk0gu/image/upload/v1626109728/epic-react/default-banners/banner-home_2x.jpg"
                  // 25% off
                  // src="https://res.cloudinary.com/dg3gyk0gu/image/upload/v1625229239/epic-react/summer-sale-2021/banner-home_2x.jpg"
                  alt="Get Really Good at React on EpicReact.dev by Kent C. Dodds"
                  width={704}
                  height={836}
                  quality={100}
                  className="rounded-lg hover:scale-[102%] ease-in-out duration-500"
                />
              </div>
            </ExternalTrackedLink>
          </div>
        </section>

        <section className="mt-20 sm:mt-24">
          <div className="grid lg:grid-cols-2 grid-cols 1 gap-4">
            <VerticalResourceCollectionCard
              resource={aws}
              location={location}
            />
            <VerticalResourceCollectionCard
              resource={freeCourses}
              location={location}
            />
          </div>
        </section>
      </div>
    </>
  )
}

const TopicsList: React.FunctionComponent<{topics: CardResource}> = ({
  topics,
}) => {
  const allTopics = get(topics, 'resources', [])
  return (
    <>
      <div className="w-full">
        <ul
          className={`grid sm:grid-cols-4 md:grid-cols-8 grid-cols-2 sm:gap-5 md:gap-3 lg:gap-6 gap-4`}
        >
          {map(allTopics, (resource) => (
            <li key={resource.path}>
              <Link href={resource.path}>
                <a
                  onClick={() => {
                    track('clicked home page topic', {
                      topic: resource.title,
                    })
                    axios.post(`/api/topic`, {
                      topic: resource.slug,
                      amount: 1,
                    })
                  }}
                  className="w-full scale-100 hover:scale-105 transition-all ease-in-out duration-150 rounded-md py-2 px-3 space-x-1 text-base dark:text-white tracking-tight font-bold leading-tight flex items-center hover:text-blue-600"
                >
                  <div className="w-full flex flex-col items-center justify-center px-3 py-8 space-y-4">
                    {resource.image && (
                      <div className="flex items-center">
                        <Image
                          src={get(resource.image, 'src', resource.image)}
                          width={64}
                          height={64}
                          alt={`${resource.title} logo`}
                        />
                      </div>
                    )}
                    <div className="sm:text-base md:text-sm lg:text-base">
                      {resource.title}
                    </div>
                  </div>
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

const EventSchedule: React.FunctionComponent = () => {
  const [schedule, scheduleLoading] = useEggheadSchedule(3)
  return (
    <Card className="lg:col-span-2 relative bg-gradient-to-br from-blue-600 via-blue-600 to-indigo-600 text-white ">
      <>
        <h2 className="uppercase font-semibold text-xs text-blue-200">
          Upcoming Events
        </h2>
        {!isEmpty(schedule) ? (
          <ul className="mt-4 leading-tight space-y-3 relative z-10">
            {map(schedule, (resource: ScheduleEvent) => (
              <li className="w-full" key={resource.informationUrl}>
                <div className="font-semibold">
                  <div>
                    {resource.informationUrl ? (
                      <Link href={resource.informationUrl}>
                        <a
                          onClick={() => {
                            track('clicked event', {
                              event: resource.title,
                            })
                          }}
                          className="hover:underline"
                        >
                          {resource.title}
                        </a>
                      </Link>
                    ) : (
                      resource.title
                    )}
                  </div>
                </div>
                <div className="w-full flex items-center mt-1">
                  {resource.subtitle && (
                    <time className="mr-1 tabular-nums text-xs">
                      {resource.subtitle}
                    </time>
                  )}
                  {resource.calendarUrl && (
                    <Link href={resource.calendarUrl}>
                      <a
                        onClick={() => {
                          track('clicked event calendar', {
                            event: resource.title,
                          })
                        }}
                        className="inline-flex rounded-md items-center font-semibold p-1 text-xs bg-blue-700 hover:bg-blue-800 text-white duration-150 transition-colors ease-in-out"
                      >
                        {/* prettier-ignore */}
                        <svg className="inline-flex" width="14" height="14" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><g fill="none"><path d="M10 2a6 6 0 0 0-6 6v3.586l-.707.707A1 1 0 0 0 4 14h12a1 1 0 0 0 .707-1.707L16 11.586V8a6 6 0 0 0-6-6z" fill="currentColor" /><path d="M10 18a3 3 0 0 1-3-3h6a3 3 0 0 1-3 3z" fill="currentColor" /></g></svg>
                      </a>
                    </Link>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <ul className="mt-4 leading-tight space-y-3 relative z-10">
            <li className="w-full">
              <div className="font-semibold">
                {scheduleLoading ? `` : `Nothing is scheduled at this time!`}
              </div>
            </li>
          </ul>
        )}
        <div
          className="absolute top-0 left-0 w-full h-full sm:opacity-25 opacity-25 pointer-events-none z-0"
          css={{
            backgroundImage:
              'url(https://res.cloudinary.com/dg3gyk0gu/image/upload/v1606467202/next.egghead.io/eggodex/playful-eggo_2x.png)',
            backgroundSize: 200,
            backgroundPosition: 'bottom 5px right -5px',
            backgroundRepeat: 'no-repeat',
          }}
        />
      </>
    </Card>
  )
}

export default Home
