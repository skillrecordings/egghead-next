import React from 'react'
import {NextSeo} from 'next-seo'
import Card from 'components/pages/home/card'
import Collection from 'components/pages/home/collection'
import Topic from '../components/topic'
import reactPageData from './react-page-data'
import Link from 'next/link'
import {find} from 'lodash'
import EggheadPlayer from 'components/EggheadPlayer'
import Markdown from 'react-markdown'
import CardVideo from '../../pages/home/card/index'
import Image from 'next/image'

const SearchReact = () => {
  const description = `Life is too short for lonnnnnng boring videos. Learn React using the best screencast tutorial videos online.`
  const title = `Advanced React Tutorials for ${new Date().getFullYear()}`

  const video: any = find(reactPageData, {id: 'video'})
  const reactArticles: any = find(reactPageData, {id: 'reactArticles'})
  const featured: any = find(reactPageData, {id: 'featured'})
  const beginner: any = find(reactPageData, {id: 'beginner'})
  const intermediate: any = find(reactPageData, {id: 'intermediate'})
  const advanced: any = find(reactPageData, {id: 'advanced'})

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
              url: `https://res.cloudinary.com/dg3gyk0gu/image/upload/v1604437767/eggo/React_Planet.png`,
            },
          ],
        }}
      />
      <div className="grid md:grid-cols-12 grid-cols-1 gap-5 items-start ">
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
        <a
          className="block md:col-span-4 rounded-md w-full h-full overflow-hidden border-0 border-gray-100 relative"
          href="https://epicreact.dev"
        >
          <Image
            priority
            quality={100}
            width={417}
            height={463}
            src="https://app.egghead.io/webpack/a03682deb1d0acefc51e1015b3aa8008.png"
            alt="epicreact.dev by Kent C. Dodds"
          />
        </a>
      </div>
      <div className="grid md:grid-cols-3 grid-cols-1 gap-5 items-start sm:mt-5 mt-3">
        <Card resource={beginner}>
          <Collection />
        </Card>
        <Card resource={intermediate} className="h-full">
          <Collection />
        </Card>
        <Card resource={advanced} className="h-full">
          <Collection />
        </Card>
      </div>
      <div className="grid lg:grid-cols-12 grid-cols-1 gap-5 mt-5">
        <div className="lg:col-span-8">
          <CardVideo className="rounded border border-gray-100">
            <div className="flex sm:flex-row flex-col justify-center">
              <div className="flex flex-col justify-between items-start sm:pr-16 sm:pb-0 pb-10">
                <div>
                  <h2 className="uppercase font-semibold text-xs text-gray-700">
                    {video.name}
                  </h2>
                  <Link href={video.path}>
                    <a className="hover:text-blue-600">
                      <h3 className="text-2xl font-bold tracking-tight leading-tighter mt-2">
                        {video.title}
                      </h3>
                    </a>
                  </Link>
                  <div className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-150 ease-in-out mt-1">
                    <Link href={video.instructor_path || ''}>
                      <a className="hover:text-blue-600">{video.instructor}</a>
                    </Link>
                  </div>
                  <Markdown className="prose prose-sm mt-4">
                    {video.description}
                  </Markdown>
                </div>
              </div>
              <div className="sm:w-full -m-5 flex items-center flex-grow bg-black">
                <EggheadPlayer
                  preload={false}
                  autoplay={false}
                  poster={video.poster}
                  hls_url={video.hls_url}
                  dash_url={video.dash_url}
                  subtitlesUrl={video.subtitlesUrl}
                  width="100%"
                  height="auto"
                />
              </div>
            </div>
          </CardVideo>
          <div className="grid lg:grid-cols-12 grid-cols-1 gap-5 mt-5">
            {featured.resources.map((resource: any) => {
              return (
                <Card
                  className="col-span-4 text-center"
                  key={resource.path}
                  resource={resource}
                />
              )
            })}
          </div>
        </div>
        <Card resource={reactArticles} className="md:col-span-4">
          <Collection />
        </Card>
      </div>
    </div>
  )
}

export default SearchReact
