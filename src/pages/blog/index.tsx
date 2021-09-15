import * as React from 'react'
import {FunctionComponent} from 'react'
import Link from 'next/link'
import Image from 'next/image'
import groq from 'groq'
import {sanityClient} from 'utils/sanity-client'
import {parse} from 'date-fns'
import friendlyTime from 'friendly-time'
import {HorizontalResourceCard} from 'components/card/horizontal-resource-card'
import {VerticalResourceCard} from 'components/card/verticle-resource-card'
import {find} from 'lodash'
import {map, get, isEmpty} from 'lodash'

const UpdatedAt: React.FunctionComponent<{date: string}> = ({date}) => (
  <div>{date}</div>
)
const Blog: React.FC = ({allArticles}: any) => {
  const reactFeatures: any = get(allArticles, 'reactFeatures')
  const javascriptFeatures: any = get(allArticles, 'javascriptFeatures')
  const staffpickFeatures: any = get(allArticles, 'staffpickFeatures')

  return (
    <div className="bg-gray-50 dark:bg-gray-900 sm:-my-5 -my-3 -mx-5 p-5">
      <div className="mx-auto max-w-screen-xl mt-10 mb-10">
        <h1 className="py-16 text-center lg:text-6xl md:text-5xl sm:text-4xl text-3xl w-full font-extrabold leading-tighter max-w-screen-lg m-auto">
          Comprehensive{' '}
          <span className="dark:text-blue-300 text-blue-500">
            Written Resources
          </span>{' '}
          To Help You Climb the Engineering Career Ladder
        </h1>

        <div className="mt-20 sm:mt-24">
          <FeatureRow
            resource={reactFeatures}
            subtitle="Deep Dive into React"
            name="Browse more React"
            searchPath="/q/react"
          />
        </div>

        <div className="mt-20 sm:mt-24">
          <FeatureRow
            resource={javascriptFeatures}
            subtitle="Deep Dive into JavaScript"
            name="Browse more JavaScript"
            searchPath="/q/javascript"
          />
        </div>

        <div className="mt-20 sm:mt-24">
          <FeatureRow
            resource={staffpickFeatures}
            subtitle="Recent Published Resources"
            name="Browse Popular Courses"
            searchPath="/q/"
          />
        </div>
      </div>
    </div>
  )
}

export default Blog

const FeatureRow: FunctionComponent<any> = ({
  resource,
  subtitle,
  name,
  searchPath,
  location = 'blog',
}) => {
  console.log(resource)
  return (
    <section className="sm:-my-5 -my-3 mx-auto max-w-screen-xl">
      <div className="flex mb-4 items-center">
        <h2 className="flex-1 md:text-xl text-lg font-bold dark:text-white">
          {subtitle}
        </h2>

        {searchPath && (
          <Link href={searchPath}>
            <a className="text-base font-medium transition ease-in-out duration-150 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 py-2 px-3 text-blue-500">
              {name} →
            </a>
          </Link>
        )}
      </div>

      <div className={`grid grid-cols-1 md:grid-cols-4 gap-8`}>
        {resource.map((resource: any) => {
          return (
            <div key={resource.path}>
              <VerticalResourceCard
                className="col-span-3 sm:col-span-1 text-center shadow-sm h-full"
                key={resource.path}
                resource={resource}
              />
            </div>
          )
        })}
      </div>
    </section>
  )
}

const reactFeaturesQuery = groq`
*[_type=="post" && references(*[_type=="software-library" && name == "react"]._id)][0...8]{
  title,
  "path": slug,
  publishedAt,
  "byline": authors[0].author -> name,
  "image": softwareLibraries[0].library-> {"src": image.url},
  "name": "article"
}
`

const javascriptFeaturesQuery = groq`
*[_type=="post" && references(*[_type=="software-library" && name == "javascript"]._id)][0...8]{
  title,
  "path": slug,
  publishedAt,
  "byline": authors[0].author -> name,
  "image": softwareLibraries[0].library-> {"src": image.url},
  "name": "article"
}
`

const staffpickFeaturesQuery = groq`
*[_type=="post" && references(*[_type=="software-library" && name != "react" && name != "javascript"]._id)]{
  title,
  "path": slug,
  publishedAt,
  "byline": authors[0].author -> name,
  "image": softwareLibraries[0].library-> {"src": image.url},
  "name": "article",
}
`

const featureQuery = groq`
{
  'reactFeatures': ${reactFeaturesQuery},
  'javascriptFeatures': ${javascriptFeaturesQuery},
  'staffpickFeatures': ${staffpickFeaturesQuery},
}
`

export async function getStaticProps() {
  const allArticles = await sanityClient.fetch(featureQuery)

  return {
    props: {
      allArticles,
    },
  }
}
