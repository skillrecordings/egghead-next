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

  const addtionalInterviewPrep: any = find(javascriptPageData, {
    id: 'addtional-interview-prep',
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
              url: `https://res.cloudinary.com/dg3gyk0gu/image/upload/v1611981007/og-image-assets/EGH_PlanetSocial-JS.png`,
            },
          ],
        }}
      />
      <div className="md:grid md:grid-cols-12 grid-cols-1 gap-5 items-start space-y-5 md:space-y-0">
        <Topic
          className="col-span-8"
          title="JavaScript"
          imageUrl="https://res.cloudinary.com/dg3gyk0gu/image/upload/v1611968683/egghead-next-pages/Javascript/hero-javascript-imae.png"
        >
          {`
If there's one thing that never gets old, it's rock-solid JavaScript fundamentals. 

When you're working in frameworks like React, Vue, and Angular, it's easy to forget that most of what you're writing is still JavaScript. We all get swept away in the excitement of new tools, but you need to lay down a stable foundation before stacking too much on top.

A strong understanding of JavaScript is essential for having a successful career, no matter which framework you use. 

This is a curated resource covering the important parts of the whole language. 

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
      <section className="grid md:grid-cols-3 grid-cols-1 gap-5 items-start mt-8 sm:mt-12">
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
      <section className="grid md:grid-cols-12 grid-cols-1 items-start sm:mt-12 gap-5 mt-4">
        <Card
          className="col-span-4"
          resource={javascriptDebugging}
          location={location}
        >
          <Collection />
        </Card>
        <div className="md:col-span-8 gap-5">
          <Card className="" resource={composingCallbacks} location={location}>
            <Collection />
          </Card>
          <Card className="mt-5" resource={asyncResource} location={location}>
            <Collection />
          </Card>
        </div>
      </section>

      <section className="grid md:grid-cols-12 grid-cols-1 gap-5 mt-12">
        <Card
          className="col-span-4"
          resource={interviewPrep}
          location={location}
        >
          <Collection />
        </Card>
        <div className="md:col-span-8">
          <div className="grid md:grid-cols-3 grid-cols-1 gap-5">
            {addtionalInterviewPrep.resources.map((resource: any) => {
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
      </section>

      <div>
        <section className="mt-12 grid md:grid-cols-2 grid-cols-1 gap-5">
          <Card resource={javaScriptArticles} location={location}>
            <Collection />
          </Card>
          <Card resource={javascriptPodcasts} location={location}>
            <Collection />
          </Card>
        </section>
      </div>
    </div>
  )
}

export default SearchJavaScript
