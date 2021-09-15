import * as React from 'react'
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
      <div className="mx-auto max-w-screen-xl">
        <h1 className="py-16 mb-10 text-center lg:text-6xl md:text-5xl sm:text-4xl text-3xl w-full font-extrabold leading-tighter max-w-screen-lg m-auto">
          Articles
        </h1>

        <div className={`grid grid-cols-1 md:grid-cols-4 gap-8`}>
          {reactFeatures.map((resource: any) => {
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
        <div className={`grid grid-cols-1 md:grid-cols-4 gap-8`}>
          {javascriptFeatures.map((resource: any) => {
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
        <div className={`grid grid-cols-1 md:grid-cols-4 gap-8`}>
          {staffpickFeatures.map((resource: any) => {
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
      </div>
    </div>
  )
}

export default Blog

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
  "name": "article"
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
