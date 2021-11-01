import * as React from 'react'
import {FunctionComponent} from 'react'
import groq from 'groq'
import {sanityClient} from 'utils/sanity-client'
import Image from 'next/image'
import Link from 'next/link'
import Markdown from 'react-markdown'
import {track} from 'utils/analytics'
import {CardResource} from 'types'
import {bpMinMD} from 'utils/breakpoints'
import {get} from 'lodash'
import VideoCard from 'components/pages/home/video-card'
import {VerticalResourceCard} from 'components/card/verticle-resource-card'

const StateManagement: React.FC<any> = ({data}) => {
  return (
    <>
      <div className="sm:-my-5 -my-3 -mx-5 p-5 dark:bg-gray-900 bg-gray-50">
        <div className="mx-auto max-w-screen-xl grid gap-10">
          <Jumbotron resource={data.jumbotron} />
          <BigIdeasSection resource={data.theBigIdeas} />
          <RecoilSection resource={data.recoilSection} />
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
    <div className="mt-5 md:bg-gray-100 dark:bg-gray-700 rounded-lg py-10 p-5">
      <Link href={path}>
        <a
          className="font-bold hover:text-blue-600 dark:hover:text-blue-300 transition ease-in-out"
          onClick={() => {
            track('clicked resource', {
              resource: path,
            })
          }}
        >
          <h1 className="sm:text-2xl md:text-4xl text-xl font-extrabold leading-tighter text-center mb-4">
            {title}
          </h1>
        </a>
      </Link>

      <Markdown
        source={description}
        allowDangerousHtml={true}
        className="prose dark:prose-dark md:prose-lg md:dark:prose-lg-dark text-gray-900 dark:text-gray-100  mt-4 max-w-screen-md mx-auto text-center"
      />
      <div className="grid lg:grid-cols-3 grid-cols-1 gap-4 mt-10">
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
      <div className="grid lg:grid-cols-5 grid-cols-1 gap-10 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-50 rounded-lg shadow-sm px-5 sm:py-16 py-10 ">
        <div className="col-span-2">
          <h1 className="sm:text-2xl md:text-4xl text-xl font-extrabold leading-tighter text-center mb-4">
            {title}
          </h1>
          <Markdown
            source={description}
            allowDangerousHtml={true}
            className="prose dark:prose-dark md:prose-lg md:dark:prose-lg-dark text-gray-900 dark:text-gray-100  mt-4 max-w-screen-md"
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

const Jumbotron: FunctionComponent<JumbotronProps> = ({resource}) => {
  const {image, title, background, description, name} = resource

  return (
    <div className="md:min-h-[477px] relative flex items-center justify-center bg-white text-white overflow-hidden rounded-lg shadow-sm dark:bg-gray-800 ">
      <div className="relative z-10 px-5 sm:py-16 py-10 sm:text-left text-center">
        <div className="space-y-5 mx-auto flex items-center justify-center max-w-screen-xl lg:px-8 w-full sm:mb-4 md:my-12 lg:m-0 mt-0 mb-15">
          <div className="flex lg:flex-row flex-col items-center justify-center sm:space-x-10 sm:space-y-0 space-y-5 0 w-full xl:pr-16">
            <div className="flex-shrink-0">
              <Image
                quality={100}
                src={get(image, 'src', image)}
                width={340}
                height={340}
                priority={true}
                alt={get(image, 'alt', `illustration for ${title}`)}
              />
            </div>
            <div className="flex flex-col sm:items-start items-center w-full">
              <h2 className="text-xs text-yellow-600 dark:text-yellow-300 uppercase font-semibold mb-2">
                {name}
              </h2>
              <h1 className="sm:text-2xl md:text-4xl text-xl max-w-screen-lg font-extrabold leading-tighter text-gray-900 dark:text-gray-50">
                {title}
              </h1>
              <Markdown
                source={description}
                allowDangerousHtml={true}
                className="mt-4 dark:text-gray-200 text-gray-700 text-base max-w-screen-sm opacity-80"
              />
            </div>
          </div>
        </div>
      </div>

      <Background
        className="absolute left-0 top-0 w-full h-full z-0 object-cover"
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
