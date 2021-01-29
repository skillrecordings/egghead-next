import React from 'react'
import {NextSeo} from 'next-seo'
import Card from 'components/pages/home/card'
import Collection from 'components/pages/home/collection'
import Topic from '../../components/topic'
import reactPageData from '../react/react-page-data'
import graphqlPageData from './graphql-page-data'

import {find} from 'lodash'
import EggheadPlayer from 'components/EggheadPlayer'
import Image from 'next/image'
import ExternalTrackedLink from '../../../external-tracked-link'

const SearchGraphql = () => {
  const location = 'react landing'
  const description = `Life is too short for lonnnnnng boring videos. Learn GraphQL using the best screencast tutorial videos online.`
  const title = `In-Depth Up-to-Date GraphQL Tutorials for ${new Date().getFullYear()}`

  const beginner: any = find(graphqlPageData, {id: 'get-started'})
  const intermediate: any = find(graphqlPageData, {id: 'pro-graphql'})
  const advanced: any = find(graphqlPageData, {id: 'graphql-apollo'})

  //const reactArticles: any = find(reactPageData, {id: 'articles'})
  // const reactTalks: any = find(reactPageData, {id: 'talks'})
  const graphqlPodcasts: any = find(graphqlPageData, {id: 'podcasts'})

  return (
    <div className="mb-10 pb-10 xl:px-0 px-5 max-w-screen-xl mx-auto dark:bg-gray-900">
      <NextSeo
        description={description}
        title={title}
        titleTemplate={'%s | egghead.io'}
        twitter={{
          site: `@eggheadio`,
          cardType: 'summary_large_image',
        }}
        openGraph={{
          title,
          description: description,
          site_name: 'egghead',
          images: [
            {
              url: `https://res.cloudinary.com/dg3gyk0gu/image/upload/v1604437767/eggo/React_Planet.png`,
            },
          ],
        }}
      />
      <div className="md:grid md:grid-cols-12 grid-cols-1 gap-5 items-start space-y-5 md:space-y-0 dark:bg-gray-900">
        <Topic
          className="col-span-8"
          title="GraphQL"
          imageUrl="https://res.cloudinary.com/dg3gyk0gu/image/upload/v1611870334/transcript-images/Frame_1.png"
        >
          {`
GraphQL is a query language for APIs

GraphQL provides an understandable description of the data in your API which gives you the power to ask for exactly what you need and you'll get one response as JSON.

Makes it easier to evolve APIs over time, and enables powerful developer tools.

`}
        </Topic>
        <ExternalTrackedLink
          eventName="clicked graphql workshop banner"
          params={{location}}
          className="block md:col-span-4 rounded-md w-full h-full overflow-hidden border-0 border-gray-100 relative"
          href="https://graphqlworkshop.com/"
        >
          <Image
            priority
            quality={100}
            width={417}
            height={463}
            src="https://res.cloudinary.com/dg3gyk0gu/image/upload/v1611920902/graphqlworkshop.com/graphqlworkshop-banner_2x.png"
            alt="graphqlworkshop.com by Eve Porcello"
          />
        </ExternalTrackedLink>
      </div>
      <div className="grid md:grid-cols-3 grid-cols-1 gap-5 items-start sm:mt-5 mt-3">
        <Card resource={beginner} location={location}>
          <Collection />
        </Card>
        <Card resource={intermediate} location={location} className="h-full">
          <Collection />
        </Card>
        <Card resource={advanced} location={location} className="h-full">
          <Collection />
        </Card>
      </div>
    </div>
  )
}

export default SearchGraphql
