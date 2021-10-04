import React from 'react'
import {get} from 'lodash'
import SearchCuratedEssential from '../curated-essential'
import {CardResource} from 'types'
import {VerticalResourceCard} from 'components/card/verticle-resource-card'
import VideoCard from 'components/pages/home/video-card'
import groq from 'groq'

const SearchNext = ({topic}: any) => {
  const location = 'next landing'
  const featuredArticles = get(topic, 'featuredArticles')
  const featuredTalks = get(topic, 'featuredTalks')
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
      <div className="lg:col-span-8 col-span-12 space-y-5 flex flex-col">
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
      {featuredTalks.resources.map((resource: any) => {
        return (
          <VideoCard
            className="col-span-4 text-center flex flex-col items-center justify-center md:mt-5 mt-5"
            key={resource.path}
            resource={resource}
            location={location}
          />
        )
      })}
      {featuredArticles.resources.map((resource: any) => {
        return (
          <VideoCard
            className="col-span-4 text-center flex flex-col items-center justify-center md:mt-5 mt-5"
            key={resource.path}
            resource={resource}
            location={location}
          />
        )
      })}
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
      className="md:col-span-4 text-center md:mb-5 bg-gradient-to-t from-purple-900 to-blue-500"
      key={resource.path}
      resource={resource}
      location={location}
    >
      <a></a>
    </VerticalResourceCard>
  )
}

{
  /* <div className="absolute top-0 left-0 z-20 w-full h-2 bg-gradient-to-r from-purple-500 to-sky-500" /> */
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
	'featuredArticles': resources[slug.current == 'featured-articles'][0] {
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
	'featuredTalks': resources[slug.current == 'featured-talks'][0] {
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
