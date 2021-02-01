import React from 'react'
import angularPageData from './angular-page-data'
import SearchCuratedEssential from '../curated-essential'

const SearchAngular = () => {
  return (
    <SearchCuratedEssential
      topic={{
        label: 'Angular',
        name: 'angular',
        description: `Description text for Angular`,
      }}
      pageData={angularPageData}
    />
  )
}

export default SearchAngular
