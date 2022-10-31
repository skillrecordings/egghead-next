import React from 'react'
import {NextSeo} from 'next-seo'
import Topic from '../../components/topic'
import graphqlPageData from './graphql-page-data'
import {find} from 'lodash'
import Image from 'next/image'
import ExternalTrackedLink from '../../../external-tracked-link'
import VideoCard from 'components/pages/home/video-card'
import {VerticalResourceCard} from '../../../card/verticle-resource-card'
import {VerticalResourceCollectionCard} from '../../../card/vertical-resource-collection-card'
import {useRouter} from 'next/router'

const SearchGraphql = () => {
  const location = 'graphQL landing'
  const description = `Life is too short for lonnnnnng boring videos. Learn GraphQL using the best screencast tutorial videos online led by working professionals that learn in public.`
  const title = `In-Depth Up-to-Date GraphQL Tutorials for ${new Date().getFullYear()}`

  const beginner: any = find(graphqlPageData, {id: 'get-started'})
  const projectBased: any = find(graphqlPageData, {id: 'project-based'})
  const graphqlServerless: any = find(graphqlPageData, {
    id: 'graphql-serverless',
  })
  const graphqlFeatured: any = find(graphqlPageData, {
    id: 'graphql-featured',
  })
  const graphqlVideo: any = find(graphqlPageData, {
    id: 'graphql-video',
  })

  const router = useRouter()

  return (
    <div>
      <NextSeo
        description={description}
        canonical={`${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}${router.asPath}`}
        title={title}
        titleTemplate={'%s | egghead.io'}
        twitter={{
          site: `@eggheadio`,
          cardType: 'summary_large_image',
        }}
        openGraph={{
          title,
          url: `${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}${router.asPath}`,
          description: description,
          site_name: 'egghead',
          images: [
            {
              url: `https://res.cloudinary.com/dg3gyk0gu/image/upload/v1611981777/egghead-next-pages/graphql/graphql-share-image_2x.png`,
            },
          ],
        }}
      />
      <div className="md:grid md:grid-cols-12 grid-cols-1 items-start space-y-5 md:space-y-0 dark:bg-gray-900 -mx-5">
        <Topic
          className="col-span-8"
          title="GraphQL"
          imageUrl="https://res.cloudinary.com/dg3gyk0gu/image/upload/v1611981256/egghead-next-pages/graphql/graphql-hero-image_2x.png"
        >
          {`
Over the last few years, an idea has emerged for syncing state between the client and server. A change in the way we interact with data that provides clear advantages over REST. 

**GraphQL.**

With GraphQL, you can define the shape of your data in a schema, and GraphQL will let consumers of that data request precisely what they need when they need it. You will no longer need to perform multiple requests for data or send more data than is necessary.

These curated courses will teach you GraphQL from the ground up, all the way to production-ready applications. 

`}
        </Topic>
        <ExternalTrackedLink
          eventName="clicked graphql workshop banner"
          params={{location}}
          className="block md:col-span-4 w-full h-full overflow-hidden border-0 border-gray-100 relative text-center"
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

      <div className="grid lg:grid-cols-12 grid-cols-1 gap-5 mt-8">
        {graphqlFeatured.resources.map((resource: any) => {
          return (
            <VerticalResourceCard
              className="col-span-4 text-center"
              key={resource.path}
              resource={resource}
              location={location}
            />
          )
        })}
      </div>

      <div className="grid md:grid-cols-3 grid-cols-1 mt-8">
        <VideoCard
          resource={graphqlVideo}
          className="flex md:flex-row flex-col col-span-2 md:mr-4 mr-0"
          location={location}
        />
        <VerticalResourceCollectionCard
          resource={beginner}
          location={location}
          className="md:mt-0 mt-4"
        />
      </div>

      <div className="grid md:grid-cols-2 grid-cols-1 gap-5 items-start mt-8">
        <VerticalResourceCollectionCard
          resource={projectBased}
          location={location}
          className="h-full"
        />
        <VerticalResourceCollectionCard
          resource={graphqlServerless}
          location={location}
          className="h-full"
        />
      </div>
    </div>
  )
}

export default SearchGraphql
