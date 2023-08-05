import * as React from 'react'
import {FunctionComponent} from 'react'
import groq from 'groq'
import {sanityClient} from 'utils/sanity-client'
import Image from 'next/image'
import Link from 'next/link'
import Markdown from 'react-markdown'
import {track} from 'utils/analytics'
import {CardResource} from 'types'
import {get} from 'lodash'
import VideoCard from 'components/pages/home/video-card'
import {VerticalResourceCard} from 'components/card/verticle-resource-card'

const StateManagement: React.FC<React.PropsWithChildren<any>> = ({data}) => {
  return (
    <>
      <div className="py-5 dark:bg-gray-900 bg-gray-50">
        <div className="container">
          <div className="grid gap-10">
            <Jumbotron resource={data.jumbotron} />
            <BigIdeasSection resource={data.theBigIdeas} />
            <RecoilSection resource={data.recoilSection} />
          </div>
        </div>
      </div>
    </>
  )
}

export default StateManagement

export const StateManagementQuery = groq`*[_type == 'resource' && slug.current == "state-management"][0]{
  title,
  description,
  path,
  "jumbotron": {
    "background": images[0] {
    	url
  	},
    image,
    title,
  	description,
  	"name": subTitle
  },
  'theBigIdeas': resources[slug.current == 'the-big-ideas'][0]{
    description,
    title,
    resources[] {
    "name": subTitle,
      ...
    }
 },
 "recoilSection": resources[slug.current == 'state-management-with-recoil'][0]{
  ...,
  resources[]-> {
    ...
  }
 },
}`

export async function getStaticProps() {
  const data = await sanityClient.fetch(StateManagementQuery)

  return {
    props: {
      data,
    },
  }
}

const RecoilSection = ({resource}: any) => {
  const {title, description, resources, path} = resource

  return (
    <div className="p-5 py-10 mt-5 rounded-lg md:bg-gray-100 dark:bg-gray-700">
      <Link href={path}>
        <a
          className="font-bold transition ease-in-out hover:text-blue-600 dark:hover:text-blue-300"
          onClick={() => {
            track('clicked resource', {
              resource: path,
            })
          }}
        >
          <h1 className="mb-4 text-xl font-extrabold text-center sm:text-2xl md:text-4xl leading-tighter">
            {title}
          </h1>
        </a>
      </Link>

      <Markdown
        source={description}
        allowDangerousHtml={true}
        className="max-w-screen-md mx-auto mt-4 prose text-center text-gray-900 dark:prose-dark md:prose-lg md:dark:prose-lg-dark dark:text-gray-100"
      />
      <div className="grid grid-cols-1 gap-4 mt-10 lg:grid-cols-3">
        {resources.map((resource: any) => {
          return (
            <VerticalResourceCard
              resource={resource}
              className="mb-4 text-center"
            />
          )
        })}
      </div>
    </div>
  )
}

const BigIdeasSection = ({resource}: any) => {
  const {title, description, resources} = resource

  return (
    <div className="">
      <div className="grid grid-cols-1 gap-10 px-5 py-10 text-gray-700 bg-gray-100 rounded-lg shadow-sm lg:grid-cols-5 dark:bg-gray-700 dark:text-gray-50 sm:py-16 ">
        <div className="col-span-2">
          <h1 className="mb-4 text-xl font-extrabold text-center sm:text-2xl md:text-4xl leading-tighter">
            {title}
          </h1>
          <Markdown
            source={description}
            allowDangerousHtml={true}
            className="max-w-screen-md mt-4 prose text-gray-900 dark:prose-dark md:prose-lg md:dark:prose-lg-dark dark:text-gray-100"
          />
        </div>
        <div className="col-span-3">
          {resources.map((resource: any) => {
            return <VideoCard resource={resource} className="mb-4" />
          })}
        </div>
      </div>
    </div>
  )
}

type JumbotronProps = {
  resource: CardResource
}

const Jumbotron: FunctionComponent<React.PropsWithChildren<JumbotronProps>> = ({
  resource,
}) => {
  const {image, title, background, description, name} = resource

  return (
    <div className="md:min-h-[477px] relative flex items-center justify-center bg-white text-white overflow-hidden rounded-lg shadow-sm dark:bg-gray-800 ">
      <div className="relative z-10 px-5 py-10 text-center sm:py-16 sm:text-left">
        <div className="flex items-center justify-center w-full max-w-screen-xl mx-auto mt-0 space-y-5 lg:px-8 sm:mb-4 md:my-12 lg:m-0 mb-15">
          <div className="flex flex-col items-center justify-center w-full space-y-5 lg:flex-row sm:space-x-10 sm:space-y-0 0 xl:pr-16">
            <div className="flex-shrink-0">
              <Image
                quality={100}
                src={get(image, 'src', image) as string}
                width={340}
                height={340}
                priority={true}
                alt={get(image, 'alt', `illustration for ${title}`)}
              />
            </div>
            <div className="flex flex-col items-center w-full sm:items-start">
              <h2 className="mb-2 text-xs font-semibold text-yellow-600 uppercase dark:text-yellow-300">
                {name}
              </h2>
              <h1 className="max-w-screen-lg text-xl font-extrabold text-gray-900 sm:text-2xl md:text-4xl leading-tighter dark:text-gray-50">
                {title}
              </h1>
              <Markdown
                source={description}
                allowDangerousHtml={true}
                className="max-w-screen-sm mt-4 text-base text-gray-700 dark:text-gray-200 opacity-80"
              />
            </div>
          </div>
        </div>
      </div>

      <Background
        className="absolute top-0 left-0 z-0 object-cover w-full h-full"
        background={background}
      />
    </div>
  )
}

const Background = ({className, background}: any) => {
  return background ? (
    <Image
      priority={true}
      quality={100}
      className={className}
      alt=""
      layout="fill"
      src={background.url}
    />
  ) : null
}
