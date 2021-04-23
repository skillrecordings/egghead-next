import groq from 'groq'
import {sanityClient} from 'utils/sanity-client'
import Image from 'next/image'
import Link from 'next/link'
import React, {FunctionComponent} from 'react'
import Jumbotron from 'components/pages/home/jumbotron'
import CardHorizontal from 'components/pages/home/card/card-horizontal'

const WhatsNewPage: FunctionComponent<any> = ({data}) => {
  const {primary, side, bottom} = data
  const [jumbotron, secondPrimary] = primary.resources
  const [firstSide, secondSide] = side.resources
  const [firstBottom, secondBottom] = bottom.resources

  return (
    <section className="sm:-my-5 -my-3 p-5 mx-auto max-w-screen-xl">
      <h2 className="md:text-xl text-lg sm:font-semibold font-bold mb-3 dark:text-white">
        What's New
      </h2>
      <Jumbotron
        resource={jumbotron}
        titleHover="hover:text-green-400"
        instructorHover="group-hover:text-green-200"
      />

      <div className="grid grid-cols-12 grid-rows-2 gap-4 mt-4">
        <FancyCard
          className="h-auto row-span-2 w-full col-span-6"
          resource={secondPrimary}
        />
        <CardHorizontal className="h-auto col-span-6" resource={firstSide} />
        <CardHorizontal
          className="w-full row-span-1 col-span-6"
          resource={secondSide}
        />
        <CardHorizontal
          className="w-full row-span-1 col-span-6"
          resource={firstBottom}
        />
        <CardHorizontal
          className="w-full row-span-1 col-span-6"
          resource={secondBottom}
        />
      </div>
    </section>
  )
}

export default WhatsNewPage

const FancyCard = ({resource, className}: any) => {
  const {
    title,
    image,
    path,
    description,
    fancyCardBackground,
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
          <div className="relative z-10 flex flex-col h-full justify-between p-2 items-center">
            <div className="flex flex-col items-center mt-14">
              <Image src={image} width={200} height={200} alt={title} />
              <h2 className="text-xl font-bold min-w-full mt-10 mb-2 leading-tighter group-hover:underline">
                {title}
              </h2>
              <span className="text-sm opacity-80">{name}</span>
              <p className="text-sm mt-4">{description}</p>
            </div>
          </div>
          <img
            className="absolute top-0 left-0 z-0 w-full"
            src={fancyCardBackground}
            alt=""
          />
        </div>
      </a>
    </Link>
  )
}

export const whatsNewQuery = groq`*[_type == 'resource' && slug.current == "whats-new"][0]{
  title,
	'primary': resources[slug.current == 'primary-resources'][0]{
 		resources[]->{
      title,
      'name': type,
      'description': summary,
    	path,
    	image,
      'background': images[label == 'banner-image-blank'][0].url,
      'fancyCardBackground': images[label == 'fancy-card'][0].url,
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
	'side': resources[slug.current == 'side-resources'][0]{
    resources[]{
      'name': type,
      title,
      path,
      byline,
      image,
    }
  },
	'bottom': resources[slug.current == 'bottom-resources'][0]{
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
  const data = await sanityClient.fetch(whatsNewQuery)

  return {
    props: {
      data,
    },
  }
}
