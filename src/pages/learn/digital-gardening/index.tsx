import * as React from 'react'
import groq from 'groq'
import {sanityClient} from 'utils/sanity-client'

const DigitalGardening: React.FC<any> = ({data}) => {
  return <h1>{data.title}</h1>
}

export default DigitalGardening

export const digitalGardeningQuery = groq`*[_type == 'resource' && slug.current == "digital-gardening-for-developers"][0]{
  title,
  description,
  'illustration': images[label == 'eggo'][0]{
    url,
    alt
  },
  'quote': content[title == 'quote'][0]{
    description
  },
  resources[]{
    title,
    byline,
    'name': content[title == 'name'][0].description,
    'path': resources[]->[0].path,
    'image': resources[]->[0].image
  }
}`

export async function getStaticProps() {
  const data = await sanityClient.fetch(digitalGardeningQuery)

  return {
    props: {
      data,
    },
  }
}
