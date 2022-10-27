import React from 'react'
import {NextSeo} from 'next-seo'
import Topic from '../../components/topic'
import nodePageData from './node-page-data'
import {find} from 'lodash'
import {ThreeLevels} from '../curated-essential'
import {HorizontalResourceCard} from 'components/card/horizontal-resource-card'
import {VerticalResourceCard} from 'components/card/verticle-resource-card'
import {useRouter} from 'next/router'

const SearchNode = () => {
  const location = 'Node Topic Page'
  const description = `Build your Developer Portfolio and climb the engineering career ladder with in-depth Node resources.`
  const title = `In-Depth Node Resources for ${new Date().getFullYear()}`

  const beginner: any = find(nodePageData, {id: 'beginner'})
  const intermediate: any = find(nodePageData, {
    id: 'intermediate',
  })
  const advanced: any = find(nodePageData, {
    id: 'advanced',
  })
  const performanceArticle: any = find(nodePageData, {
    id: 'performance-article',
  })
  const featureCourse: any = find(nodePageData, {
    id: 'feature-course',
  })
  const secondaryFeatureCourse: any = find(nodePageData, {
    id: 'secondary-feature-course',
  })
  const router = useRouter()

  return (
    <div>
      <NextSeo
        canonical={`${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}${router.asPath}`}
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
          url: `${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}${router.asPath}`,
          images: [
            {
              url: `https://og-image-react-egghead.vercel.app/topic/node`,
            },
          ],
        }}
      />
      <div className="md:grid md:grid-cols-12 grid-cols-1 items-start space-y-5 md:space-y-0 -mx-5">
        <Topic
          className="col-span-8"
          title="Node"
          imageUrl="https://og-image-react-egghead.now.sh/topic/node?orientation=portrait&v=20201105"
        >
          {`
Node.js is a platform built on Chrome's JavaScript runtime for easily building fast, scalable network applications. 

Node.js uses an event-driven, non-blocking I/O model that makes it lightweight and efficient, perfect for data-intensive real-time applications that run across distributed devices.

**Understanding Node.js can have a significant positive impact on your career as a Javascript developer.** Knowing how it works, how it scales, and how to interact with it can save you time, headaches and delays going to production which can put you well ahead. Understanding node.js can help you architect applications that are built to work with node's features and capabilities.

`}
        </Topic>
        <VerticalResourceCard
          resource={featureCourse}
          className="col-span-4 text-center relative z-10 p-5"
          location={location}
          describe={true}
        >
          <div className="absolute top-0 left-0 bg-gradient-to-r from-green-300 to-green-400 w-full h-2 z-20" />
        </VerticalResourceCard>
      </div>

      <ThreeLevels
        beginner={beginner}
        intermediate={intermediate}
        advanced={advanced}
        location={location}
      />

      <div className="grid md:grid-cols-3 grid-cols-1 mt-8 gap-4">
        <HorizontalResourceCard
          resource={performanceArticle}
          className="flex md:flex-row flex-col col-span-2"
          location={location}
        />
        <VerticalResourceCard
          resource={secondaryFeatureCourse}
          className="text-center relative z-10"
          location={location}
          describe={true}
        />
      </div>
    </div>
  )
}

export default SearchNode
