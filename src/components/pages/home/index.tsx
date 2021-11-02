import React, {FunctionComponent} from 'react'
import {Card} from 'components/card'
import Link from 'next/link'
import Image from 'next/image'
import {map, get, find} from 'lodash'
import Markdown from 'react-markdown'
import {useViewer} from 'context/viewer-context'
import {loadUserProgress} from 'lib/users'
import {track} from 'utils/analytics'
import axios from 'utils/configured-axios'
import {HorizontalResourceCard} from 'components/card/horizontal-resource-card'
import Jumbotron from 'components/pages/home/jumbotron'
import {CardResource} from 'types'
import {VerticalResourceCard} from '../../card/verticle-resource-card'
import ExternalTrackedLink from 'components/external-tracked-link'

const Home: FunctionComponent<any> = ({homePageData}) => {
  const location = 'home landing'
  const {viewer, loading} = useViewer()
  const [progress, setProgress] = React.useState<any>([])

  const topics: any = get(homePageData, 'topics')

  const findFeature = (featureName: string) => {
    return find(homePageData?.homePageFeatures?.features, [
      'slug.current',
      featureName,
    ])
  }

  const featureDigitalGardening: any = get(
    homePageData,
    'featureDigitalGardening',
  )
  const featureWhatsNew: any = get(homePageData, 'featureWhatsNew')

  const reactFeatures = findFeature('react-features')
  const kcdFeatures = findFeature('kent-c-dodds-features')
  const javascriptFeatures = findFeature('javascript-features')
  const cssFeatures = findFeature('css-features')
  const reduxFeatures = findFeature('redux-features')
  const typescriptFeatures = findFeature('typescript-features')
  const awsFeatures = findFeature('aws-features')

  React.useEffect(() => {
    if (viewer) {
      const loadProgressForUser = async (user_id: number) => {
        if (user_id) {
          const response = await loadUserProgress(user_id)
          if (response?.data) setProgress(response.data)
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
          <FeatureRow resource={reactFeatures} />
        </section>

        <section className="mt-20 sm:mt-24">
          <InstructorFeatureRow resource={kcdFeatures} />
        </section>

        <section className="mt-20 sm:mt-24">
          <FeatureRow resource={javascriptFeatures} />
        </section>

        <section className="mt-20 sm:mt-24">
          <div className="flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-50 overflow-hidden rounded-lg shadow-sm">
            <div className="px-5 sm:py-16 py-10 sm:text-left text-center">
              <div className="space-y-5 mx-auto flex items-center justify-center lg:px-8 w-full">
                <div className="w-full">
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
          <FeatureRow resource={awsFeatures} />
        </section>

        <section className="mt-20 sm:mt-24">
          <FeatureRow resource={cssFeatures} />
        </section>

        <section className="mt-20 sm:mt-24">
          <FeatureRow resource={reduxFeatures} />
        </section>

        <section className="mt-20 sm:mt-24">
          <FeatureRow resource={typescriptFeatures} />
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

const WhatsNew: FunctionComponent<any> = ({resource, location = 'home'}) => {
  const {primary, secondary} = resource
  const [jumbotron, secondPrimary, thirdPrimary] = primary.resources
  const [
    firstSecondaryResource,
    secondSecondaryResource,
    thirdSecondaryResource,
  ] = secondary.resources

  return (
    <section className="sm:-my-5 -my-3 mx-auto max-w-screen-xl">
      <h2 className="md:text-xl text-lg sm:font-semibold font-bold mb-3 dark:text-white">
        What's New
      </h2>
      <Jumbotron resource={jumbotron} textColor="text-green-400" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        <div className="h-full grid gap-4">
          <HorizontalResourceCard
            className="w-full"
            resource={secondPrimary}
            location={location}
          />
          <HorizontalResourceCard
            className="w-full"
            resource={thirdPrimary}
            location={location}
          />
        </div>
        <div className="grid gap-4">
          <HorizontalResourceCard
            className="h-auto flex"
            resource={firstSecondaryResource}
            location={location}
          />
          <HorizontalResourceCard
            className="w-full flex"
            resource={secondSecondaryResource}
            location={location}
          />
          <HorizontalResourceCard
            className="w-full flex"
            resource={thirdSecondaryResource}
            location={location}
          />
        </div>
      </div>
    </section>
  )
}

const FeatureRow: FunctionComponent<any> = ({
  resource,
  location = 'home',
}: {
  resource: CardResource
  location: string
}) => {
  if (!resource) return null

  return (
    <section className="sm:-my-5 -my-3 mx-auto max-w-screen-xl">
      <div className="flex mb-4 items-center">
        <h2 className="flex-1 md:text-xl text-lg font-bold dark:text-white">
          {resource.subTitle}
        </h2>

        {resource.path && (
          <Link href={resource.path}>
            <a
              className="text-base font-medium transition ease-in-out duration-150 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 py-2 px-3 text-blue-500"
              onClick={() => {
                track('clicked resource', {
                  resource: resource.path,
                  location,
                })
              }}
            >
              Browse more {resource.name && resource.name} →
            </a>
          </Link>
        )}
      </div>

      {resource.resources && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 grid-cols-1 gap-4">
          {map(resource.resources, (resource) => {
            return (
              <VerticalResourceCard
                className="col-span-3 sm:col-span-1 text-center shadow-sm"
                key={resource.path}
                resource={resource}
                location={location}
              />
            )
          })}
        </div>
      )}

      {resource.related && (
        <div className="grid lg:grid-cols-2 grid-cols-1 gap-4 mt-4">
          {map(resource.related, (resource) => {
            return (
              <HorizontalResourceCard
                key={resource.path}
                resource={resource}
                location={location}
                className="m-0"
              />
            )
          })}
        </div>
      )}
    </section>
  )
}

const InstructorFeatureRow: FunctionComponent<any> = ({
  resource,
  location = 'home',
}) => {
  if (!resource) return null

  return (
    <section className="sm:-my-5 -my-3 mx-auto max-w-screen-xl">
      <div className="flex mb-4 items-center">
        <h2 className="flex-1 md:text-xl text-lg font-bold dark:text-white">
          {resource.subTitle}
        </h2>

        {resource.path && (
          <Link href={resource.path}>
            <a
              className="text-base font-medium transition ease-in-out duration-150 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 py-2 px-3 text-blue-500"
              onClick={() => {
                track('clicked resource', {
                  resource: resource.path,
                  location,
                })
              }}
            >
              Browse more {resource.name && resource.name} →
            </a>
          </Link>
        )}
      </div>

      {resource.resources && (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 grid-cols-1 gap-4">
          {map(resource.resources, (resource) => {
            return (
              <VerticalResourceCard
                className="col-span-3 sm:col-span-1 text-center shadow-sm"
                key={resource.path}
                resource={resource}
                location={location}
              />
            )
          })}

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
      )}

      {resource.related && (
        <div className="grid lg:grid-cols-2 grid-cols-1 gap-4 mt-4">
          {map(resource.related, (resource) => {
            return (
              <HorizontalResourceCard
                key={resource.path}
                resource={resource}
                location={location}
                className="m-0"
              />
            )
          })}
        </div>
      )}
    </section>
  )
}

export default Home
