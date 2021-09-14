import React, {FunctionComponent} from 'react'
import {connectStats} from 'react-instantsearch-dom'

type CustomStatsProps = {
  nbHits: number
  searchQuery: string
}

const CustomStats: FunctionComponent<CustomStatsProps> = ({
  nbHits,
  searchQuery,
}) => {
  return !searchQuery || /^\s*$/.test(searchQuery) ? (
    <div />
  ) : (
    <div>
      <span className="font-bold">{nbHits.toLocaleString()} results</span> found
      for "{searchQuery}"
    </div>
  )
}

const Stats = connectStats(CustomStats)

export default Stats
