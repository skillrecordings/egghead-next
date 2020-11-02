import React, {FunctionComponent} from 'react'
import Link from 'next/link'
import {connectHits} from 'react-instantsearch-dom'
import formatDuration from 'utils/format-duration'
import {convertTimeWithTitles} from 'utils/time-utils'

type CustomHitsProps = {
  hits: any[]
}

const CustomHits: FunctionComponent<CustomHitsProps> = ({hits}) => (
  <div>
    {hits.map((hit) => (
      <HitComponent key={hit.objectID} hit={hit} />
    ))}
  </div>
)

const Hits = connectHits(CustomHits)

type HitComponentProps = {
  hit: any
}

const HitComponent: FunctionComponent<HitComponentProps> = ({hit}) => {
  const {
    path,
    type,
    image,
    title,
    duration,
    instructor_avatar_url,
    instructor_name,
  } = hit

  return (
    <Link href={path}>
      <a className="flex items-center mb-5 w-full">
        <div className="col-span-1 items-center flex justify-center">
          <img
            className="w-16"
            src={`${image}`}
            alt={`illustration for ${title}`}
          />
        </div>
        <div className="flex items-center pl-4 w-full">
          <div className="flex flex-col w-2/3">
            <h2 className="text-lg font-semibold ml-0">{title}</h2>
            <div className="text-base text-gray-600">
              {type} • {convertTimeWithTitles(duration)}
            </div>
          </div>
          <div className="flex pl-6">
            <img
              className="w-6 h-6 rounded-full"
              src={`${instructor_avatar_url}`}
              alt={`illustration for ${title}`}
            />
            <div className="pl-2 text-gray-600">{instructor_name}</div>
          </div>
        </div>
      </a>
    </Link>
  )
}

export default Hits
