import groq from 'groq'
import {sanityClient} from 'utils/sanity-client'
import Image from 'next/image'
import Link from 'next/link'
import React, {FunctionComponent} from 'react'
import Jumbotron from 'components/pages/home/jumbotron'
import {HorizontalResourceCard} from 'components/card/horizontal-resource-card'

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
          <HorizontalResourceCard className="w-full" resource={thirdPrimary} />
        </div>
        <div className="grid gap-4">
          <HorizontalResourceCard
            className="h-auto flex"
            resource={firstSecondaryResource}
          />
          <HorizontalResourceCard
            className="w-full flex"
            resource={secondSecondaryResource}
          />
          <HorizontalResourceCard
            className="w-full flex"
            resource={thirdSecondaryResource}
          />
        </div>
      </div>
    </section>
  )
}

export default WhatsNewPage

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
