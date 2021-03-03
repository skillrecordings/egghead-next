import React from 'react'
import gatsbyPageData from './gatsby-page-data'
import Image from 'next/image'
import Link from 'next/link'
import {get, find} from 'lodash'
import Markdown from 'react-markdown'
import {bpMinMD} from 'utils/breakpoints'
import {track} from 'utils/analytics'
import SearchCuratedEssential from '../curated-essential'
import ExternalTrackedLink from 'components/external-tracked-link'
import LaurieBarthPageData from 'components/search/instructors/laurie-barth/laurie-barth-page-data'
import ResourceCta from 'components/search/instructors/laurie-barth/resource-cta'

const SearchGatsby = () => {
  return (
    <SearchCuratedEssential
      topic={{
        label: 'Gatsby',
        name: 'gatsby',
        description: `Gatsby is a blazing fast static site generator built with React. Gatsby gives you all of the modern JavaScript tools you want; set up and ready to go out of the box.`,
      }}
      pageData={gatsbyPageData}
      CTAComponent={GatsbyCTA}
    />
  )
}

const GatsbyCTA = () => {
  const instructorData: any = find(LaurieBarthPageData, {
    id: 'instructor-data',
  })
  return <ResourceCta instructorData={instructorData} />
}

export default SearchGatsby
