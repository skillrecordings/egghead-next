import React, {FunctionComponent} from 'react'
import {NextSeo} from 'next-seo'
import Markdown from 'react-markdown'
import Topic from 'components/search/components/topic'
import {find} from 'lodash'

const landingPage = () => {
  return (
    <>
      <div className="mb-10 pb-10 xl:px-0 px-5 max-w-screen-xl mx-auto">
        <ProjectBrief
          topic={{
            name: 'cloudflare',
            label: 'Project Brief',
          }}
        >
          <p>
            <Markdown
              className="prose dark:prose-dark pt-2 sm:text-base text-sm leading-normal text-gray-800 dark:text-gray-200 mt-0"
              source={`You are a developer for a national concert promoter.`}
            />
          </p>
          <p>
            <Markdown
              className="prose dark:prose-dark pt-2 sm:text-base text-sm leading-normal text-gray-800 dark:text-gray-200 mt-0"
              source={`Music fans from all over the world visit your site to see when and where the next show is going to be. To save them time when they visit the page, we want to show them upcoming events at a venue close to their location.`}
            />
          </p>
          <p>
            <Markdown
              className="prose dark:prose-dark pt-2 sm:text-base text-sm leading-normal text-gray-800 dark:text-gray-200 mt-0"
              source={`Your task is to create and deploy a Cloudflare Worker that will examine the request for location data, and render HTML featuring information for the closest concert taking place based on the nearest [regional Cloudflare Location](https://www.cloudflare.com/network/). Choose locations for testing where you have friends (or a VPN 😅) so you can prove this functionality works as expected.`}
            />
          </p>
        </ProjectBrief>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="px-10 py-10 bg-white shadow col-span-2">
            <h1 className="sm:text-2xl text-xl font-bold mb-2">Performance</h1>
            <Markdown
              className="prose dark:prose-dark pt-2 sm:text-base text-sm leading-normal text-gray-800 dark:text-gray-200 mt-0"
              source={`Your task is to create and deploy a Cloudflare Worker that will examine the request for location data, and render HTML featuring information for the closest concert taking place based on the nearest [regional Cloudflare Location](https://www.cloudflare.com/network/). Choose locations for testing where you have friends (or a VPN 😅) so you can prove this functionality works as expected.`}
            />
            <Markdown
              className="prose dark:prose-dark pt-2 sm:text-base text-sm leading-normal text-gray-800 dark:text-gray-200 mt-0"
              source={`Your task is to create and deploy a Cloudflare Worker that will examine the request for location data, and render HTML featuring information for the closest concert taking place based on the nearest [regional Cloudflare Location](https://www.cloudflare.com/network/). Choose locations for testing where you have friends (or a VPN 😅) so you can prove this functionality works as expected.`}
            />
          </div>
          <div className="px-10 py-10 bg-white shadow col-span-1">
            <h1 className="sm:text-2xl text-xl font-bold mb-2">Standards</h1>
            <Markdown
              className="prose dark:prose-dark pt-2 sm:text-base text-sm leading-normal text-gray-800 dark:text-gray-200 mt-0"
              source={`Your task is to create and deploy a Cloudflare Worker that will examine the request for location data, and render HTML featuring information for the closest concert taking place based on the nearest [regional Cloudflare Location](https://www.cloudflare.com/network/). Choose locations for testing where you have friends (or a VPN 😅) so you can prove this functionality works as expected.`}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export enum CARD_TYPES {
  SUMMARY = 'summary',
  SUMMARY_LARGE_IMAGE = 'summary_large_image',
}

export type Topic = {
  name: string
  label: string
  title?: string
}

type ProjectBriefProps = {
  topic: Topic
  className: any
  pageData?: any
  CTAComponent?: React.FC
  ogImage?: string
  verticalImage?: string
  cardType?: CARD_TYPES
}

const ProjectBrief: React.FC<ProjectBriefProps> = ({
  topic,
  children,
  ogImage,
  className,
  cardType = CARD_TYPES.SUMMARY_LARGE_IMAGE,
}) => {
  const description = `Life is too short for long boring videos. Learn ${topic.label} using the best screencast tutorial videos online.`
  const location = `${topic} landing`
  const title =
    topic.title ||
    `In-Depth ${topic.label} Tutorials for ${new Date().getFullYear()}`

  return (
    <div
      className={`mb-10 pb-10 xl:px-0 px-5 dark:bg-gray-900 ${
        className ? className : ''
      }`}
    >
      <NextSeo
        description={description}
        title={title}
        titleTemplate={'%s | egghead.io'}
        twitter={{
          site: `@eggheadio`,
          cardType,
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
      <div className="md:grid grid-cols-1 gap-5 justify-self-center space-y-5 md:space-y-0 dark:bg-gray-900">
        <div
          className={`bg-white dark:bg-gray-800 dark:text-gray-200 shadow-sm grid grid-cols-8 h-full relative items-center overflow-hidden rounded-md border border-gray-100 dark:border-gray-800 col-span-8`}
        >
          <div
            className="overflow-hidden sm:col-span-2 col-span-2 w-full h-full"
            style={{
              background: `url(https://og-image-react-egghead.now.sh/topic/${topic.name}?orientation=portrait&v=20201104)`,
              backgroundSize: 'cover',
              backgroundPosition: '38%',
            }}
          />
          <div className="sm:col-span-6 col-span-6 flex flex-col justify-start h-full p-8">
            <h1 className="sm:text-2xl text-xl font-bold mb-2">
              {topic.label}
            </h1>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default landingPage
