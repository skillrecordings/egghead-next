import React from 'react'
import Link from 'next/link'
import {connectHits} from 'react-instantsearch-dom'

const CustomHits = ({hits}) => (
  <div>
    {hits.map((hit) => (
      <HitComponent key={hit.objectID} hit={hit} />
    ))}
  </div>
)

const Hits = connectHits(CustomHits)

const HitComponent = ({hit}) => {
  const {path, type, image, summary, title} = hit
  return (
    <Link href={`/${type}s/[id]`} as={path}>
      <a className="grid grid-cols-4 gap-4 items-center mb-5">
        <div className="col-span-1 items-center flex justify-center">
          <img
            className="w-24"
            src={`${image}`}
            alt={`illustration for ${title}`}
          />
        </div>
        <div className="col-span-3">
          <h1 className="md:text-2xl text-xl font-semibold leading-tight">
            {title}
          </h1>
          <div>{type}</div>
          <p className="prose max-w-none">{summary}</p>
        </div>
      </a>
    </Link>
  )
}

export default Hits
