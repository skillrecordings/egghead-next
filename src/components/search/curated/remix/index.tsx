import React from 'react'
import {NextSeo} from 'next-seo'
import Image from 'next/image'
import groq from 'groq'
import {CardResource} from 'types'
import {HorizontalResourceCard} from 'components/card/topic-page-horizontal-resource-card'
import {useRouter} from 'next/router'

type TopicPage = {
  topic: {
    title: string
    description: string
    ogImage?: string
    image: string
    courses: TopicPageCourses
  }
}

enum ResourceOrder {
  primary = 'primary',
  second = 'second',
}

type TopicPageCourses = {
  [ResourceOrder.primary]: CardPageCardResource
  [ResourceOrder.second]: CardPageCardResource
}

type CardPageCardResource = CardResource & {
  cta?: string
  meta?: string
}

const SearchRemix = ({topic}: TopicPage) => {
  const location = 'Remix Topic Page'
  const description = `Build your Developer Portfolio and climb the engineering career ladder with in-depth Remix resources.`
  const title = `In-Depth Remix Resources for ${new Date().getFullYear()}`
  const ogImage = topic.ogImage
    ? topic.ogImage
    : 'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1654105781/egghead-next-pages/remix/og-image-remix-page.png'
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
          url: `${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}${router.asPath}`,
          site_name: 'egghead',
          images: [
            {
              url: ogImage,
            },
          ],
        }}
      />
      <div className="flex flex-col max-w-3xl mx-auto space-y-5 md:space-y-0 mb-4">
        <div className="my-10">
          <Image width={850} height={290} src={topic.image} />
        </div>
        <h2 className="text-3xl col-span-1">Get Started</h2>
        <p className="mt-2 pb-12">{topic.description}</p>
        <div className="rounded dark:bg-gray-800 bg-white dark:bg-opacity-60 shadow-smooth">
          <HorizontalResourceCard resource={topic.courses.primary} />
          <HorizontalResourceCard
            resource={topic.courses.second}
            left={false}
          />
        </div>
      </div>
    </div>
  )
}

export const remixPageQuery = groq`
*[_type == 'resource' && slug.current == "remix-landing-page"][0]{
  title,
  description,
  "ogImage": images[label == 'og-image'][0].url,
  "image": images[label == "remix-glowing-logo"][0].url,
  "courses": resources[slug.current == "featured-courses"][0]{
    "primary": resources[slug.current == "primary-course"][0]{
      byline,
      description,
      'cta': content[0].text,
      meta,
      'title': resources[0]->title,
      'image': resources[0]->image,
      'path': resources[0]->path
      
  },
    "second": resources[slug.current == "second-course"][0]{
      byline,
      description,
      'cta': content[0].text,
      meta,
      'title': resources[0]->title,
      'image': resources[0]->image,
      'path': resources[0]->path
    }
  }
}`

export default SearchRemix
