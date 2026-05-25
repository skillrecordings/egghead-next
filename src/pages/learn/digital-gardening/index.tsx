import * as React from 'react'
import Image from 'next/legacy/image'
import Link from 'next/link'
import Markdown from 'react-markdown'
import {track} from '@/utils/analytics'
import {VerticalResourceCard} from '@/components/card/verticle-resource-card'
import rehypeRaw from 'rehype-raw'
import standalonePageData from '@/data/standalone-page-data.json'

const DigitalGardening: React.FC<React.PropsWithChildren<any>> = ({data}) => {
  return (
    <div className="py-5 dark:bg-gray-900 bg-gray-50">
      <div className="container">
        <div className="flex items-center justify-center overflow-hidden text-gray-700 bg-white rounded-lg shadow-sm dark:bg-gray-800 dark:text-gray-50">
          <div className="px-5 py-10 text-center sm:py-16 sm:text-left">
            <div className="flex items-center justify-center w-full mx-auto space-y-5 lg:px-8">
              <div className="flex flex-col items-center justify-center w-full space-y-5 lg:flex-row sm:space-x-10 sm:space-y-0 0 xl:pr-16">
                <div className="flex-shrink-0">
                  <Link
                    href={data.path}
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
                  </Link>
                </div>
                <div className="flex flex-col items-center w-full sm:items-start">
                  <h2 className="mb-2 text-xs font-semibold text-green-600 uppercase dark:text-green-300">
                    {data.cta.description}
                  </h2>

                  <h1 className="max-w-screen-lg text-xl font-extrabold sm:text-2xl md:text-4xl leading-tighter">
                    {data.title}
                  </h1>

                  <Markdown
                    rehypePlugins={[rehypeRaw]}
                    className="max-w-screen-sm mt-4 text-base text-gray-700 dark:text-gray-50"
                  >
                    {data.description}
                  </Markdown>
                  <Markdown
                    rehypePlugins={[rehypeRaw]}
                    className="max-w-screen-sm mt-4 text-base text-gray-700 dark:text-gray-50"
                  >
                    {data.quote.description}
                  </Markdown>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="grid grid-cols-1 gap-5 mt-5 lg:grid-cols-12">
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

        <div className="py-10 text-center sm:py-16 sm:text-left">
          <div className="flex items-center justify-center w-full mx-auto space-y-5 lg:px-8">
            <div className="flex flex-col items-center justify-center w-full space-y-5 lg:flex-row sm:space-x-10 sm:space-y-0 0 xl:pr-16">
              <div className="mx-auto">
                <h2 className="mb-2 text-xs font-semibold text-center text-yellow-600 uppercase dark:yellow-green-300">
                  {data.talks.cta}
                </h2>

                <h1 className="max-w-screen-lg text-xl font-extrabold sm:text-2xl md:text-4xl leading-tighter">
                  {data.talks.title}
                </h1>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-5 mt-5 lg:grid-cols-12">
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

export async function getStaticProps() {
  return {
    props: {
      data: standalonePageData.digitalGardening,
    },
  }
}
