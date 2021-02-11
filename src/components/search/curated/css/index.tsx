import * as React from 'react'
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

export default SearchCSS
