import React, {FunctionComponent} from 'react'
import {connectHits} from 'react-instantsearch-dom'
import HitComponent from './components/hit'

type CustomHitsProps = {
  hits: any[]
}

const CustomHits: FunctionComponent<CustomHitsProps> = ({hits}) => (
  <div className="grid grid-col-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-max gap-3 p-3">
    {hits.map((hit) => (
      <HitComponent key={hit.objectID} hit={hit} />
    ))}
  </div>
)

const Hits = connectHits(CustomHits)

export default Hits
