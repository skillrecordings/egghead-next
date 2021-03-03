import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {track} from 'utils/analytics'

const SimpleScriptsCTA = ({instructorData}: any) => {
  const {
    feature: {title, image, path, byline, backgroundImage},
  } = instructorData
  return (
    <Link href={path}>
      <a
        onClick={() =>
          track('clicked featured resource', {
            location: instructorData.location,
            resource: path,
          })
        }
        className="relative dark:bg-gray-800 bg-white group block md:col-span-4 rounded-md w-full h-full overflow-hidden text-center shadow-sm dark:text-white"
      >
        <div className="flex flex-col items-center h-full">
          <div className="relative z-10 flex flex-col h-full justify-between p-8 items-center">
            <div className="flex flex-col items-center">
              <Image src={image} width={200} height={200} alt={title} />
              <h2 className="text-xl font-bold min-w-full mt-10 mb-2 leading-tighter group-hover:underline">
                {title}
              </h2>
              <span className="text-sm opacity-80">{byline}</span>
            </div>
          </div>
          <img
            className="absolute top-0 left-0 z-0"
            src={backgroundImage}
            alt=""
          />
        </div>
      </a>
    </Link>
  )
}

export default SimpleScriptsCTA
