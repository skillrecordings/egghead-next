import React from 'react'
import {NextSeo} from 'next-seo'
import Topic from '../../components/topic'
import javascriptPageData from './javascript-page-data'
import {find} from 'lodash'
import Image from 'next/image'
import ExternalTrackedLink from '../../../external-tracked-link'
import {ThreeLevels} from '../curated-essential'
import {VerticalResourceCollectionCard} from 'components/card/vertical-resource-collection-card'
import {VerticalResourceCard} from 'components/card/verticle-resource-card'

const SearchJavaScript = () => {
  const location = 'javascript landing'
  const description = `Life is too short for lonnnnnng boring videos. Learn JavaScript using the best screencast tutorial videos online led by working professionals that learn in public.`
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

  const domEvents: any = find(javascriptPageData, {
    id: 'dom-events',
  })

  return (
    <div>
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
              url: `https://res.cloudinary.com/dg3gyk0gu/image/upload/v1611968683/egghead-next-pages/Javascript/hero-javascript-imae.png`,
            },
          ],
        }}
      />
      <div className="md:grid md:grid-cols-12 grid-cols-1 items-start space-y-5 md:space-y-0 -mx-5">
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
          className="block md:col-span-4 w-full h-full overflow-hidden bg-white relative text-center"
          href="https://testingjavascript.com"
        >
          <Image
            priority
            quality={100}
            // width={417}
            // height={463}
            objectFit="contain"
            objectPosition="bottom"
            layout="fill"
            src="https://res.cloudinary.com/dg3gyk0gu/image/upload/v1639043693/next.egghead.io/javascript/testingjs-banner_2x.png"
            alt="Testing javascript by Kent C. Dodds"
          />
        </ExternalTrackedLink>
      </div>

      {/* Learning Level Section */}
      <ThreeLevels
        beginner={beginner}
        intermediate={intermediate}
        advanced={advanced}
        location={location}
      />

      {/* Feature Section */}
      <section className="grid lg:grid-cols-12 grid-cols-1 items-start">
        <div className="col-span-4 mr-0 lg:mr-5">
          <VerticalResourceCard resource={domEvents} />
          <VerticalResourceCollectionCard
            resource={javascriptDebugging}
            location={location}
            className="mt-5"
          />
        </div>
        <div className="md:col-span-8 gap-5 mt-5 lg:mt-0">
          <VerticalResourceCollectionCard
            resource={composingCallbacks}
            location={location}
          />
          <VerticalResourceCollectionCard
            className="mt-5"
            resource={asyncResource}
            location={location}
          />
          <VerticalResourceCollectionCard
            className="mt-5"
            resource={interviewPrep}
            location={location}
          />
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-12 grid-cols-1  mt-12">
        <div className="md:col-span-12">
          <div className="grid md:grid-cols-3 grid-cols-1 gap-5">
            {addtionalInterviewPrep.resources.map((resource: any) => {
              return (
                <VerticalResourceCard
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
          <VerticalResourceCollectionCard
            resource={javaScriptArticles}
            location={location}
          />
          <VerticalResourceCollectionCard
            resource={javascriptPodcasts}
            location={location}
          />
        </section>
      </div>
    </div>
  )
}

export default SearchJavaScript
