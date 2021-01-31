import React from 'react'
import cssPageData from './css-page-data'
import SearchCuratedEssential from '../curated-essential'

const SearchCSS = () => {
  return (
    <SearchCuratedEssential
      topic={{
        label: 'CSS',
        name: 'css',
        description: `Description text for CSS`,
      }}
      pageData={cssPageData}
    />
  )
}

export default SearchCSS
