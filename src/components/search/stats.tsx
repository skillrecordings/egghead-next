import React from 'react'
import {useStats, StatsProps} from 'react-instantsearch'

const Stats: React.FunctionComponent<React.PropsWithChildren<StatsProps>> = (
  props,
) => {
  const {nbHits, query} = useStats(props)

  return !query || /^\s*$/.test(query) ? (
    <div />
  ) : (
    <div className="sm:text-lg flex items-baseline flex-nowrap overflow-hidden max-w-full  pt-5 px-3">
      <div className="font-semibold whitespace-nowrap">
        {nbHits.toLocaleString()} results
      </div>
      <div className="ml-2 whitespace-nowrap flex overflow-hidden">
        found for "<div className="truncate">{query}</div>"
      </div>
    </div>
  )
}

export default Stats
