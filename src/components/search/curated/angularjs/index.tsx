import React from 'react'
import angularjsPageData from './angularjs-page-data'
import SearchCuratedEssential from '../curated-essential'

const SearchAngularJs = () => {
  return (
    <SearchCuratedEssential
      topic={{
        label: 'AngularJS',
        name: 'angularjs',
        description: `Description text for AngularJS`,
      }}
      pageData={angularjsPageData}
    />
  )
}

export default SearchAngularJs
