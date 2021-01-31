import React from 'react'
import awsPageData from './aws-page-data'
import SearchCuratedEssential from '../curated-essential'

const SearchAws = () => {
  return (
    <SearchCuratedEssential
      topic={{
        label: 'AWS',
        name: 'aws',
        description: `Description text for AWS`,
      }}
      pageData={awsPageData}
    />
  )
}

export default SearchAws
