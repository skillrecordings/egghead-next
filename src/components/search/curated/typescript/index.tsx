import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import typescriptPageData from './typescript-page-data'
import SearchCuratedEssential from '../curated-essential'
import {bpMinMD} from 'utils/breakpoints'
import {find} from 'lodash'
import {VerticalResourceCollectionCard} from 'components/card/vertical-resource-collection-card'

const SearchTypescript = () => {
  const location = 'typescript landing'
  const podcasts: any = find(typescriptPageData, {id: 'podcasts'})
  const playlists: any = find(typescriptPageData, {id: 'playlists'})
  const algorithms: any = find(typescriptPageData, {
    id: 'algorithms',
  })
  const stateManagement: any = find(typescriptPageData, {
    id: 'stateManagement',
  })
  const designResources: any = find(typescriptPageData, {id: 'design'})

  return (
    <SearchCuratedEssential
      topic={{
        label: 'TypeScript',
        name: 'typescript',
        description: `Over the last several years, TypeScript has been coming on strong with the idea that static types get out of your way and provide deep benefits to code bases of all shapes and sizes, while allowing the flexibility of dynamic types when needed.

TypeScript is a great idea that provides a mature ecosystem, building on top of the ECMAScript we (mostly) all love, while adding protection and resilience to our application without a lot of added hassle or pain.

Love them or hate them, static types are here to stay, and at the very least an interesting concept that deserves inspection and conversation.
        `,
      }}
      pageData={typescriptPageData}
      CTAComponent={CourseFeatureCard}
    >
      <div>
        {/* Featured Section */}
        <section className="grid lg:grid-cols-12 grid-cols-1 items-start mt-12 ">
          <div className="md:col-span-8 mr-0 md:mr-5">
            <VerticalResourceCollectionCard
              resource={designResources}
              location={location}
            />
            <VerticalResourceCollectionCard
              className="mt-5"
              resource={stateManagement}
              location={location}
            />
          </div>
          <VerticalResourceCollectionCard
            className="sm:mt-0 mt-5 col-span-4 h-full"
            resource={algorithms}
            location={location}
          />
        </section>

        {/* Playlists and Podcasts */}
        <section className="grid md:grid-cols-2 grid-cols-1 gap-5 items-start mt-12">
          <VerticalResourceCollectionCard
            resource={podcasts}
            location={location}
            className="h-full"
          />
          <VerticalResourceCollectionCard
            resource={playlists}
            location={location}
            className="h-full"
          />
        </section>
      </div>
    </SearchCuratedEssential>
  )
}

const CourseFeatureCard = ({resource, className}: any) => {
  return (
    <Link href="/courses/advanced-typescript-fundamentals-579c174f">
      <a
        className={`block md:col-span-4 w-full h-full overflow-hidden border-0 border-gray-100 relative text-center ${
          className ? className : ''
        }`}
      >
        <div className="items-center h-full w-full block bg-white dark:bg-gray-800">
          <div className="md:min-h-[477px] relative z-10 flex flex-col h-full justify-between  items-center sm:p-8 p-5">
            <div className="flex flex-col items-center">
              <Image
                src="https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/433/579/full/typescript.png"
                width={200}
                height={200}
                alt="Advanced TypeScript Fundamentals"
              />
              <h2 className="text-xl font-bold min-w-full mt-4 sm:mt-14 mb-2 leading-tighter group-hover:underline">
                Advanced TypeScript Fundamentals
              </h2>
              <span className="text-sm opacity-80">Marius Schulz</span>
              <p className="text-sm mt-4">
                Learn the newest language features TypeScript has to offer.
                Learn how to use optional chaining, const assertions,
                conditional types, and more!
              </p>
            </div>
          </div>
          <img
            className="absolute top-0 left-0 z-0 w-full object-fit"
            src="https://res.cloudinary.com/dg3gyk0gu/image/upload/v1619808981/next.egghead.io/resources/advanced-typescript-fundamentals/background-feature-card-v2.svg"
            alt=""
          />
        </div>
      </a>
    </Link>
  )
}

export default SearchTypescript
