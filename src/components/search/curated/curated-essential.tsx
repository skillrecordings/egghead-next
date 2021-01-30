import React from 'react'
import {NextSeo} from 'next-seo'
import Card from 'components/pages/home/card'
import Collection from 'components/pages/home/collection'
import Topic from '../components/topic'
import {find} from 'lodash'

import DefaultCTA from './default-cta'

type CuratedEssentialProps = {
  topic: {
    name: string
    label: string
    title?: string
    description: string
  }
  pageData?: any
  CTAComponent?: React.FC
  ogImage?: string
  verticalImage?: string
}

const SearchCuratedEssential: React.FC<CuratedEssentialProps> = ({
  topic,
  pageData,
  children,
  CTAComponent,
  ogImage,
  verticalImage,
}) => {
  const location = `${topic} landing`
  const description = `Life is too short for long boring videos. Learn ${topic.label} using the best screencast tutorial videos online.`
  const title =
    topic.title ||
    `In-Depth ${topic.label} Tutorials for ${new Date().getFullYear()}`

  const beginner: any = find(pageData, {id: 'beginner'})
  const intermediate: any = find(pageData, {id: 'intermediate'})
  const advanced: any = find(pageData, {id: 'advanced'})

  return (
    <div className="mb-10 pb-10 xl:px-0 px-5 max-w-screen-xl mx-auto dark:bg-gray-900">
      <NextSeo
        description={description}
        title={title}
        titleTemplate={'%s | egghead.io'}
        twitter={{
          site: `@eggheadio`,
          cardType: 'summary_image_large',
        }}
        openGraph={{
          title,
          description: description,
          site_name: 'egghead',
          images: [
            {
              url:
                ogImage ||
                `https://og-image-react-egghead.now.sh/topic/${topic.name}?orientation=landscape&v=20201104`,
            },
          ],
        }}
      />
      <div className="md:grid md:grid-cols-12 grid-cols-1 gap-5 items-start space-y-5 md:space-y-0 dark:bg-gray-900">
        <Topic
          className="col-span-8"
          title={topic.label}
          imageUrl={
            verticalImage ||
            `https://og-image-react-egghead.now.sh/topic/${topic.name}?orientation=portrait&v=20201104`
          }
        >
          {topic.description}
        </Topic>
        {CTAComponent ? <CTAComponent /> : <DefaultCTA location={location} />}
      </div>
      {beginner && intermediate && advanced && (
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
      )}
      {children}
    </div>
  )
}

export default SearchCuratedEssential
