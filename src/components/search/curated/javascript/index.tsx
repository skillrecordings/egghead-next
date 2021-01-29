import React from 'react'
import {NextSeo} from 'next-seo'
import Card from 'components/pages/home/card'
import Collection from 'components/pages/home/collection'
import Topic from '../../components/topic'
import javascriptPageData from './javascript-page-data'
import {find} from 'lodash'
import Image from 'next/image'
import Markdown from 'react-markdown'
import ExternalTrackedLink from '../../../external-tracked-link'

const SearchJavaScript = () => {
  const location = 'javascript landing'
  const description = `Life is too short for lonnnnnng boring videos. Learn JavaScript using the best screencast tutorial videos online.`
  const title = `In-Depth Up-to-Date JavaScript Tutorials for ${new Date().getFullYear()}`

  const beginner: any = find(javascriptPageData, {id: 'beginner'})
  const intermediate: any = find(javascriptPageData, {id: 'intermediate'})
  const advanced: any = find(javascriptPageData, {id: 'advanced'})

  const composingCallbacks: any = find(javascriptPageData, {
    id: 'composing-callbacks',
  })

  const javascriptFavorites: any = find(javascriptPageData, {
    id: 'javascript-favorites',
  })

  const interviewPrep: any = find(javascriptPageData, {
    id: 'interview-prep',
  })
  const javascriptDebugging: any = find(javascriptPageData, {
    id: 'debugging',
  })

  const javaScriptArticles: any = find(javascriptPageData, {id: 'articles'})
  const asyncResource: any = find(javascriptPageData, {id: 'async'})
  const javascriptPodcasts: any = find(javascriptPageData, {id: 'podcasts'})

  return (
    <div className="mb-10 pb-10 py-5 xl:px-0 px-5 max-w-screen-xl mx-auto">
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
      <div className="md:grid md:grid-cols-12 grid-cols-1 gap-5 items-start space-y-5 md:space-y-0">
        <Topic
          className="col-span-8"
          title="JavaScript"
          imageUrl="https://p-ZmFjNlQ.b3.n0.cdn.getcloudapp.com/items/GGu6PRP8/81661b86-2d95-4ed1-85f3-cce8ce7bf974.png?v=4c6081b4267a169ef8150d9ae7a64a3e"
        >
          {`
If there's one thing that never gets old, it's rock-solid JavaScript fundamentals. 

When you're working in frameworks like React, Vue, and Angular, it's easy to forget that most of what you're writing is still JavaScript. We all get swept away in the excitement of new tools, but you need to lay down a stable foundation before stacking too much on top.

A strong understanding of JavaScript is essential for having a successful career, no matter which framework you use. 

This is a curated resource covering the important parts of the whole language. We'll show you what you need to know and guide you through learning it.

When someone comes to you and asks "Hey! Can you build this?", you'll be able to say "yes" with confidence.
`}
        </Topic>
        <ExternalTrackedLink
          eventName="clicked testing javascript banner"
          params={{location}}
          className="block md:col-span-4 rounded-md w-full h-full overflow-hidden border-0 border-gray-100 relative"
          href="https://testingjavascript.com"
        >
          <Image
            priority
            quality={100}
            width={417}
            height={463}
            src="https://res.cloudinary.com/dg3gyk0gu/image/upload/v1611679406/next.egghead.io/javascript/testingjs.png"
            alt="Testing javascript by Kent C. Dodds"
          />
        </ExternalTrackedLink>
      </div>

      {/* Learning Level Section */}
      <section className="grid md:grid-cols-3 grid-cols-1 gap-5 items-start sm:mt-8">
        <Card resource={beginner} location={location} className="h-full">
          <Collection />
        </Card>
        <Card resource={intermediate} location={location} className="h-full">
          <Collection />
        </Card>
        <Card resource={advanced} location={location} className="h-full">
          <Collection />
        </Card>
      </section>

      <hr className="sm:mt-20 mt-16 w-1/2 mx-auto border" />

      {/* Feature Section */}
      <section className="grid md:grid-cols-12 grid-cols-1 items-start sm:mt-20  gap-5">
        <Card
          className="col-span-4"
          resource={javascriptDebugging}
          location={location}
        >
          <Collection />
        </Card>
        <div className="md:col-span-8 gap-5 mt-5">
          <Card className="" resource={composingCallbacks} location={location}>
            <Collection />
          </Card>
          <Card className="mt-5" resource={asyncResource} location={location}>
            <Collection />
          </Card>
        </div>
      </section>
      <section className="grid md:grid-cols-12 grid-cols-1 items-start sm:mt-20  gap-5">
        <div className="md:col-span-8">
          <h3 className="uppercase font-semibold text-xs text-gray-700 dark:text-gray-300 my-6 text-center">
            Evergreen Classics
          </h3>
          <div className="md:flex md:flex-row gap-5">
            {javascriptFavorites.resources.map((resource: any) => {
              return (
                <Card
                  className="text-center"
                  key={resource.path}
                  resource={resource}
                  location={location}
                />
              )
            })}
          </div>
        </div>
        <Card
          className="col-span-4"
          resource={interviewPrep}
          location={location}
        >
          <Collection />
        </Card>
      </section>

      <hr className="sm:mt-20 mt-16 w-1/2 mx-auto border" />

      {/* Podcasts and Articles Section */}
      <section className="mt-5 grid md:grid-cols-2 sm:mt-24 mt-16 grid-cols-1 gap-5">
        <Card resource={javaScriptArticles} location={location}>
          <Collection />
        </Card>
        <Card resource={javascriptPodcasts} location={location}>
          <Collection />
        </Card>
      </section>
    </div>
  )
}

export default SearchJavaScript
