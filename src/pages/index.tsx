import React, {FunctionComponent} from 'react'
import {NextSeo} from 'next-seo'
import Home from 'components/pages/home'
import groq from 'groq'
import {sanityClient} from 'utils/sanity-client'
import InstructorsIndex from 'components/search/instructors'

const IndexPage: FunctionComponent = ({sections}: any) => {
  return (
    <>
      <NextSeo
        canonical={process.env.NEXT_PUBLIC_DEPLOYMENT_URL}
        openGraph={{
          images: [
            {
              url:
                'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1617697492/next.egghead.io/cards/egghead.io-digital-garden-cli-with-rust_2x.png',
            },
          ],
        }}
      />
      <main className="bg-gray-50 dark:bg-gray-900 sm:-my-5 -my-3 -mx-5 p-5">
        <div className="max-w-screen-xl mx-auto">
          <Home sections={sections} />
        </div>
      </main>
    </>
  )
}

export default IndexPage

const digitalGardeningQuery = groq`
*[_type == 'resource' && slug.current == "digital-gardening-for-developers"][0]{
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
}
`

export async function getStaticProps() {
  const digitalGardeningFeature = await sanityClient.fetch(
    digitalGardeningQuery,
  )

  return {
    props: {
      sections: [digitalGardeningFeature],
    },
  }
}
