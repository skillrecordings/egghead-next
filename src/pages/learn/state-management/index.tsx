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

const StateManagement: React.FC<any> = ({data}) => {
  return (
    <>
      <div className="sm:-my-5 -my-3 -mx-5 p-5 dark:bg-gray-900 bg-gray-50">
        <div className="mx-auto max-w-screen-xl grid gap-10">
          <Jumbotron resource={data.jumbotron} textColor="text-green-400" />
          <SecondarySection resource={data.startHere} />
        </div>
      </div>
    </>
  )
}

export default StateManagement

export const StateManagementQuery = groq`*[_type == 'resource' && slug.current == "state-management"][0]{
  title,
  path,
  "jumbotron": {
    "background": images[0] {
    	url
  	},
  	"name": subTitle,
    image,
    title,
    description,
  },
	'startHere': {
    'text1': content[type == 'start-here-text-1'][0]{
      "description": text,
      "title": label,
    },
  }
}`

export async function getStaticProps() {
  const data = await sanityClient.fetch(StateManagementQuery)

  return {
    props: {
      data,
    },
  }
}

const SecondarySection = ({resource}: any) => {
  const {text1, text2} = resource
  return (
    <div className="">
      <div className="grid grid-cols-2 gap-10">
        <div className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-50 rounded-lg shadow-sm px-5 sm:py-16 py-10">
          <h1 className="sm:text-2xl md:text-4xl text-xl font-extrabold leading-tighter text-center mb-4">
            {text1.title}
          </h1>
          <Markdown
            source={text1.description}
            allowDangerousHtml={true}
            className="prose dark:prose-dark md:prose-lg md:dark:prose-lg-dark text-gray-900 dark:text-gray-100  mt-4 max-w-screen-md"
          />
        </div>
        <div className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-50 rounded-lg shadow-sm px-5 sm:py-16 py-10">
          <h1 className="sm:text-2xl md:text-4xl text-xl font-extrabold leading-tighter text-center mb-4">
            Big Ideas of State Management
          </h1>
        </div>
      </div>
    </div>
  )
}

type JumbotronProps = {
  resource: CardResource
  textColor?: String
}

const Jumbotron: FunctionComponent<JumbotronProps> = ({resource}) => {
  const {image, title, background, description, name} = resource

  return (
    <div
      className="relative flex items-center justify-center bg-white text-white overflow-hidden rounded-lg shadow-sm bg-gradient-to-t dark:bg-gradient-to-t dark:from-gray-800 dark:to-gray-600"
      css={{
        [bpMinMD]: {
          minHeight: 477,
        },
      }}
    >
      {/* <div className="absolute top-0 left-0 bg-gradient-to-r from-purple-500 to-indigo-600 w-full h-2 z-20" /> */}
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
              <h2 className="text-xs text-yellow-400 dark:text-yellow-300 uppercase font-semibold mb-2">
                {name}
              </h2>
              <h1 className="sm:text-2xl md:text-4xl text-xl max-w-screen-lg font-extrabold leading-tighter text-gray-50">
                {title}
              </h1>
              <Markdown
                source={description}
                allowDangerousHtml={true}
                className="mt-4 text-gray-200 text-base max-w-screen-sm opacity-80"
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
