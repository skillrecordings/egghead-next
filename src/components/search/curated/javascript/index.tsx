import React from 'react'
import {NextSeo} from 'next-seo'
import Card from 'components/pages/home/card'
import Collection from 'components/pages/home/collection'
import Topic from '../../components/topic'
import javascriptPageData from './javascript-page-data'
import {find} from 'lodash'
import EggheadPlayer from 'components/EggheadPlayer'
import Image from 'next/image'
import ExternalTrackedLink from '../../../external-tracked-link'

const SearchJavaScript = () => {
  const location = 'javascript landing'
  const description = `Life is too short for lonnnnnng boring videos. Learn JavaScript using the best screencast tutorial videos online.`
  const title = `In-Depth Up-to-Date JavaScript Tutorials for ${new Date().getFullYear()}`

  const beginner: any = find(javascriptPageData, {id: 'beginner'})
  const intermediate: any = find(javascriptPageData, {id: 'intermediate'})
  const advanced: any = find(javascriptPageData, {id: 'advanced'})
  const stateManagementVideo: any = find(javascriptPageData, {
    id: 'state-management-video',
  })
  const stateManagementFeatured: any = find(javascriptPageData, {
    id: 'state-management-featured',
  })
  const stateManagementCollection: any = find(javascriptPageData, {
    id: 'state-management-collection',
  })
  const stateManagementQuickly: any = find(javascriptPageData, {
    id: 'state-management-quickly',
  })
  const reactArticles: any = find(javascriptPageData, {id: 'articles'})
  const reactTalks: any = find(javascriptPageData, {id: 'talks'})
  const reactPodcasts: any = find(javascriptPageData, {id: 'podcasts'})

  return (
    <div className="mb-10 pb-10 py-5 xl:px-0 px-5 max-w-screen-xl mx-auto dark:bg-trueGray-900">
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
              url: `https://p-ZmFjNlQ.b3.n0.cdn.getcloudapp.com/items/GGu6PRP8/81661b86-2d95-4ed1-85f3-cce8ce7bf974.png?v=4c6081b4267a169ef8150d9ae7a64a3e`,
            },
          ],
        }}
      />
      <div className="md:grid md:grid-cols-12 grid-cols-1 gap-5 items-start space-y-5 md:space-y-0 dark:bg-trueGray-900">
        <Topic
          className="col-span-8"
          title="JavaScript"
          imageUrl="https://p-ZmFjNlQ.b3.n0.cdn.getcloudapp.com/items/GGu6PRP8/81661b86-2d95-4ed1-85f3-cce8ce7bf974.png?v=4c6081b4267a169ef8150d9ae7a64a3e"
        >
          {`
Become an in-demand JavaScript developer.  Working daily with frameworks like React, Vue, and Angular it can be surprising how much JavaScript you don't know. 

You know how to get things done but you don't know what should you study and understand core JS. 

A rock-solid understanding of JavaScript is essential for having a successful career, no matter which framework you use. This is a curated resource covering the important parts of the whole language.

So when someones come to you and ask "Hey! can you build this". You can say "Yes" with confidence.

`}
        </Topic>
        <ExternalTrackedLink
          eventName="clicked epic react banner"
          params={{location}}
          className="block md:col-span-4 rounded-md w-full h-full overflow-hidden border-0 border-gray-100 relative"
          href="https://epicreact.dev"
        >
          <Image
            priority
            quality={100}
            width={417}
            height={463}
            src="https://res.cloudinary.com/dg3gyk0gu/image/upload/v1611336740/next.egghead.io/react/epic_react_link_banner.png"
            alt="epicreact.dev by Kent C. Dodds"
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
      <section className="mt-5 grid lg:grid-cols-12 grid-cols-1 gap-5 md:p-5 md:bg-gray-100 dark:bg-trueGray-800 rounded-lg">
        <div className="lg:col-span-8 col-span-12 space-y-5">
          <header className="py-5 md:px-8 px-5 rounded-md flex md:flex-row flex-col md:text-left text-center md:space-y-0 space-y-3 md:items-start items-center justify-center md:space-x-5 space-x-0">
            <div className="flex-shrink-0">
              <Image
                src={
                  'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/166/full/EGH_ReactAdvPatterns2_Final.png'
                }
                alt="illustration for state management in react"
                width={150}
                height={150}
                quality={100}
              />
            </div>
            <div className="max-w-screen-sm space-y-3">
              <h1 className="md:text-3xl text-2xl dark:text-trueGray-200 font-bold leading-tight">
                State Management in React
              </h1>
              <div className="leading-relaxed text-gray-700 dark:text-trueGray-50 space-y-3">
                <p>
                  When it comes down to it, nearly every UI problem is a state
                  management problem. Orchestrating a whole symphony of menus,
                  forms, and data requests is hard enough before you even begin
                  debating which of the 99 React state management libraries you
                  should pick.
                </p>
                <p>
                  We've spoken to top experts in the field of state management
                  to hear their thoughts on why the best ideas in state
                  management aren't always the newest, why principles are often
                  universal where implementations are not, and how state
                  management concepts carry across frameworks and tools.
                </p>
              </div>
            </div>
          </header>
          <div>
            <Card
              resource={stateManagementVideo}
              className="flex md:flex-row flex-col"
              location={location}
            >
              <div className="sm:w-full sm:-mt-5 -mt-0 sm:-mb-5 -mb-4 md:-mr-5 -mr-4 md:ml-8 -ml-4  flex items-center bg-black flex-shrink-0 md:max-w-sm">
                <EggheadPlayer
                  preload={false}
                  autoplay={false}
                  poster={stateManagementVideo.poster}
                  hls_url={stateManagementVideo.hls_url}
                  dash_url={stateManagementVideo.dash_url}
                  subtitlesUrl={stateManagementVideo.subtitlesUrl}
                  width="100%"
                  height="auto"
                />
              </div>
            </Card>
            <div className="grid lg:grid-cols-12 grid-cols-1 gap-5 mt-5">
              {stateManagementFeatured.resources.map((resource: any) => {
                return (
                  <Card
                    className="col-span-4 text-center"
                    key={resource.path}
                    resource={resource}
                    location={location}
                  />
                )
              })}
            </div>
          </div>
        </div>
        <div className="md:col-span-4 col-span-12">
          <Card resource={stateManagementCollection} location={location}>
            <Collection />
          </Card>
          <Card
            resource={stateManagementQuickly}
            className="mt-5"
            location={location}
          >
            <Collection />
          </Card>
        </div>
      </section>
      <section className="mt-5 grid md:grid-cols-3 grid-cols-1 gap-5">
        <Card resource={reactArticles} location={location}>
          <Collection />
        </Card>
        <Card resource={reactPodcasts} location={location}>
          <Collection />
        </Card>
        <Card resource={reactTalks} location={location}>
          <Collection />
        </Card>
      </section>
    </div>
  )
}

export default SearchJavaScript
