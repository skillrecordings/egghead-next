import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import SearchCuratedEssential from '../curated-essential'
import {bpMinMD} from 'utils/breakpoints'
import analytics, {track} from 'utils/analytics'
import {get, find} from 'lodash'
import data from './css-page-data'
import ExternalTrackedLink from 'components/external-tracked-link'
import {VerticalResourceCollectionCard} from '../../../card/vertical-resource-collection-card'

const SearchCSS = () => {
  const resources: any = get(data, 'resources')
  const levels: any = get(
    find(resources, {slug: {current: 'css-by-skill-level'}}),
    'resources',
  )
  const animation: any = find(resources, {slug: {current: 'css-animation'}})

  return (
    <>
      <SearchCuratedEssential
        verticalImage={data?.image}
        topic={{
          label: 'CSS',
          name: 'css',
          description: data.description,
        }}
        CTAComponent={CssFormStyling}
      />
      <div className="grid grid-cols-1 mt-8 gap-5 lg:grid-cols-3 md:grid-cols-1">
        {levels?.map((resource: any) => {
          return (
            <VerticalResourceCollectionCard
              location={data.slug.current}
              key={resource._id}
              resource={{
                ...resource,
                title: resource.name,
                name: '',
              }}
            />
          )
        })}
      </div>
      <div className="grid md:grid-cols-2 gap-5 mt-5 md:gap-8 md:mt-8">
        <VerticalResourceCollectionCard resource={{...animation, name: ''}} />
      </div>
    </>
  )
}

const CssFormStyling: React.FC<React.PropsWithChildren<{location: string}>> = ({
  location,
}) => {
  const {path, title, byline, name, description, image, background, slug} = {
    title: 'Just Enough CSS to Build Modern UI',
    byline: 'Guide • 5 Courses • 2 Projects',
    name: 'FEATURED GUIDE',
    description: `Building user interfaces is an essential skill for every web developer to continue to level up in. It's a core skill that you need to keep sharp.`,
    image:
      'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1686234654/egghead-next-pages/paths/just-enough-css-for-modern-app-development/css-path-feature-image.png',
    background:
      'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1686837651/egghead-next-pages/paths/just-enough-css-for-modern-app-development/feature-card-background--css-guide-vertical.png',
    path: '/guides/just-enough-css-for-modern-app-development',
    slug: 'just-enough-css-for-modern-app-development',
  }
  return (
    <Link href={path}>
      <a
        className="md:min-h-[477px] block md:col-span-4 w-full h-full overflow-hidden border-0 border-gray-100 relative text-center"
        onClick={() =>
          analytics.events.activityInternalLinkClick('guide', path, 'CSS')
        }
      >
        <div className="md:-mt-5 flex items-center justify-center bg-white dark:bg-gray-900 text-white overflow-hidden rounded-b-lg md:rounded-t-none rounded-t-lg shadow-sm">
          <div className="relative z-10 px-5 py-10 text-center sm:py-16 sm:text-left">
            <div className="flex items-center justify-center max-w-screen-xl mx-auto space-y-5">
              <div className="flex flex-col items-center justify-center space-y-5 sm:space-x-5 sm:space-y-0">
                <div className="flex-shrink-0">
                  <Image
                    quality={100}
                    src={get(image, 'src', image)}
                    width={250}
                    height={250}
                    alt={get(image, 'alt', `illustration for ${title}`)}
                    className="hover:scale-105 transition-all"
                  />
                </div>
                <div className="flex flex-col items-center sm:items-start">
                  <p className="mb-2 text-xs font-semibold text-white uppercase">
                    {byline}
                  </p>
                  <h2 className="text-xl font-extrabold leading-tighter hover:text-[#2faeff]">
                    {title}
                  </h2>
                  <p className="mt-4">{description}</p>
                </div>
              </div>
            </div>
          </div>
          <Image
            className="absolute top-0 left-0 z-0 w-full h-full"
            src={background}
            alt=""
            layout="fill"
          />
        </div>
      </a>
    </Link>
  )
}

export default SearchCSS
