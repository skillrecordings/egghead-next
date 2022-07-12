import React from 'react'
import {NextSeo} from 'next-seo'
import Topic from '../../components/topic'
import {find, get} from 'lodash'
import {ThreeLevels} from '../curated-essential'
import {HorizontalResourceCard} from 'components/card/horizontal-resource-card'
import {VerticalResourceCard} from 'components/card/verticle-resource-card'
import groq from 'groq'

const SearchNode = ({topic}: any) => {
  console.log(topic)
  const location = 'Node Topic Page'
  const title = `In-Depth Node Resources for ${new Date().getFullYear()}`

  const beginner: any = get(topic, 'beginner')
  const intermediate: any = get(topic, 'intermediate')
  const advanced: any = get(topic, 'advanced')
  const featureCourse: any = get(topic, 'featureCourse')
  const apiAndPerformance: any = get(topic, 'apiAndPerformance')

  return (
    <div>
      <NextSeo
        description={topic.summary}
        title={title}
        titleTemplate={'%s | egghead.io'}
        twitter={{
          site: `@eggheadio`,
          cardType: 'summary_large_image',
        }}
        openGraph={{
          title,
          description: topic.summary,
          site_name: 'egghead',
          images: [
            {
              url: `${topic.ogImage}`,
            },
          ],
        }}
      />
      <div className="items-start grid-cols-1 -mx-5 space-y-5 md:grid md:grid-cols-12 md:space-y-0">
        <Topic
          className="col-span-8"
          title="Node"
          imageUrl={`${topic.topicImage}`}
        >
          {`
Node.js is a platform built on Chrome's JavaScript runtime for easily building fast, scalable network applications. 

Node.js uses an event-driven, non-blocking I/O model that makes it lightweight and efficient, perfect for data-intensive real-time applications that run across distributed devices.

**Understanding Node.js can have a significant positive impact on your career as a Javascript developer.** Knowing how it works, how it scales, and how to interact with it can save you time, headaches and delays going to production which can put you well ahead. Understanding node.js can help you architect applications that are built to work with node's features and capabilities.

`}
        </Topic>
        <VerticalResourceCard
          resource={featureCourse}
          className="relative z-10 col-span-4 p-5 text-center"
          location={location}
          describe={true}
        >
          <div className="absolute top-0 left-0 z-20 w-full h-2 bg-gradient-to-r from-green-300 to-green-400" />
        </VerticalResourceCard>
      </div>

      <ThreeLevels
        beginner={beginner}
        intermediate={intermediate}
        advanced={advanced}
        location={location}
      />

      <div className="grid grid-cols-1 gap-4 mt-8 md:grid-cols-3">
        <HorizontalResourceCard
          resource={apiAndPerformance.article}
          className="flex flex-col col-span-2 md:flex-row"
          location={location}
        />
        <VerticalResourceCard
          resource={apiAndPerformance.course}
          className="relative z-10 text-center"
          location={location}
          describe={true}
        />
      </div>
    </div>
  )
}

export const nodePageQuery = groq`
*[_type == 'resource' && slug.current == "node-js-landing-page"][0]{
  title,
  description,
  summary,
  "ogImage": images[label == "og-image"][0].url,
  "topicImage": images[label == "topic-image"][0].url,
  "beginner": resources[slug.current == 'beginner'][0] {
    title,
    "name": meta,
    resources[]-> {
      byline,
      title,
      path,
      slug,
      image
    }
  },
  "intermediate": resources[slug.current == 'intermediate'][0]{
    title,
    "name": meta,
    resources[]-> {
      byline,
      title,
      path,
      slug,
      image
    }
  },
  "advanced": resources[slug.current == 'advanced'][0]{
    title,
    "name": meta,
    resources[]-> {
      byline,
      title,
      path,
      slug,
      image
    }
  },
  "featureCourse": resources[slug.current == 'feature-course'][0] {
    "title": resources[0]-> title,
    "byline": resources[0]-> byline,
    "path": resources[0]-> path,
    "slug": resources[0]-> slug,
    "image": resources[0]->image 
  },
  "apiAndPerformance": resources[slug.current == 'api-and-performance'][0] {
    "course": resources[0]->{
      byline,
      title,
      path,
      "slug": slug.current,
      image
    },
    "article": resources[1]{
      byline,
      title,
      path,
      "slug": slug.current,
      image
    }
  }
}
`

export default SearchNode
