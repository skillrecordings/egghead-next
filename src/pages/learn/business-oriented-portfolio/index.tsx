import * as React from 'react'
import groq from 'groq'
import {sanityClient} from 'utils/sanity-client'
import Image from 'next/image'
import Link from 'next/link'
import Markdown from 'react-markdown'
import {track} from 'utils/analytics'

const BusinessOrientedPortfolio: React.FC<any> = ({data}) => {
  return (
    <div className="sm:-my-5 -my-3 -mx-5 p-5 dark:bg-gray-900 bg-gray-50">
      <div className="mx-auto max-w-screen-xl">
        <div className="flex items-center justify-center bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-50 overflow-hidden rounded-lg shadow-sm">
          <h1> lol</h1>
        </div>
      </div>
    </div>
  )
}

export default BusinessOrientedPortfolio

export const businessOrientedPortfolioQuery = groq`*[_type == 'resource' && slug.current == "build-business-oriented-portfolio"][0]{
  title,
  description,
  path,
	image,
  resources[]{
    title,
  },
}`

export async function getStaticProps() {
  const data = await sanityClient.fetch(businessOrientedPortfolioQuery)

  return {
    props: {
      data,
    },
  }
}
