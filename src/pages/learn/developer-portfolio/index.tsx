import * as React from 'react'
import groq from 'groq'
import {sanityClient} from 'utils/sanity-client'
import Image from 'next/image'
import Link from 'next/link'
import {track} from 'utils/analytics'
import Markdown from 'react-markdown'

const DeveloperPortfolio: React.FC<any> = ({data}) => {
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
                        src={data.image}
                        width={300}
                        height={300}
                        alt={data.title}
                      />
                    </a>
                  </Link>
                </div>
                <div className="flex flex-col sm:items-start items-center w-full">
                  <h2 className="text-xs text-yellow-600 dark:text-yellow-300 uppercase font-semibold mb-2">
                    Craft a Portfolio that gets you hired
                  </h2>

                  <h1 className="sm:text-2xl md:text-4xl text-xl max-w-screen-lg font-extrabold leading-tighter">
                    {data.title}
                  </h1>

                  <Markdown
                    children={data.description}
                    className="prose dark:prose-dark dark:prose-md-dark prose-md mt-4"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeveloperPortfolio

export const developerPortfolioQuery = groq`*[_type == 'resource' && slug.current == "build-business-oriented-portfolio"][0]{
  title,
  description,
  "cta": content[0].description,
  path,
  slug,
  image,
  "clubs": resources[0].resources[]{
      title,
      subTitle,
      "slug": slug.current,
      path,
      image,
      summary,
	}
}`

export async function getStaticProps() {
  const data = await sanityClient.fetch(developerPortfolioQuery)

  return {
    props: {
      data,
    },
  }
}
