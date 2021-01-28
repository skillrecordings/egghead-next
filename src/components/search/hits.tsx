import React, {FunctionComponent} from 'react'
import {connectHits} from 'react-instantsearch-dom'
import HitComponent from './components/hit'

type CustomHitsProps = {
  hits: any[]
}

const CustomHits: FunctionComponent<CustomHitsProps> = ({hits}) => (
  <div className="grid grid-col-1 lg:grid-cols-3 gap-x-12 auto-rows-max lg:gap-y-16 gap-y-2">
    {hits.map((hit) => (
      <HitComponent key={hit.objectID} hit={hit} />
    ))}
  </div>
)

const Hits = connectHits(CustomHits)

export default Hits
