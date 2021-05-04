import groq from 'groq'
import {sanityClient} from 'utils/sanity-client'
import Image from 'next/image'
import Link from 'next/link'
import {get} from 'lodash'
import React, {FunctionComponent} from 'react'
import Markdown from 'react-markdown'
import {track} from 'utils/analytics'
import Card, {CardResource} from 'components/pages/home/card'
import Jumbotron from 'components/pages/home/jumbotron'

const WhatsNewPage: FunctionComponent<any> = ({resource}) => {
  const {primary, secondary} = resource
  const [jumbotron, secondPrimary, thirdPrimary] = primary.resources
  const [
    firstSecondaryResource,
    secondSecondaryResource,
    thirdSecondaryResource,
  ] = secondary.resources

  return (
    <section className="sm:-my-5 -my-3 mx-auto max-w-screen-xl">
      <h2 className="md:text-xl text-lg sm:font-semibold font-bold mb-3 dark:text-white">
        What's New
      </h2>
      <Jumbotron resource={jumbotron} textColor="text-green-400" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        <div className="h-full grid gap-4">
          <CourseFeatureCard
            className="h-auto row-span-2 w-full"
            resource={secondPrimary}
          />
          <CardHorizontal className="w-full" resource={thirdPrimary} />
        </div>
        <div className="grid gap-4">
          <CardHorizontal
            className="h-auto flex"
            resource={firstSecondaryResource}
          />
          <CardHorizontal
            className="w-full flex"
            resource={secondSecondaryResource}
          />
          <CardHorizontal
            className="w-full flex"
            resource={thirdSecondaryResource}
          />
        </div>
      </div>
    </section>
  )
}

export default WhatsNewPage

export const CardHorizontal: FunctionComponent<{
  resource: CardResource
  className?: string
  location?: string
}> = ({resource, className = 'border-none my-4', location = 'home'}) => {
  return (
    <Card className={className}>
      <>
        <div className="flex sm:flex-row flex-col sm:space-x-5 space-x-0 sm:space-y-0 space-y-5 items-center sm:text-left text-center">
          {resource?.image && (
            <Link href={resource.path}>
              <a
                onClick={() => {
                  track('whats new homepage resource', {
                    resource: resource.path,
                    linkType: 'image',
                    location,
                  })
                }}
                className="block flex-shrink-0 sm:w-auto m:w-24 w-36"
                tabIndex={-1}
              >
                <Image
                  src={get(resource.image, 'src', resource.image)}
                  width={130}
                  height={130}
                  layout="fixed"
                  className="object-cover rounded-md"
                  alt={`illustration for ${resource?.title}`}
                />
              </a>
            </Link>
          )}
          <div className="flex flex-col justify-center sm:items-start items-center">
            <h2 className=" uppercase font-semibold text-xs tracking-tight text-gray-700 dark:text-gray-300 mb-1">
              {resource?.name}
            </h2>
            <Link href={resource?.path}>
              <a
                onClick={() => {
                  track('clicked resource', {
                    resource: resource?.path,
                    linkType: 'text',
                    location,
                  })
                }}
                className="hover:text-blue-600 dark:hover:text-blue-300"
              >
                <h3 className="text-xl font-bold leading-tighter">
                  {resource?.title}
                </h3>
              </a>
            </Link>
            <div className="text-xs text-gray-600 dark:text-gray-300 mb-2 mt-1">
              {resource?.byline}
            </div>
            <Markdown
              source={resource?.description || ''}
              className="prose dark:prose-dark dark:prose-dark-sm prose-sm max-w-none"
            />
          </div>
        </div>
      </>
    </Card>
  )
}

const CourseFeatureCard = ({resource, className}: any) => {
  const {
    title,
    image,
    path,
    description,
    featureCardBackground,
    instructor: {name},
  } = resource
  return (
    <Link href={path}>
      <a
        className={`relative dark:bg-gray-800 bg-white group block rounded-md w-full h-full overflow-hidden text-center shadow-sm dark:text-white ${
          className ? className : ''
        }`}
      >
        <div className="flex flex-col items-center h-full">
          <div className="relative z-10 flex flex-col h-full justify-between  items-center sm:p-8 p-5">
            <div className="flex flex-col items-center">
              <Image src={image} width={200} height={200} alt={title} />
              <h2 className="text-xl font-bold min-w-full mt-4 sm:mt-14 mb-2 leading-tighter group-hover:underline">
                {title}
              </h2>
              <span className="text-sm opacity-80">{name}</span>
              <p className="text-sm mt-4">{description}</p>
            </div>
          </div>
          <img
            className="absolute top-0 left-0 z-0 w-full"
            src={featureCardBackground}
            alt=""
          />
        </div>
      </a>
    </Link>
  )
}

export const whatsNewQuery = groq`*[_type == 'resource' && slug.current == "whats-new"][0]{
  title,
	'primary': resources[slug.current == 'new-page-primary-resource-collection'][0]{
 		resources[]->{
      title,
      'name': type,
      'description': summary,
    	path,
    	image,
      'background': images[label == 'banner-image-blank'][0].url,
      'featureCardBackground': images[label == 'feature-card-background'][0].url,
      'instructor': collaborators[]->[role == 'instructor'][0]{
        title,
        'slug': person->slug.current,
        'name': person->name,
        'path': person->website,
        'twitter': person->twitter,
        'image': person->image.url
  		},
    }
  },
	'secondary': resources[slug.current == 'new-page-secondary-resource-collection'][0]{
    resources[]{
      'name': type,
      title,
      path,
      byline,
      image,
    }
  },
}`

export async function getStaticProps() {
  const resource = await sanityClient.fetch(whatsNewQuery)

  return {
    props: {
      resource,
    },
  }
}
