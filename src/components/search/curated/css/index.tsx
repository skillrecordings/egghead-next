import * as React from 'react'
import SearchCuratedEssential from '../curated-essential'
// import Card from 'components/pages/home/card'
// import LoadDataFromSanity from './sanity-loading-data'
// import {slice} from 'lodash'
// import Collection from 'components/pages/home/collection'

const SearchCSS = () => {
  // const data = LoadDataFromSanity()
  // const {resources} = data || {}
  // const levels = slice(resources, 0, 3)
  // const rest = slice(resources, 3, resources?.length)

  return (
    <main className="max-w-screen-xl mx-auto lg:px-0 px-5">
      <SearchCuratedEssential
        topic={{
          label: 'CSS',
          name: 'css',
          description: `Cascading Style Sheets is a style sheet language used for describing the presentation of a document written in a markup language such as HTML.\n\nNo matter what kind of website or web application you want to build, you'll have to use CSS. If you haven't written much CSS, or even if you’ve never written CSS at all, don’t worry. That's what these courses are for. We’ll start with basic CSS concepts, then gradually progress to more advanced topics and lessons.`,
        }}
        // verticalImage={data?.image}
      />
      {/* <div className="grid lg:grid-cols-3 md:grid-cols-1 grid-cols-1 sm:gap-8 gap-5 ">
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
      </div> */}
    </main>
  )
}

export default SearchCSS
