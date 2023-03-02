import React from 'react'
import {NextSeo} from 'next-seo'
import {find, get} from 'lodash'
import Image from 'next/image'
import groq from 'groq'
import Topic from '../../components/topic'
import reactPageData from './react-page-data'
import ExternalTrackedLink from 'components/external-tracked-link'
import VideoCard from 'components/pages/home/video-card'
import {VerticalResourceCollectionCard} from 'components/card/vertical-resource-collection-card'
import {VerticalResourceCard} from 'components/card/new-vertical-resource-card'
import {ThreeLevels} from '../curated-essential'
import Grid from 'components/grid'

const SearchReact = ({topic}: any) => {
  const location = 'react landing'
  const description = `Life is too short for lonnnnnng boring videos. Learn React using the best screencast tutorial videos online led by working professionals that learn in public.`
  const title = `In-Depth Up-to-Date React Tutorials for ${new Date().getFullYear()}`

  const beginner: any = find(reactPageData, {id: 'beginner'})
  const intermediate: any = find(reactPageData, {id: 'intermediate'})
  const advanced: any = find(reactPageData, {id: 'advanced'})

  const style: any = find(reactPageData, {id: 'style'})
  const sideProjects: any = find(reactPageData, {id: 'sideProjects'})

  const stateManagementVideo: any = find(reactPageData, {
    id: 'state-management-video',
  })
  const stateManagementFeatured: any = find(reactPageData, {
    id: 'state-management-featured',
  })
  const stateManagementCollection: any = find(reactPageData, {
    id: 'state-management-collection',
  })
  const reactArticles: any = find(reactPageData, {id: 'articles'})
  const reactTalks: any = find(reactPageData, {id: 'talks'})
  const reactPodcasts: any = find(reactPageData, {id: 'podcasts'})

  const recoilCollection = get(topic?.reactStateManagement, 'recoilCollection')
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
              url: `https://res.cloudinary.com/dg3gyk0gu/image/upload/v1604437767/eggo/React_Planet.png`,
            },
          ],
        }}
      />
      <div className="md:grid md:grid-cols-12 grid-cols-1 items-start space-y-5 md:space-y-0 dark:bg-gray-900 -mx-5">
        <Topic
          className="col-span-8"
          title="React"
          imageUrl="https://res.cloudinary.com/dg3gyk0gu/image/upload/v1604411002/next.egghead.io/react/space_2x.png"
        >
          {`
One of the web’s most popular frameworks for building JavaScript applications. If you know what you’re doing, React can drastically simplify how you build, use, and maintain code.

Whether you’re a React newbie or you’re ready for advanced techniques, you can level-up with egghead.

You can find courses below curated just for you whether you're looking for a particular topic or want to take your React skills to the next level.

`}
        </Topic>
      </div>
      <ThreeLevels
        beginner={beginner}
        intermediate={intermediate}
        advanced={advanced}
        location={location}
      />

      <section className="space-y-5 flex flex-col">
        <header className="py-5 md:px-8 px-5 rounded-md flex md:flex-row flex-col md:text-left text-center md:space-y-0 space-y-3 md:items-start items-center justify-center md:space-x-5 space-x-0">
          <div className="flex-shrink-0">
            <Image
              src={
                'https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/408/538/full/state_management_2x.png'
              }
              alt="illustration for state management in react"
              width={200}
              height={200}
              quality={100}
            />
          </div>
          <div className="max-w-screen-sm space-y-3">
            <h1 className="md:text-3xl text-2xl dark:text-gray-200 font-bold leading-tight">
              State Management in React
            </h1>
            <div className="leading-relaxed text-gray-700 dark:text-gray-50 space-y-3">
              <p>
                When it comes down to it, nearly every UI problem is a state
                management problem. Orchestrating a whole symphony of menus,
                forms, and data requests is hard enough before you even begin
                debating which of the 99 React state management libraries you
                should pick.
              </p>
              <p>
                We've spoken to top experts in the field of state management to
                hear their thoughts on why the best ideas in state management
                aren't always the newest, why principles are often universal
                where implementations are not, and how state management concepts
                carry across frameworks and tools.
              </p>
            </div>
          </div>
        </header>
        <div className="flex flex-col flex-grow">
          <VideoCard
            resource={stateManagementVideo}
            className="flex md:flex-row flex-col"
            location={location}
          />

          <Grid>
            {stateManagementFeatured.resources.map((resource: any) => {
              return (
                <VerticalResourceCard
                  key={resource.path}
                  resource={resource}
                  location={location}
                />
              )
            })}
          </Grid>
        </div>

        <div className="md:col-span-4 col-span-12 flex flex-col">
          <VerticalResourceCollectionCard
            resource={stateManagementCollection}
            location={location}
          />
          {recoilCollection && (
            <VerticalResourceCollectionCard
              resource={recoilCollection}
              className="mt-5 flex-grow"
              location={location}
            />
          )}
        </div>
      </section>

      <div className="grid md:grid-cols-3 grid-cols-1 gap-5 items-start">
        <VerticalResourceCollectionCard resource={style} location={location} />
        <VerticalResourceCollectionCard
          className="h-full md:col-span-2"
          resource={sideProjects}
          location={location}
        />
      </div>

      <section className="grid md:grid-cols-3 grid-cols-1 gap-5">
        <VerticalResourceCollectionCard
          resource={reactArticles}
          location={location}
        />
        <VerticalResourceCollectionCard
          resource={reactPodcasts}
          location={location}
        />
        <VerticalResourceCollectionCard
          resource={reactTalks}
          location={location}
        />
      </section>
    </div>
  )
}

export const reactPageQuery = groq`
*[_type == 'resource' && slug.current == 'react-landing-page'][0]{
  title,
  'reactStateManagement': resources[slug.current == 'react-state-management-section'][0] {
    'recoilCollection': resources[slug.current == 'recoil-collection'][0]{
      title,
      description,
      resources[]->{
       title,
       'description': summary,
       path,
       byline,
       image,
       'background': images[label == 'feature-card-background'][0].url,
       'instructor': collaborators[]->[role == 'instructor'][0]{
         'name': person->.name
       },
     }
    }
	},
 }
`

export default SearchReact
