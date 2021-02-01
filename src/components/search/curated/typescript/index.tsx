import React from 'react'
import typescriptPageData from './typescript-page-data'
import SearchCuratedEssential from '../curated-essential'

const SearchTypescript = () => {
  return (
    <SearchCuratedEssential
      topic={{
        label: 'TypeScript',
        name: 'typescript',
        description: `Description text for TypeScript`,
      }}
      pageData={typescriptPageData}
    />
  )
}

export default SearchTypescript
