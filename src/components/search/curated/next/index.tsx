import React from 'react'
import nextPageData from './next-page-data'
import SearchCuratedEssential from '../curated-essential'

const SearchNext = () => {
  return (
    <SearchCuratedEssential
      topic={{
        label: 'Next.js',
        name: 'next',
        description: `Description text for Next.js`,
      }}
      pageData={nextPageData}
    />
  )
}

export default SearchNext
