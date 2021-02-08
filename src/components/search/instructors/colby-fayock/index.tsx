import {find, get} from 'lodash'
import Card from 'components/pages/home/card'
import Image from 'next/image'
import SearchInstructorEssential from '../instructor-essential'
import ExternalTrackedLink from 'components/external-tracked-link'
import Link from 'next/link'
import {track} from '../../../../utils/analytics'
import Markdown from 'react-markdown'
import React from 'react'

export default function SearchColbyFayock({instructor}: {instructor: any}) {
  const instructorData: any = find(pageData, {
    id: 'instructor-data',
  })

  const combinedInstructor = {...instructor, ...instructorData}

  const featureCourses: any = find(pageData, {id: 'feature-courses'})

  const EcommerceCTA: React.FC = () => {
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
        location={instructorData.location}
      />
    )
  }

  return (
    <SearchInstructorEssential
      instructor={combinedInstructor}
      CTAComponent={EcommerceCTA}
    >
      <div className="grid lg:grid-cols-12 grid-cols-1 gap-5 mt-8">
        {featureCourses.resources.map((resource: any) => {
          return (
            <Card
              className="col-span-6 text-center"
              key={resource.path}
              resource={resource}
              location={instructorData.location}
            />
          )
        })}
      </div>
    </SearchInstructorEssential>
  )
}

const pageData = [
  {
    id: 'instructor-data',
    name: 'Colby Fayock',
    company: 'Dev Advocate & Astrocoder Applitools',
    twitterHandle: 'colbyfayock',
    websiteURL: 'https://github.com/gaearon',
    slug: 'colby-fayock',
    location: 'Colby Fayock Instructor Page',
    ctaTitle: 'e-Commerce with Next.js & Stripe',
    imageUrl:
      'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1612049839/egghead-next-pages/instructors/dan-abramov-hero-image.png',
    ctaImage:
      'https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/412/781/full/ecommerce-stripe-next.png',
    ctaLink:
      '/playlists/create-an-ecommerce-store-with-next-js-and-stripe-checkout-562c',
    bio: `Colby helps others learn by doing through articles, videos, and courses about Javascript, React, and the static web. I'm a Lead UX & Front End Engineer passionate about tackling challenges that can help save people’s lives and make the world a better place.`,
  },
  {
    id: 'feature-courses',
    title: 'Feature Courses',
    name: 'Just starting out with JavaScript',
    resources: [
      {
        title: 'Build Maps with React Leaflet',
        byline: 'Colby Fayock・47m・Course',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/490/thumb/React_Leaflet_Final.png',
        path: '/courses/build-maps-with-react-leaflet',
        slug: 'build-maps-with-react-leaflet',
        description:
          "A Google Map embed is sufficient for showing a location, but doesn't leave you many customization options. React Leaflet to the rescue!",
      },
      {
        title: 'Automate with Javascript & Github Actions',
        byline: 'Colby Fayock・16m・Course',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/276/thumb/github_logo.png',
        path:
          '/playlists/create-a-new-github-action-to-automate-code-tasks-with-javascript-f1e9',
        slug:
          'create-a-new-github-action-to-automate-code-tasks-with-javascript-f1e9',
        description:
          'Github Actions are an awesome tool from Github that allows us to automate tasks using code-based workflow configuration files. ',
      },
    ],
  },
]
