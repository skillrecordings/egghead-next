import React, {FunctionComponent} from 'react'
import {NextSeo} from 'next-seo'
import Home from 'components/pages/home'
import groq from 'groq'
import {sanityClient} from 'utils/sanity-client'
import staticHomePageData from 'components/pages/home/homepage-data'
import {digitalGardeningQuery} from './learn/digital-gardening'
import {whatsNewQuery} from './new'
import {developerPortfolioQuery} from './learn/developer-portfolio'

const IndexPage: FunctionComponent = ({homePageData}: any) => {
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
          <Home homePageData={homePageData} />
        </div>
      </main>
    </>
  )
}

export default IndexPage

const featureQuery = groq`
{
  'featureDigitalGardening': ${digitalGardeningQuery},
  'featureWhatsNew': ${whatsNewQuery},
  'featureDeveloperPortfolio': ${developerPortfolioQuery},
}
`

export async function getStaticProps() {
  const sanityHomePageData = await sanityClient.fetch(featureQuery)

  return {
    props: {
      homePageData: {
        ...staticHomePageData,
        ...sanityHomePageData,
      },
    },
  }
}
