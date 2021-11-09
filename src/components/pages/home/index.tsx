import React, {FunctionComponent} from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {map, get, find} from 'lodash'
import Markdown from 'react-markdown'
import {track} from 'utils/analytics'
import axios from 'utils/configured-axios'
import {HorizontalResourceCard} from 'components/card/horizontal-resource-card'
import Jumbotron from 'components/pages/home/jumbotron'
import {CardResource} from 'types'
import {VerticalResourceCard} from '../../card/verticle-resource-card'
import ExternalTrackedLink from 'components/external-tracked-link'

const Home: FunctionComponent<any> = ({homePageData}) => {
  const location = 'home landing'

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

  return (
    <div className="space-y-20 sm:space-y-24">
      <WhatsNew resource={featureWhatsNew} />

      <section>
        <h2 className="mb-3 text-lg font-bold text-center md:text-xl sm:font-semibold dark:text-white">
          Browse Curated Developer Resources on the Best Tools
        </h2>
        <TopicsList topics={topics} />
      </section>

      <section>
        <FeatureRow resource={reactFeatures} />
      </section>

      <section>
        <InstructorFeatureRow resource={kcdFeatures} />
      </section>

      <section>
        <FeatureRow resource={javascriptFeatures} />
      </section>

      <section>
        <div className="flex items-center justify-center overflow-hidden text-gray-700 bg-gray-100 rounded-lg shadow-sm dark:bg-gray-700 dark:text-gray-50">
          <div className="px-5 py-10 text-center sm:py-16 sm:text-left">
            <div className="flex items-center justify-center w-full mx-auto space-y-5 lg:px-8">
              <div className="w-full">
                <div className="grid grid-cols-1 gap-5 mb-5 sm:grid-cols-3">
                  <div className="flex-shrink-0 mb-4 text-center sm:col-span-1">
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
                  <div className="flex flex-col items-center w-full sm:col-span-2 sm:items-start">
                    <h3 className="mb-2 text-xs font-semibold text-green-600 uppercase dark:text-green-300">
                      Learn in public with a digital garden
                    </h3>
                    <Link href={featureDigitalGardening.path}>
                      <a
                        className="font-bold transition ease-in-out hover:text-blue-600 dark:hover:text-blue-300"
                        onClick={() => {
                          track('clicked resource', {
                            resource: featureDigitalGardening.path,
                            location,
                          })
                        }}
                      >
                        <h2 className="max-w-screen-lg text-xl font-extrabold sm:text-2xl md:text-4xl leading-tighter">
                          {featureDigitalGardening.title}
                        </h2>
                      </a>
                    </Link>
                    <div>
                      <Markdown className="mt-4 prose dark:prose-dark dark:prose-sm-dark">
                        {featureDigitalGardening.description}
                      </Markdown>
                      <Markdown className="mt-4 font-medium prose dark:prose-dark dark:prose-sm-dark">
                        {featureDigitalGardening.quote.description}
                      </Markdown>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-5 mt-12 md:grid-cols-3">
                  {featureDigitalGardening.featured.courses.map(
                    (resource: any) => {
                      return (
                        <VerticalResourceCard
                          className="col-span-3 text-center shadow sm:col-span-1"
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

      <section>
        <FeatureRow resource={awsFeatures} />
      </section>

      <section>
        <FeatureRow resource={cssFeatures} />
      </section>

      <section>
        <FeatureRow resource={reduxFeatures} />
      </section>

      <section>
        <FeatureRow resource={typescriptFeatures} />
      </section>
    </div>
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
                  className="flex items-center w-full px-3 py-2 space-x-1 text-base font-bold leading-tight tracking-tight transition-all duration-150 ease-in-out scale-100 rounded-md hover:scale-105 dark:text-white hover:text-blue-600"
                >
                  <div className="flex flex-col items-center justify-center w-full px-3 py-8 space-y-4">
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
    <section>
      <h2 className="mb-3 text-lg font-bold md:text-xl sm:font-semibold dark:text-white">
        What's New
      </h2>
      <Jumbotron resource={jumbotron} textColor="text-green-400" />
      <div className="grid grid-cols-1 gap-4 mt-4 lg:grid-cols-2">
        <div className="grid h-full gap-4">
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
            className="flex h-auto"
            resource={firstSecondaryResource}
            location={location}
          />
          <HorizontalResourceCard
            className="flex w-full"
            resource={secondSecondaryResource}
            location={location}
          />
          <HorizontalResourceCard
            className="flex w-full"
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
    <section>
      <div className="flex items-center mb-4">
        <h2 className="flex-1 text-lg font-bold md:text-xl dark:text-white">
          {resource.subTitle}
        </h2>

        {resource.path && (
          <Link href={resource.path}>
            <a
              className="px-3 py-2 text-base font-medium text-blue-500 transition duration-150 ease-in-out rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800"
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
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {map(resource.resources, (resource) => {
            return (
              <VerticalResourceCard
                className="col-span-3 text-center shadow-sm sm:col-span-1"
                key={resource.path}
                resource={resource}
                location={location}
              />
            )
          })}
        </div>
      )}

      {resource.related && (
        <div className="grid grid-cols-1 gap-4 mt-4 lg:grid-cols-2">
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
    <section>
      <div className="flex items-center mb-4">
        <h2 className="flex-1 text-lg font-bold md:text-xl dark:text-white">
          {resource.subTitle}
        </h2>

        {resource.path && (
          <Link href={resource.path}>
            <a
              className="px-3 py-2 text-base font-medium text-blue-500 transition duration-150 ease-in-out rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800"
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
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {map(resource.resources, (resource) => {
            return (
              <VerticalResourceCard
                className="col-span-3 text-center shadow-sm sm:col-span-1"
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
            <div className="flex items-center justify-center overflow-hidden rounded-lg">
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
        <div className="grid grid-cols-1 gap-4 mt-4 lg:grid-cols-2">
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
