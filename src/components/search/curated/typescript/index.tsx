import React from 'react'
import typescriptPageData from './typescript-page-data'
import SearchCuratedEssential from '../curated-essential'

const SearchTypescript = () => {
  return (
    <SearchCuratedEssential
      topic={{
        label: 'TypeScript',
        name: 'typescript',
        description: `TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.`,
      }}
      pageData={typescriptPageData}
    />
  )
}

export default SearchTypescript
