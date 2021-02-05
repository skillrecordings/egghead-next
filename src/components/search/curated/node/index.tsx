import React from 'react'
import nodePageData from './node-page-data'
import SearchCuratedEssential from '../curated-essential'

const SearchNode = () => {
  return (
    <SearchCuratedEssential
      topic={{
        label: 'node.js',
        name: 'node',
        description: `Description text for Node.js`,
      }}
      pageData={nodePageData}
    />
  )
}

export default SearchNode
