import React from 'react'
import {get} from 'lodash'
import SearchCuratedEssential, {ThreeLevels} from '../curated-essential'
import {CardResource} from 'types'
import {VerticalResourceCard} from 'components/card/verticle-resource-card'
import groq from 'groq'

const SearchNext = ({topic}: any) => {
  console.log('test: ', topic)
  const location = 'next landing'

  const introCollection = get(topic, 'introCourses')
  const featuredTalksArticles = get(topic, 'featuredTalksArticles')
  const advancedConcepts = get(topic, 'advancedConcepts')
  const portfolioProjects = get(topic, 'portfolioProjects')

  if (!portfolioProjects)
    return (
      <div>
        <SearchCuratedEssential
          topic={{
            label: 'Next.js',
            name: 'next',
            description: `Next.js gives you the best developer experience with all the features you need for production: hybrid static & server rendering, TypeScript support, smart bundling, route pre-fetching, and more. No config needed.`,
          }}
          CTAComponent={EcommerceCTA}
        />
      </div>
    )

  return (
    <div>
      <SearchCuratedEssential
        topic={{
          label: 'Next.js',
          name: 'next',
          description: `Next.js gives you the best developer experience with all the features you need for production: hybrid static & server rendering, TypeScript support, smart bundling, route pre-fetching, and more. No config needed.`,
        }}
        CTAComponent={EcommerceCTA}
      />
      <div>
        <ThreeLevels
          beginner={introCollection}
          intermediate={featuredTalksArticles}
          advanced={advancedConcepts}
          location={location}
        />
      </div>
      <section className="md:mt-5 mt-5 grid gap-5 md:bg-gray-100 md:dark:bg-gray-700 rounded-lg md:p-5 relative">
        <div className="lg:col-span-8 col-span-12 space-y-5 flex flex-col">
          <header className="py-5 md:px-8 px-5 rounded-md flex md:flex-row flex-col md:text-left text-center md:space-y-0 space-y-3 md:items-start items-center justify-center md:space-x-5 space-x-0">
            <div className="flex-shrink-0"></div>
            <div className="max-w-screen-sm space-y-3">
              <h1 className="md:text-3xl text-2xl dark:text-gray-200 font-bold leading-tight text-center">
                Building Your Portfolio!
              </h1>
              <div className="leading-relaxed text-gray-700 dark:text-gray-50 space-y-3">
                <p>
                  Learn to create your own Next.js project from start to finish!
                  These three courses will take you from initializing your app
                  to creating your own store with an amazing user interface!
                </p>
              </div>
            </div>
          </header>
          <div className="flex flex-col flex-grow">
            <div className="grid lg:grid-cols-12 grid-cols-1 gap-5 mt-5 flex-grow">
              {portfolioProjects.resources.map((resource: any) => {
                return (
                  <VerticalResourceCard
                    className="col-span-4 text-center flex flex-col items-center justify-center"
                    key={resource.path}
                    resource={resource}
                    location={location}
                  />
                )
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

const EcommerceCTA: React.FC<{location: string}> = ({location}) => {
  const resource: CardResource = {
    slug: 'create-an-ecommerce-store-with-next-js-and-stripe-checkout',
    id: 'portfolioProject',
    name: 'Portfolio Project',
    title: 'Create an eCommerce Store with Next.js and Stripe Checkout',
    path: '/projects/create-an-ecommerce-store-with-next-js-and-stripe-checkout',
    image:
      'https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/412/781/square_480/ecommerce-stripe-next.png',
    byline: 'Colby Fayock',
    description:
      'Build a modern eCommerce store with the best-in-class tools available to web developers to add to your portfolio.',
  }
  return (
    <VerticalResourceCard
      className="md:col-span-4 text-center"
      key={resource.path}
      resource={resource}
      location={location}
    />
  )
}

export const nextPageQuery = groq`
*[_type == 'resource' && slug.current == 'next-js-landing-page'][0]{
  title,
  'introCourses': resources[slug.current == 'intro-to-next-js'][0] {
    title,
    description,
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
	'advancedConcepts': resources[slug.current == 'advanced-concepts'][0] {
    title,
    description,
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
	'featuredTalksArticles': resources[slug.current == 'featured-talks-articles'][0] {
    title,
    resources[]{
      'name': type,
      title,
      path,
      byline,
      image,
    }
	},
	'portfolioProjects': resources[slug.current == 'portfolio-projects'][0] {
    title,
    description,
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
 }
`

export default SearchNext
