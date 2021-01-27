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

  const composingBuildPattern: any = find(javascriptPageData, {
    id: 'build-the-pattern',
  })
  const composingIntegrateReact: any = find(javascriptPageData, {
    id: 'integrate-in-react',
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

      {/* Feature Section */}
      <section className="mt-5 grid lg:grid-cols-12 grid-cols-1 gap-5 md:p-5 md:bg-gray-100 dark:bg-trueGray-800 rounded-lg">
        <div className="lg:col-span-8 col-span-12 space-y-5">
          <header className="py-5 md:px-8 px-5 rounded-md flex md:flex-row flex-col md:text-left text-center md:space-y-0 space-y-3 md:items-start items-center justify-center md:space-x-5 space-x-0">
            <div className="flex-shrink-0">
              <Image
                src={
                  'https://d2eip9sf3oo6c2.cloudfront.net/instructors/avatars/000/000/005/medium/avatar-500x500.jpg'
                }
                alt="John Lindquist smiling into a camera"
                width={150}
                height={150}
                quality={100}
                className="rounded-full"
              />
            </div>
            <div className="max-w-screen-sm space-y-3">
              <h1 className="md:text-3xl text-2xl dark:text-trueGray-200 font-bold leading-tight">
                Composing Closures and Callbacks in JavaScript
              </h1>
              <div className="leading-relaxed text-gray-700 dark:text-trueGray-50 space-y-3">
                <p>
                  This a multi-tier master course for aspiring lead developers.
                  John Lindquist guides you from a blank JavaScript file all the
                  way through creating a library of reusable functions, solving
                  Callback Hell with composition, implementing debouncing, and
                  building a word game among several other examples.
                </p>
              </div>
            </div>
          </header>
          <div>
            <div className="grid lg:grid-cols-12 md:grid-cols-3 grid-cols-1 gap-5 items-start sm:mt-5 mt-3">
              <Card
                resource={composingBuildPattern}
                location={location}
                className="h-full col-span-6"
              >
                <Collection />
              </Card>
              <Card
                resource={composingIntegrateReact}
                location={location}
                className="h-full col-span-6"
              >
                <Collection />
              </Card>
            </div>
            {/* <div>
              <Card
                resource={interviewPrep}
                location={location}
                className="mt-4 grid lg:grid-cols-12"
                >
              <div className="col-span-6 flex flex-col">
                <Markdown>
                  Problem-solving is at the heart of what you do as a programmer every day. Being able to reason about a problem logically will produce far more value than jumping into code right away.
                </Markdown>
                <Markdown>
                  For-loops are *not* the solution for everything and you know that person that uses them too much. Don't be that person, and actually think about the problem before coding yourself into a hole.
                </Markdown>
              </div>
                <Collection className="w-40 col-span-6" />
              </Card>
            </div> */}
          </div>
        </div>
        <div className="md:col-span-4 col-span-12">
          <Card resource={javascriptDebugging} location={location}>
            <Collection />
          </Card>
          <Card
            resource={javascriptFavorites}
            className="mt-5"
            location={location}
          >
            <Collection />
          </Card>
        </div>
      </section>

      {/* Podcasts and Articles Section */}
      <section className="mt-5 grid md:grid-cols-3 grid-cols-1 gap-5">
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
