import React, {FunctionComponent} from 'react'
import {NextSeo} from 'next-seo'
import Card from '../components/card'
import Topic from '../components/topic'
import Resource from '../components/resource'
import reactPageData from './react-page-data'
import Link from 'next/link'
import {map, get, find} from 'lodash'
import EggheadPlayer from 'components/EggheadPlayer'
import Markdown from 'react-markdown'
import CardVideo, {CardResource} from '../../pages/home/card/index'
import {useViewer} from 'context/viewer-context'
import Collection from '../../pages/home/collection/index'
import Image from 'next/image'
import Textfit from 'react-textfit'

const SearchReact = () => {
  const description = `Life is too short for lonnnnnng boring videos. Learn React using the best screencast tutorial videos online.`
  const title = `Advanced React Tutorials for ${new Date().getFullYear()}`

  const video: any = find(reactPageData, {id: 'video'})
  const reactArticles: any = find(reactPageData, {id: 'reactArticles'})
  const featured: any = find(reactPageData, {id: 'featured'})

  console.log(featured)

  return (
    <div className="mb-12">
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
      <div className="grid md:grid-cols-12 grid-cols-1 gap-5 items-start sm:mt-5 mt-3">
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

        <aside className="md:col-span-4 rounded-md overflow-hidden border-0 border-gray-100">
          <a href="https://epicreact.dev">
            <img
              src="https://app.egghead.io/webpack/a03682deb1d0acefc51e1015b3aa8008.png"
              alt="epicreact.dev by Kent C. Dodds"
            />
          </a>
        </aside>
      </div>
      <div className="grid md:grid-cols-3 grid-cols-1 gap-5 items-start sm:mt-5 mt-3">
        <Card title="Beginner" description="Just Starting Out">
          <ul className="-mb-2">
            <Resource
              title="The Beginner's Guide to React"
              path="/courses/the-beginner-s-guide-to-react"
              imageUrl="https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/160/full/EGH_BeginnersReact2.png"
            />
            <Resource
              title="Develop Accessible Web Apps with React"
              path="/courses/develop-accessible-web-apps-with-react"
              imageUrl="https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/412/full/AccessibleReact_1000.png"
            />
            <Resource
              title="Build Maps with React Leaflet"
              path="/courses/build-maps-with-react-leaflet"
              imageUrl="https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/490/full/React_Leaflet_Final.png"
            />
          </ul>
        </Card>
        <Card title="Intermediate" description="Hitting Your Stride">
          <ul className="-mb-2">
            <Resource
              title="VR Applications using React 360"
              path="/courses/vr-applications-using-react-360"
              imageUrl="https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/272/full/React360-final.png"
            />
            <Resource
              title="Shareable Custom Hooks in React"
              path="/courses/shareable-custom-hooks-in-react"
              imageUrl="https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/313/full/EGH_CustomReactHooks_Final.png"
            />
            <Resource
              title="Simplify React Apps with React Hooks"
              path="/courses/simplify-react-apps-with-react-hooks"
              imageUrl="https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/263/full/EGH_SimplifyHooks_Final.png"
            />
          </ul>
        </Card>
        <Card title="Advanced" description="Above and Beyond">
          <ul className="-mb-2">
            <Resource
              title="Redux with React Hooks"
              path="/playlists/redux-with-react-hooks-8a37"
              imageUrl="https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/026/full/react.png"
            />
            <Resource
              title="Build an App with React Suspense"
              path="/courses/build-an-app-with-react-suspense"
              imageUrl="https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/399/full/React_Suspense_Final.png"
            />
            <Resource
              title="Up and running with Recoil"
              path="/playlists/up-and-running-with-recoil-a-new-state-management-library-for-react-78b8"
              imageUrl="https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/026/thumb/react.png"
            />
          </ul>
        </Card>
      </div>

      <div className="grid lg:grid-cols-12 grid-cols-1 gap-5 mt-12">
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
          <div className="grid lg:grid-cols-12 grid-cols-1 gap-5 mt-12">
            {featured.resources.map((resource: any) => {
              return <CardVerticalLarge key={resource.path} data={resource} />
            })}
          </div>
        </div>
        <CardVerticalWithStack data={reactArticles} />
      </div>
    </div>
  )
}

type CardProps = {
  data: CardResource
  className?: string
  memberTitle?: string
}

const CardVerticalLarge: FunctionComponent<CardProps> = ({data}) => {
  const {path, image, title, name, byline} = data
  return (
    <div className="lg:col-span-4 rounded border border-gray-100">
      <div className="border-none flex flex-col items-center justify-center text-center sm:py-8 py-6">
        <>
          {image && (
            <Link href={path}>
              <a className="mb-2 mx-auto w-24" tabIndex={-1}>
                <Image
                  width={140}
                  height={140}
                  src={get(image, 'src', image)}
                  alt={`illustration for ${title}`}
                />
              </a>
            </Link>
          )}
          <h2 className="uppercase font-semibold text-xs mb-1 text-gray-700">
            {name}
          </h2>
          <Link href={path}>
            <a className="hover:text-blue-600">
              <h3 className="md:text-lg text-base sm:font-semibold font-bold leading-tight">
                <Textfit mode="multi" min={14} max={20}>
                  {title}
                </Textfit>
              </h3>
            </a>
          </Link>
          <div className="text-xs text-gray-600 mt-1">{byline}</div>
        </>
      </div>
    </div>
  )
}

const CardVerticalWithStack: FunctionComponent<CardProps> = ({
  data,
  memberTitle,
}) => {
  const {viewer} = useViewer()
  const {name, title, description, path} = data
  return (
    <div className="md:col-span-4 flex flex-col gap-5 md:p-6 p-4 rounded-md overflow-hidden border border-gray-100 ">
      <h2 className="uppercase font-semibold text-xs text-gray-700">
        {(viewer?.is_pro || viewer?.is_instructor) && memberTitle
          ? memberTitle
          : name}
      </h2>
      {path ? (
        <Link href={path}>
          <a className="hover:text-blue-600">
            <h3 className="align-top text-xl font-bold tracking-tight leading-tight mb-2 -mt-5">
              {title}
            </h3>
          </a>
        </Link>
      ) : (
        <h3 className="align-top text-xl font-bold tracking-tight leading-tight -mb-6">
          {title}
        </h3>
      )}
      <div>
        <Markdown
          source={description || ''}
          className="prose prose-sm max-w-none mb-3 "
        />
        <Collection resource={data} />
      </div>
    </div>
  )
}

export default SearchReact
