import * as React from 'react'
import groq from 'groq'
import {sanityClient} from 'utils/sanity-client'
import Image from 'next/image'
import Link from 'next/link'
import Markdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import {track} from 'utils/analytics'
import {VerticalResourceCard} from 'components/card/verticle-resource-card'

const DigitalGardening: React.FC<any> = ({data}) => {
  return (
    <div className="sm:-my-5 -my-3 -mx-5 p-5 dark:bg-gray-900 bg-gray-50">
      <div className="mx-auto max-w-screen-xl">
        <div className="flex items-center justify-center bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-50 overflow-hidden rounded-lg shadow-sm">
          <div className="px-5 sm:py-16 py-10 sm:text-left text-center">
            <div className="space-y-5 mx-auto flex items-center justify-center lg:px-8 w-full">
              <div className="flex lg:flex-row flex-col items-center justify-center sm:space-x-10 sm:space-y-0 space-y-5 0 w-full xl:pr-16">
                <div className="flex-shrink-0">
                  <Link href={data.path}>
                    <a
                      tabIndex={-1}
                      onClick={() =>
                        track('clicked jumbotron resource', {
                          resource: data.path,
                          linkType: 'image',
                        })
                      }
                    >
                      <Image
                        quality={100}
                        src={data.illustration.url}
                        width={222}
                        height={273}
                        alt={data.illustration.alt}
                      />
                    </a>
                  </Link>
                </div>
                <div className="flex flex-col sm:items-start items-center w-full">
                  <h2 className="text-xs text-green-600 dark:text-green-300 uppercase font-semibold mb-2">
                    {data.cta.description}
                  </h2>

                  <h1 className="sm:text-2xl md:text-4xl text-xl max-w-screen-lg font-extrabold leading-tighter">
                    {data.title}
                  </h1>

                  <Markdown
                    children={data.description}
                    rehypePlugins={[rehypeRaw, rehypeSanitize]}
                    className="mt-4 text-gray-700 dark:text-gray-50 text-base max-w-screen-sm"
                  />
                  <Markdown
                    children={data.quote.description}
                    rehypePlugins={[rehypeRaw, rehypeSanitize]}
                    className="mt-4 text-gray-700 dark:text-gray-50 text-base max-w-screen-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="grid lg:grid-cols-12 grid-cols-1 gap-5 mt-5">
            {data.featured.courses.map((resource: any) => {
              return (
                <VerticalResourceCard
                  className="col-span-4 text-center"
                  key={resource.path}
                  resource={resource}
                />
              )
            })}
          </div>
        </div>

        <div className="sm:py-16 py-10 sm:text-left text-center">
          <div className="space-y-5 mx-auto flex items-center justify-center lg:px-8 w-full">
            <div className="flex lg:flex-row flex-col items-center justify-center sm:space-x-10 sm:space-y-0 space-y-5 0 w-full xl:pr-16">
              <div className="mx-auto">
                <h2 className="text-xs text-yellow-600 dark:yellow-green-300 uppercase font-semibold mb-2 text-center">
                  {data.talks.cta}
                </h2>

                <h1 className="sm:text-2xl md:text-4xl text-xl max-w-screen-lg font-extrabold leading-tighter">
                  {data.talks.title}
                </h1>
              </div>
            </div>
          </div>
          <div className="grid lg:grid-cols-12 grid-cols-1 gap-5 mt-5">
            {data.talks.resources.map((resource: any) => {
              return (
                <VerticalResourceCard
                  className="col-span-3 text-center dark:bg-gray-800"
                  key={resource.path}
                  resource={resource}
                />
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DigitalGardening

export const digitalGardeningQuery = groq`*[_type == 'resource' && slug.current == "digital-gardening-for-developers-v2"][0]{
  title,
  description,
  path,
  'illustration': images[label == 'eggo'][0]{
    url,
    alt
  },
  'quote': content[title == 'quote'][0]{
    description
  },
  'cta': content[title == 'cta'][0]{
    description
  },
  'featured': resources[slug.current == 'featured-digital-gardening-courses'][0]{
 		'courses': resources[]{
    	title,
    	byline,
      'name': content[title == 'name'][0].description,
    	'path': resources[]->[0].path,
    	'image': resources[]->[0].image
  	}
  },
  'talks': resources[slug.current == 'infrastructure-for-digital-gardens'][0]{
      title,
      description,
      'cta': content[title == 'cta'][0].description,
      resources[]{
        title,
        'path': slug.current,
        byline,
        image,
      },
  },
}`

export async function getStaticProps() {
  const data = await sanityClient.fetch(digitalGardeningQuery)

  return {
    props: {
      data,
    },
  }
}
