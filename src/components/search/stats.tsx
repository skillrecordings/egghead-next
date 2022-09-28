import React from 'react'
import {connectStats} from 'react-instantsearch-dom'

type CustomStatsProps = {
  nbHits: number
  searchQuery: string
}

const CustomStats: React.FunctionComponent<CustomStatsProps> = ({
  nbHits,
  searchQuery,
}) => {
  return !searchQuery || /^\s*$/.test(searchQuery) ? (
    <div />
  ) : (
    <div className="sm:text-lg flex items-baseline flex-nowrap overflow-hidden max-w-full  pt-5 px-3">
      <div className="font-semibold whitespace-nowrap">
        {nbHits.toLocaleString()} results
      </div>
      <div className="ml-2 whitespace-nowrap flex overflow-hidden">
        found for "<div className="truncate">{searchQuery}</div>"
      </div>
    </div>
  )
}

const Stats = connectStats(CustomStats)

export default Stats
