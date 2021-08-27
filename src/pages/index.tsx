import React, {FunctionComponent} from 'react'
import {NextSeo} from 'next-seo'
import Home from 'components/pages/home'
import groq from 'groq'
import {sanityClient} from 'utils/sanity-client'
import staticHomePageData from 'components/pages/home/homepage-data'
import {digitalGardeningQuery} from './learn/digital-gardening'
import {developerPortfolioQuery} from './learn/developer-portfolio'

const IndexPage: FunctionComponent = ({homePageData}: any) => {
  return (
    <>
      <NextSeo
        canonical={process.env.NEXT_PUBLIC_DEPLOYMENT_URL}
        openGraph={{
          images: [
            {
              url: 'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1628710683/next.egghead.io/resources/build-a-real-time-data-syncing-chat-application-with-supabase-and-next-js/main-ogImage--nextjs--supabase.png',
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

export const whatsNewQuery = groq`*[_type == 'resource' && slug.current == "whats-new"][0]{
  title,
	'primary': resources[slug.current == 'new-page-primary-resource-collection'][0]{
 		resources[]->{
      title,
      'name': type,
      'description': summary,
    	path,
      'byline': meta,
    	image,
      'background': images[label == 'banner-image-blank'][0].url,
      'featureCardBackground': images[label == 'feature-card-background'][0].url,
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
      'name': type,
      title,
      path,
      byline,
      image,
    }
  },
}`

export const reactFeaturesQuery = groq`*[_type == 'resource' && slug.current == "react-features"][0]{
  title,
  subTitle,
  path,
  name,
  resources[]->{
    title,
    'description': summary,
    path,
    'byline': meta,
    image,
    byline
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
`

export const javascriptFeaturesQuery = groq`*[_type == 'resource' && slug.current == "javascript-features"][0]{
  title,
  subTitle,
  path,
  name,
  resources[]->{
    title,
    'description': summary,
    path,
    'byline': meta,
    image,
    byline
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
`

export const cssFeaturesQuery = groq`*[_type == 'resource' && slug.current == "css-features"][0]{
  title,
  subTitle,
  path,
  name,
  resources[]->{
    title,
    'description': summary,
    path,
    'byline': meta,
    image,
    byline
	}
}
`

export const reduxFeaturesQuery = groq`*[_type == 'resource' && slug.current == "redux-features"][0]{
  title,
  subTitle,
  path,
  name,
  resources[]->{
    title,
    'description': summary,
    path,
    'byline': meta,
    image,
    byline
	}
}
`

export const typescriptFeaturesQuery = groq`*[_type == 'resource' && slug.current == "typescript-features"][0]{
  title,
  subTitle,
  path,
  name,
  resources[]->{
    title,
    'description': summary,
    path,
    'byline': meta,
    image,
    byline
	}
}
`

export const kcdFeaturesQuery = groq`*[_type == 'resource' && slug.current == "kent-c-dodds-features"][0]{
  title,
  subTitle,
  path,
  name,
  resources[]->{
    title,
    'description': summary,
    path,
    'byline': meta,
    image,
    byline
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
`

const featureQuery = groq`
{
  'featureDigitalGardening': ${digitalGardeningQuery},
  'featureWhatsNew': ${whatsNewQuery},
  'featureDeveloperPortfolio': ${developerPortfolioQuery},
  'reactFeatures': ${reactFeaturesQuery},
  'javascriptFeatures': ${javascriptFeaturesQuery},
  'cssFeatures': ${cssFeaturesQuery},
  'reduxFeatures': ${reduxFeaturesQuery},
  'typescriptFeatures': ${typescriptFeaturesQuery},
  'kcdFeatures': ${kcdFeaturesQuery},
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
