import * as React from 'react'
import Image from 'next/image'
import SearchCuratedEssential from '../curated-essential'
import Card from 'components/pages/home/card'
import {get, find} from 'lodash'
import Collection from 'components/pages/home/collection'
import data from './css-page-data'

const SearchCSS = () => {
  const resources: any = get(data, 'resources')
  const levels: any = get(
    find(resources, {slug: {current: 'css-by-skill-level'}}),
    'resources',
  )
  const animation: any = find(resources, {slug: {current: 'css-animation'}})

  return (
    <main className="max-w-screen-xl mx-auto lg:px-0 px-5">
      <SearchCuratedEssential
        verticalImage={data?.image}
        topic={{
          label: 'CSS',
          name: 'css',
          description: data.description,
        }}
        CTAComponent={CssFormStyling}
      />
      <div className="grid lg:grid-cols-3 md:grid-cols-1 grid-cols-1 sm:gap-8 gap-5 ">
        {levels?.map((resource: any) => {
          return (
            <Card
              location={data.slug.current}
              key={resource._id}
              resource={{...resource, title: resource.name, name: ''}}
            >
              <Collection />
            </Card>
          )
        })}
      </div>
      <div className="grid grid-cols-2 md:gap-8 gap-5 md:mt-8 mt-5">
        <Card resource={{...animation, name: ''}}>
          <Collection />
        </Card>
      </div>
    </main>
  )
}

const CssFormStyling: React.FC<{location: string}> = ({location}) => {
  const resource = {
    title: 'Accessible Cross-Browser CSS Form Styling',
    byline: 'Stephanie Eckles',
    name: 'FEATURED COURSE',
    description: `Confidently build out an accessiblility focused form design system that works in all browsers.`,
    image:
      'https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/425/628/full/EGH_accessible-css.png',
    background:
      'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1614094471/next.egghead.io/resources/accessible-cross-browser-css-form-styling/bg-for-accessible-cross-browser-css-form-styling_2x.png',
    path: '/courses/accessible-cross-browser-css-form-styling-7297',
    slug: 'accessible-cross-browser-css-form-styling-7297',
  }
  return (
    <div className="relative md:col-span-4">
      <div className="relative z-10">
        <Card
          className="text-center"
          key={resource.path}
          resource={resource}
          location={location}
        />
      </div>
    </div>
  )
}

const UniqueBackground = ({className, background}: any) => {
  return background ? (
    <Image
      priority={true}
      quality={100}
      className={className}
      alt=""
      layout="fill"
      src={
        background ||
        'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1612373331/next.egghead.io/resources/introduction-to-cloudflare-workers-5aa3/introduction-to-cloudflare-workers-cover_2.png'
      }
    />
  ) : null
}

export default SearchCSS
