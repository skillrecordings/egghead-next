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
        description: `TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.`,
      }}
      pageData={typescriptPageData}
    >
      <div className="mb-10 pb-10 py-5 xl:px-0 px-5 max-w-screen-xl mx-auto">
        {/* Featured Section */}
        <section className="grid lg:grid-cols-12 grid-cols-1 items-start sm:mt-12 mt-4 gap-5">
          <div className="md:col-span-8 gap-5">
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
            className="col-span-4"
            resource={algorithms}
            location={location}
          >
            <Collection />
          </Card>
        </section>

        {/* Playlists and Podcasts */}
        <section className="grid md:grid-cols-2 grid-cols-1 gap-5 items-start mt-8">
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
