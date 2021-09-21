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
    <div className="flex items-center flex-nowrap overflow-hidden max-w-full flex-grow mt-5 md:mt-0">
      <div className="font-bold whitespace-nowrap">
        {nbHits.toLocaleString()} results
      </div>
      <div className="ml-1 whitespace-nowrap flex overflow-hidden">
        found for "<div className="truncate">{searchQuery}</div>"
      </div>
    </div>
  )
}

const Stats = connectStats(CustomStats)

export default Stats
