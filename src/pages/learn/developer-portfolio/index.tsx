import * as React from 'react'
import groq from 'groq'
import {sanityClient} from 'utils/sanity-client'
import Image from 'next/image'
import Link from 'next/link'
import {track} from 'utils/analytics'
import Markdown from 'react-markdown'

const DeveloperPortfolio: React.FC<React.PropsWithChildren<any>> = ({data}) => {
  return (
    <div className="dark:bg-gray-900 bg-gray-50">
      <div className="container mt-5">
        <div className="flex items-center justify-center overflow-hidden text-gray-700 bg-white rounded-lg shadow-sm dark:bg-gray-800 dark:text-gray-50">
          <div className="px-5 py-10 text-center sm:py-16 sm:text-left">
            <div className="flex items-center justify-center w-full mx-auto space-y-5 lg:px-8">
              <div className="flex flex-col items-center justify-center w-full space-y-5 lg:flex-row sm:space-x-10 sm:space-y-0 0 xl:pr-16">
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
                <div className="flex flex-col items-center w-full sm:items-start">
                  <h2 className="mb-2 text-xs font-semibold text-yellow-600 uppercase dark:text-yellow-300">
                    Craft a Portfolio that gets you hired
                  </h2>

                  <h1 className="max-w-screen-lg text-xl font-extrabold sm:text-2xl md:text-4xl leading-tighter">
                    {data.title}
                  </h1>

                  <Markdown
                    source={data.description}
                    className="mt-4 prose dark:prose-dark dark:prose-md-dark prose-md"
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
