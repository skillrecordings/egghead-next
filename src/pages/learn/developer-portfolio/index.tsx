import * as React from 'react'
import groq from 'groq'
import {sanityClient} from 'utils/sanity-client'

const developerPortfolio: React.FC<any> = ({data}) => {
  return <h1>{data.title}</h1>
}

export default developerPortfolio

export const developerPortfolioQuery = groq`*[_type == 'resource' && slug.current == "build-business-oriented-portfolio"][0]{
  title,
  description,
 	"slug": slug.current,
  "clubs": resources[0].resources[]{
      title,
      subTitle,
      "slug": slug.current,
      meta,
      image,
      summary,
	}
}`

export const reduxClubQuery = groq`*[_type == 'resource' && slug.current == "build-business-oriented-portfolio"][0]{
  "redux": resources[0].resources[slug.current == "redux"][0]{
      title,
      subTitle,
      description,
      "slug": slug.current,
      meta,
      image,
      summary,
    }
}`

export const xStateClubQuery = groq`*[_type == 'resource' && slug.current == "build-business-oriented-portfolio"][0]{
  "xstate": resources[0].resources[slug.current == "xstate"][0]{
      title,
      subTitle,
      description,
      "slug": slug.current,
      meta,
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
