import * as React from 'react'
import Card from 'components/pages/home/card'
import SearchCuratedEssential from '../curated-essential'
import LoadDataFromSanity from './sanity-loading-data'
import {slice} from 'lodash'
import Collection from 'components/pages/home/collection'

const SearchCSS = () => {
  const data = LoadDataFromSanity()
  const {resources} = data || {}
  const levels = slice(resources, 0, 3)
  const rest = slice(resources, 3, resources?.length)

  return (
    <main className="max-w-screen-xl mx-auto lg:px-0 px-5">
      <SearchCuratedEssential
        verticalImage={data?.image}
        topic={{
          label: 'CSS',
          name: 'css',
          description: data?.description,
        }}
      />
      <div className="grid lg:grid-cols-3 md:grid-cols-1 grid-cols-1 sm:gap-8 gap-5 ">
        {levels?.map((resource: any) => {
          return (
            <Card
              location={data.slug}
              key={resource._id}
              resource={{...resource, title: resource.name, name: ''}}
            >
              <Collection />
            </Card>
          )
        })}
      </div>
      <div className="grid grid-cols-2 md:gap-8 gap-5 md:mt-8 mt-5">
        {rest.map((resource: any) => {
          return (
            <Card resource={{...resource, name: ''}}>
              <Collection />
            </Card>
          )
        })}
      </div>
    </main>
  )
}

export default SearchCSS
