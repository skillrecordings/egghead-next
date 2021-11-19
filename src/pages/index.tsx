import React, {FunctionComponent} from 'react'
import {NextSeo} from 'next-seo'
import Home from 'components/pages/home'
import groq from 'groq'
import {get} from 'lodash'
import {sanityClient} from 'utils/sanity-client'
import staticHomePageData from 'components/pages/home/homepage-data'
import {digitalGardeningQuery} from './learn/digital-gardening'
import {developerPortfolioQuery} from './learn/developer-portfolio'

const IndexPage: FunctionComponent = ({homePageData}: any) => {
  let courseOgImage = get(
    homePageData,
    'featureWhatsNew.primary.resources[0].mainOgImage',
  )
  return (
    <>
      <NextSeo
        canonical={process.env.NEXT_PUBLIC_DEPLOYMENT_URL}
        openGraph={{
          images: [
            {
              url: courseOgImage
                ? courseOgImage
                : 'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1632239045/og-image-assets/egghead-og-image.png',
            },
          ],
        }}
      />
      <main className="bg-gray-50 dark:bg-gray-900">
        <div className="container">
          <Home homePageData={homePageData} />
        </div>
      </main>
    </>
  )
}

export default IndexPage

export const whatsNewQuery = groq`*[_type == 'resource' && slug.current == "whats-new"][0]{
  title,
	'primary': resources[slug.current == 'new-page-primary-resource-collection'][0]{
 		resources[]->{
      title,
      'name': type,
      'description': summary,
    	path,
      byline,
    	image,
      'background': images[label == 'banner-image-blank'][0].url,
      'featureCardBackground': images[label == 'feature-card-background'][0].url,
      'mainOgImage': images[label == 'main-og-image'][0].url,
      'instructor': collaborators[]->[role == 'instructor'][0]{
        title,
        'slug': person->slug.current,
        'name': person->name,
        'path': person->website,
        'twitter': person->twitter,
        'image': person->image.url
  		},
    }
  },
	'secondary': resources[slug.current == 'new-page-secondary-resource-collection'][0]{
    resources[]{
      title,
      'name': type,
      'description': summary,
      path,
      byline,
      image,
      'instructor': collaborators[]->[role == 'instructor'][0]{
        title,
        'slug': person->slug.current,
        'name': person->name,
        'path': person->website,
        'twitter': person->twitter,
        'image': person->image.url
  		},
    }
  },
}`

export const homePageFeatures = groq`*[_type == 'resource' && slug.current == "home-page"][0]{
  'features': resources[]-> {
    title,
    slug,
    name,
    subTitle,
    path,
    resources[]->{
      title,
      'description': summary,
      path,
      'byline': meta,
      image,
      byline,
    },
      related[]->{
      title,
      'description': summary,
      path,
      'byline': meta,
      image,
      byline
    }
  }
}`

const featureQuery = groq`
{
  'featureDigitalGardening': ${digitalGardeningQuery},
  'featureWhatsNew': ${whatsNewQuery},
  'homePageFeatures': ${homePageFeatures},
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
