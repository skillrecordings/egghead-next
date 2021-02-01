import React from 'react'
import nodePageData from './node-page-data'
import SearchCuratedEssential from '../curated-essential'

const SearchNode = () => {
  return (
    <SearchCuratedEssential
      topic={{
        label: 'Next.js',
        name: 'next',
        description: `Description text for Next.js`,
      }}
      pageData={nodePageData}
    />
  )
}

export default SearchNode
