import React from 'react'
import nextPageData from './next-page-data'
import Card from 'components/pages/home/card'
import SearchCuratedEssential from '../curated-essential'

const SearchNext = () => {
  return (
    <SearchCuratedEssential
      topic={{
        label: 'Next.js',
        name: 'next',
        description: `Next.js gives you the best developer experience with all the features you need for production: hybrid static & server rendering, TypeScript support, smart bundling, route pre-fetching, and more. No config needed.`,
      }}
      CTAComponent={EcommerceCTA}
    />
  )
}

const EcommerceCTA: React.FC<{location: string}> = ({location}) => {
  const resource = {
    slug: 'create-an-ecommerce-store-with-next-js-and-stripe-checkout',
    id: 'portfolioProject',
    name: 'Portfolio Project',
    title: 'Create an eCommerce Store with Next.js and Stripe Checkout',
    path:
      '/projects/create-an-ecommerce-store-with-next-js-and-stripe-checkout',
    image:
      'https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/412/781/square_480/ecommerce-stripe-next.png',
    byline: 'Colby Fayock',
    description:
      'Build a modern eCommerce store with the best-in-class tools available to web developers to add to your portfolio.',
  }
  return (
    <Card
      className="md:col-span-4 text-center"
      key={resource.path}
      resource={resource}
      location={location}
    />
  )
}

export default SearchNext
