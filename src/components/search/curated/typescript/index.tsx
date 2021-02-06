import React from 'react'
import typescriptPageData from './typescript-page-data'
import SearchCuratedEssential from '../curated-essential'
import Card from 'components/pages/home/card'
import Collection from 'components/pages/home/collection'
import {find} from 'lodash'

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
    >
      <div className="mb-10 pb-10 xl:px-0 max-w-screen-xl mx-auto">
        {/* Featured Section */}
        <section className="grid lg:grid-cols-12 grid-cols-1 items-start mt-12 ">
          <div className="md:col-span-8 mr-0 md:mr-5">
            <Card resource={designResources} location={location}>
              <Collection />
            </Card>
            <Card
              className="mt-5"
              resource={stateManagement}
              location={location}
            >
              <Collection />
            </Card>
          </div>
          <Card
            className="col-span-4 h-full"
            resource={algorithms}
            location={location}
          >
            <Collection />
          </Card>
        </section>

        {/* Playlists and Podcasts */}
        <section className="grid md:grid-cols-2 grid-cols-1 gap-5 items-start mt-12">
          <Card resource={podcasts} location={location} className="h-full">
            <Collection />
          </Card>
          <Card resource={playlists} location={location} className="h-full">
            <Collection />
          </Card>
        </section>
      </div>
    </SearchCuratedEssential>
  )
}

export default SearchTypescript
