import groq from 'groq'
import {sanityClient} from 'utils/sanity-client'
import Image from 'next/image'
import Link from 'next/link'
import React, {FunctionComponent} from 'react'
import Jumbotron from 'components/pages/home/jumbotron'
import {HorizontalResourceCard} from 'components/card/horizontal-resource-card'
import {track} from '../../utils/analytics'

const WhatsNewPage: FunctionComponent<any> = ({
  resource,
  location = 'home',
}) => {
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
          <HorizontalResourceCard
            className="w-full"
            resource={secondPrimary}
            location={location}
          />
          <HorizontalResourceCard
            className="w-full"
            resource={thirdPrimary}
            location={location}
          />
        </div>
        <div className="grid gap-4">
          <HorizontalResourceCard
            className="h-auto flex"
            resource={firstSecondaryResource}
            location={location}
          />
          <HorizontalResourceCard
            className="w-full flex"
            resource={secondSecondaryResource}
            location={location}
          />
          <HorizontalResourceCard
            className="w-full flex"
            resource={thirdSecondaryResource}
            location={location}
          />
        </div>
      </div>
    </section>
  )
}

export default WhatsNewPage

export const whatsNewQuery = groq`*[_type == 'resource' && slug.current == "whats-new"][0]{
  title,
	'primary': resources[slug.current == 'new-page-primary-resource-collection'][0]{
 		resources[]->{
      title,
      'name': type,
      'description': summary,
    	path,
      'byline': meta,
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
